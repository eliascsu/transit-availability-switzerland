import os
import pandas as pd

from flask_restful import Resource
from sklearn.cluster import KMeans

class PopulationResource(Resource):
    """
    Returns the file population.csv
    """
    data_root = os.path.join(".", "data")

    def get(self):
        path_name = os.path.join(self.data_root, "population.csv")
        data = pd.read_csv(path_name)

        return data.to_dict(orient="records")