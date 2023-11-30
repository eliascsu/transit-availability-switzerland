import os
from pandas_geojson import read_geojson

from flask_restful import Resource

class pt_stops_are(Resource):
    """
    Returns the file Oev_Haltestellen.geojson
    """
    data_root = os.path.join(".", "data")

    def get(self):
        path_name = os.path.join(self.data_root, "pt-stops.geojson")
        data = read_geojson(path_name)

        return data