import os
import pandas as pd

from flask_restful import Resource

class PopulationResource(Resource):
    """
    Returns the file population.csv
    """
    data_root = os.path.join(".", "data")

    def get(self):
        path_name = os.path.join(self.data_root, "dataset_population.csv")
        data = pd.read_csv(path_name)

        return data.to_dict(orient="records")