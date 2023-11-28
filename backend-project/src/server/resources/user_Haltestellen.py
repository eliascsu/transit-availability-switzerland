import os
import pprint
import json
from functools import lru_cache
import pandas as pd
from pandas_geojson import read_geojson, write_geojson
import numpy as np

from flask_restful import Resource, request

class Lock:
    locked = False
    def __init__(self):
        pass

    def acquire(self):
        while self.locked:
            pass
        self.locked = True
        return True
        
    def release(self):
        self.locked = False
        return True

class userHaltestellenResource(Resource):
    """
    Sets the file user_Haltestellen.geojson to the current list of userPoints
    """
    data_root = os.path.join(".", "data")
    population_data = pd.read_csv(os.path.join(data_root, "dataset_population.csv"))
    lock = Lock()

    def post(self):
        point_data = request.get_json()

        userHaltestellenResource.lock.acquire()
        with open(os.path.join(self.data_root, "dataset_user_Haltestellen.geojson"), "w+") as f:
            json.dump(point_data, f)

        userHaltestellenResource.lock.release()
        return point_data
    
    @staticmethod
    @lru_cache(maxsize=2048)
    def calculate_population_served_per_coordinate(x, y):
        R = 6371000  # radius of the Earth in meters
        
        def haversine_vectorized(lon1, lat1, lon2, lat2):
            lon1, lat1, lon2, lat2 = map(np.radians, [lon1, lat1, lon2, lat2])
            dlon = lon2 - lon1
            dlat = lat2 - lat1
            a = np.sin(dlat/2.0)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2.0)**2
            c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
            return R * c

        # Calculate Distance and Filter Points
        distances = haversine_vectorized(x, y, 
                                                userHaltestellenResource.population_data['lng'], 
                                                userHaltestellenResource.population_data['lat'], 
                                                )
        return userHaltestellenResource.population_data[distances <= 500]['pop_actual'].sum()

    def get(self):
        userHaltestellenResource.lock.acquire()
        with open(os.path.join(self.data_root, "dataset_user_Haltestellen.geojson")) as f:
            data = json.load(f)
        userHaltestellenResource.lock.release()

        sum = 0
        for feature in data["features"]:
            sum += self.calculate_population_served_per_coordinate(feature["geometry"]["coordinates"][0], feature["geometry"]["coordinates"][1])

        return {"population_served": int(sum)}

