import pandas as pd
import requests
from zipfile import ZipFile
import os
import numpy
import pyproj
from geojson import Point, Feature, FeatureCollection, dumps
from pyproj import CRS, transform
import warnings
LV95 = CRS.from_epsg(2056)
WGS84 = CRS.from_epsg(4326)

warnings.filterwarnings("ignore", category=FutureWarning)

URL = "https://dam-api.bfs.admin.ch/hub/api/dam/assets/27965868/master"
SAVE_PATH = "./backend/data/"
TMP_PATH = "./tmp/"
FNAME = "population"
CSV_NAME = "OeV_Haltestellen_ARE"

r = requests.get(URL)

with open(TMP_PATH + FNAME + ".zip", "wb+") as f:
    f.write(r.content)

with ZipFile(TMP_PATH + FNAME + ".zip", "r") as zipObj:
    zipObj.extractall(TMP_PATH + FNAME + "/")

# /tmp/population/ag-b-00.03-vz2022statpop/STATPOP2022.csv
with open(TMP_PATH + FNAME + "/ag-b-00.03-vz2022statpop/" + "STATPOP2022" + ".csv", "r") as f:
    df = pd.read_csv(f, sep=";")
    lat = df["E_KOORD"]
    lng = df["N_KOORD"]
    df = df.drop(columns=["E_KOORD", "N_KOORD", "RELI", "B22B11"])
    pop = df["B22BTOT"]
    max_pop = max(pop)
    transformer = pyproj.Transformer.from_crs(LV95, WGS84, always_xy=True)
    new_df = pd.DataFrame({"lat": lat, "lng": lng, "pop": pop})
    
    for i, (longitude, latitude, population) in enumerate(zip(lat, lng, pop)):
        if i % 10000 == 0:
            print(f"{i} of {len(lat.index)} done.")
        new_lat, new_lng = transformer.transform(longitude, latitude)
        lng.loc[i] = new_lat
        lat.loc[i] = new_lng
        pop.loc[i] = population / max_pop
    print(lat, lng, pop)
    # Write to csv
    nndf = pd.DataFrame({"lat": lat, "lng": lng, "pop": pop})
    nndf.to_csv(TMP_PATH + FNAME + "-updated.csv", index=False)