from zipfile import ZipFile
import requests
from csvtogjson import create_geojson

DOWNLOAD_URL = "https://data.geo.admin.ch/ch.are.gueteklassen_oev/gueteklassen_oev_2023/gueteklassen_oev_2023_2056.gpkg.zip"
SAVE_PATH = "./backend/data/"
TMP_PATH = "./tmp/"
FNAME = "gueteklassen_oev_2023"
CSV_NAME = "OeV_Haltestellen_ARE"

# Download the file from the URL
r = requests.get(DOWNLOAD_URL)
with open(TMP_PATH + "gueteklassen_oev_2023.gpkg.zip", "wb+") as f:
    f.write(r.content)

with ZipFile(TMP_PATH + "gueteklassen_oev_2023.gpkg.zip", "r") as zipObj:
    zipObj.extractall(TMP_PATH + "gk_are/")

# Convert to geojson
create_geojson(TMP_PATH + "gk_are/" + CSV_NAME + ".csv")