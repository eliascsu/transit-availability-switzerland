import os
import pandas as pd

from flask_restful import Resource

class PopulationHeatmap(Resource):
    """
    Returns the file Population.csv
    """
    data_root = os.path.join(".", "data")

    def get(self):
        path_name = os.path.join(self.data_root, "Population.csv")
        data = pd.read_csv(path_name)
        return data.to_dict(orient="records")
    
class PopulationUnserved(Resource):
    """
    Returns the file UnservedPopulation.csv
    """
    data_root = os.path.join(".", "data")

    def get(self):
        path_name = os.path.join(self.data_root, "UnservedPopulation.csv")
        data = pd.read_csv(path_name)

        return data.to_dict(orient="records")