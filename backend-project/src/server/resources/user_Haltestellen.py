import os
import pprint
import pandas as pd
from pandas_geojson import read_geojson, write_geojson
import numpy as np

from flask_restful import Resource, request

class userHaltestellenResource(Resource):
    """
    Sets the file user_Haltestellen.geojson to the current list of userPoints
    """
    data_root = os.path.join(".", "data")
    population_data = pd.read_csv(os.path.join(data_root, "dataset_population.csv"))

    def post(self):
        point_data = request.get_json()
        print(point_data["features"])
        for feature in point_data["features"]:
            print(feature["geometry"]["coordinates"])
        
        #path_name = os.path.join(self.data_root, "dataset_OeV_Haltestellen_ARE.geojson")
        with open(os.path.join(self.data_root, "dataset_user_Haltestellen.geojson"), "w+") as f:
            f.write(str(point_data).replace("'", '"'))
        
        path_name = os.path.join(self.data_root, "dataset_user_Haltestellen.geojson")
        data = read_geojson(path_name)

        return data        
    
    def calculate_population_served_per_coordinate(self, x, y):
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
                                                self.population_data['lng'], 
                                                self.population_data['lat'], 
                                                )
        return self.population_data[distances <= 500]['pop_actual'].sum()

    def get(self):
        data = read_geojson(os.path.join(self.data_root, "dataset_user_Haltestellen.geojson"))
        sum = 0
        for feature in data["features"]:
            sum += self.calculate_population_served_per_coordinate(self, feature["geometry"]["coordinates"][0], feature["geometry"]["coordinates"][1])
        print(sum)
        return {"population_served": sum}


    
        

# userHaltestellenResource.get(userHaltestellenResource)