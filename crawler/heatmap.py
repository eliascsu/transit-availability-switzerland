import pandas as pd
import requests
from zipfile import ZipFile
import pyproj
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
    pop = df["B22BTOT"]
    # Simplify df
    new_df = pd.DataFrame({"lat": lat, "lng": lng, "pop": pop})

    # Remove max two values of df without changing new_df
    new_df = new_df.drop(new_df["pop"].idxmax())
    new_df = new_df.drop(new_df["pop"].idxmax())

    max_pop = new_df["pop"].max()
    transformer = pyproj.Transformer.from_crs(LV95, WGS84, always_xy=True)
    
    for i, (longitude, latitude, population) in enumerate(zip(new_df["lat"], new_df["lng"], new_df["pop"])):
        if i % 10000 == 0:
            print(f"{i} of {len(lat.index)} done.")
        new_lat, new_lng = transformer.transform(longitude, latitude)
        new_df["lng"].loc[i] = new_lat
        new_df["lat"].loc[i] = new_lng
        # new_df["pop"].loc[i] = population / max_pop # Linear calculation

        new_df["pop"].loc[i] = ((population / 20) ** 2) + 0.5 if ((population / 20) ** 2) + 0.5 < 40 else 40
        
    # Write to csv
    # drop two last rows
    new_df = new_df.drop(new_df.tail(2).index)

    new_df.to_csv(TMP_PATH + FNAME + "-updated.csv", index=False)