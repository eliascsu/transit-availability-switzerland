import os
import json
import pandas as pd
from utils import haversine_vectorized
from constants import data_root

population = pd.read_csv(os.path.join(data_root, "dataset_population.csv"))

@staticmethod
def calculate_population_served_per_coordinate(x, y, kat):
    global population
    global points_not_served

    # Calculate Distance and Filter Points
    distances = haversine_vectorized(x, y, 
                                            population["lng"], 
                                            population["lat"], 
                                            )
    # Remove distances from population array
    if (kat == 1 or kat == 2):
        res = population[distances <= 1000]["pop_actual"].sum()
        population = population[distances > 1000]
    elif (kat == 3):
        res = population[distances <= 750]["pop_actual"].sum()
        population = population[distances > 750]
    elif (kat == 4):
        res = population[distances <= 500]["pop_actual"].sum()
        population = population[distances > 500]
    elif (kat == 5):
        res = population[distances <= 300]["pop_actual"].sum()
        population = population[distances > 250]
    elif (kat == 0): res = 0
    else: raise Exception(f"Invalid Kat {kat}")

    points_not_served = population
    return res

with open(os.path.join(data_root, "dataset_OeV_Haltestellen_ARE.geojson")) as f:
    public_transport = json.load(f)

total_population = population["pop_actual"].sum()
sum = 0

for i, feature in enumerate(public_transport["features"]):
    if i % 100 == 0:
        print("Progress: ", i, "/", len(public_transport["features"]), "Population Served: ", sum / total_population, "Population: ", sum)
    sum += calculate_population_served_per_coordinate(feature["geometry"]["coordinates"][0], feature["geometry"]["coordinates"][1] , feature["properties"]["Hst_Kat"])

points_not_served.to_csv(os.path.join(data_root, "dataset_unserved.csv"), index=False,)