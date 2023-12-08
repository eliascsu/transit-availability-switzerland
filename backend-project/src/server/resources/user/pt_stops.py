import os
import json
from functools import lru_cache
import pandas as pd
import numpy as np

from flask_restful import Resource, request

class _Lock:
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

class user_pt_stops(Resource):
    """
    Sets the file user_Haltestellen.geojson to the current list of userPoints
    """
    data_root = os.path.join(".", "data")
    population_data = pd.read_csv(os.path.join(data_root, "Population.csv"))
    lock = _Lock()

    def post(self):
        point_data = request.get_json()

        user_pt_stops.lock.acquire()
        with open(os.path.join(self.data_root, "user-pt-stops.geojson"), "w+") as f:
            json.dump(point_data, f)

        user_pt_stops.lock.release()
        return point_data
    
    @staticmethod
    @lru_cache(maxsize=2048)
    def calculate_population_served_per_coordinate(x, y):
        R = 6371000  # radius of the Earth in meters

        @lru_cache(maxsize=2048)
        def haversine_vectorized(lon1, lat1):
            lon2 = user_pt_stops.population_data['lng']
            lat2 = user_pt_stops.population_data['lat']
            lon1, lat1, lon2, lat2 = map(np.radians, [lon1, lat1, lon2, lat2])
            dlon = lon2 - lon1
            dlat = lat2 - lat1
            a = np.sin(dlat/2.0)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2.0)**2
            c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
            return R * c

        # Calculate Distance and Filter Points
        distances = haversine_vectorized(x, y)
        return user_pt_stops.population_data[distances <= 500]['pop_actual'].sum()

    def get(self):
        user_pt_stops.lock.acquire()
        with open(os.path.join(self.data_root, "user-pt-stops.geojson")) as f:
            data = json.load(f)
        user_pt_stops.lock.release()

        sum = 0
        for feature in data:
            print(feature["geometry"]["coordinates"])
            for coordinate in feature["geometry"]["coordinates"]:
                print(coordinate)
                sum += self.calculate_population_served_per_coordinate(coordinate[0], coordinate[1])

        return {"population_served": int(sum)}

