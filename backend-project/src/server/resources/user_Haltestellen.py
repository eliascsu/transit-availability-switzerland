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
        pprint.pprint(dict(request.form))
        #path_name = os.path.join(self.data_root, "dataset_OeV_Haltestellen_ARE.geojson")
        #write_geojson(geo_json, filename='random.geojson', indent=4)

        return None