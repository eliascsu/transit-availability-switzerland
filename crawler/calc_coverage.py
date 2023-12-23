import os
import json
import pandas as pd
from utils import haversine_vectorized
from constants import data_root
import time

time_start = time.time()

pop = pd.read_csv(os.path.join(data_root, "Population.csv"))
points_not_served = pd.DataFrame()

def calculate_population_served_per_coordinate(x, y, kat, population):
    # Calculate Distance and Filter Points
    if kat == 0:
        return population, 0
    distances = haversine_vectorized(x, y,
                                            population["lng"],
                                            population["lat"],
                                            )
    # Remove distances from population array
    if kat in (1, 2):
        res = population[distances <= 1000]["pop_actual"].sum()
        population = population[distances > 1000]
    elif kat == 3:
        res = population[distances <= 750]["pop_actual"].sum()
        population = population[distances > 750]
    elif kat == 4:
        res = population[distances <= 500]["pop_actual"].sum()
        population = population[distances > 500]
    elif kat == 5:
        res = population[distances <= 300]["pop_actual"].sum()
        population = population[distances > 250]

    else: res = 0

    return population, res


def main():
    with open(os.path.join(data_root, "pt-stops.geojson")) as f:
        public_transport = json.load(f)
    pop = pd.read_csv(os.path.join(data_root, "Population.csv"))
    total_population = pop["pop_actual"].sum()
    sum = 0

    for i, feature in enumerate(public_transport["features"]):
        if i % 100 == 0:
            print(
                "Progress: ", i, "/", len(public_transport["features"]),
                "Population Served: ", sum / total_population, "Population: ", sum)
        pop, s = calculate_population_served_per_coordinate(
            feature["geometry"]["coordinates"][0],
            feature["geometry"]["coordinates"][1],
            feature["properties"]["Hst_Kat"], pop
            )
        sum += s

    print("Total Population: ", total_population)
    print("Population Served: ", sum)
    print("Population Served %: ", sum / total_population)
    print("Number of public transport stops: ", len(public_transport["features"]))

    pop.to_csv(os.path.join(data_root, "UnservedPopulation.csv"), index=False,)

    time_end = time.time()

if __name__ == "__main__":
    main()