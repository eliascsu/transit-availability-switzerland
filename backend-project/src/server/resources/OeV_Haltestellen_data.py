import os
import pandas as pd
from pandas_geojson import read_geojson

from flask_restful import Resource

class OeVHaltestellenResource(Resource):
    """
    Returns the file Oev_Haltestellen.geojson
    """
    data_root = os.path.join(".", "data")

    def get(self):
        path_name = os.path.join(self.data_root, "dataset_OeV_Haltestellen_ARE")
       

        return data