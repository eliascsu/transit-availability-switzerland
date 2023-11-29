from io import BytesIO
from zipfile import ZipFile
import requests
from csvtogjson import create_geojson

def main():
    DOWNLOAD_URL = "https://data.geo.admin.ch/ch.are.gueteklassen_oev/gueteklassen_oev_2023/gueteklassen_oev_2023_2056.gpkg.zip"
    SAVE_PATH = "./backend/data/"

    CSV_NAME = "OeV_Haltestellen_ARE"
    r = requests.get(DOWNLOAD_URL)

    archive = ZipFile(BytesIO(r.content))
    csv = archive.open(CSV_NAME + ".csv")
    create_geojson(CSV_NAME + ".csv", csv)

if __name__ == "__main__":
    main()