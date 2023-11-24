import os
import pprint
import pandas as pd
from pandas_geojson import read_geojson, write_geojson

from flask_restful import Resource, request

class userHaltestellenResource(Resource):
    """
    Sets the file user_Haltestellen.geojson to the current list of userPoints
    """
    data_root = os.path.join(".", "data")

    def post(self):
        point_data = request.get_json()
        
        #path_name = os.path.join(self.data_root, "dataset_OeV_Haltestellen_ARE.geojson")
        with open(os.path.join(self.data_root, "dataset_user_Haltestellen.geojson"), "w+") as f:
            f.write(str(point_data).replace("'", '"'))

        return None
    
    