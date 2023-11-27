import pandas as pd
import requests
from zipfile import ZipFile
import pyproj
from pyproj import CRS, transform
import os
import warnings
LV95 = CRS.from_epsg(2056)
WGS84 = CRS.from_epsg(4326)

warnings.filterwarnings("ignore", category=FutureWarning)

URL = "https://dam-api.bfs.admin.ch/hub/api/dam/assets/27965868/master"
SAVE_PATH = "./backend/data/"
TMP_PATH = "./tmp/"
FNAME = "population"
CSV_NAME = "OeV_Haltestellen_ARE"

def download_and_extract(extract_to):
    response = requests.get(URL)
    if response.status_code == 200:
        zip_path = os.path.join(extract_to, FNAME + ".zip")
        with open(zip_path, 'wb+') as file:
            file.write(response.content)

        with ZipFile(zip_path, 'r') as zipObj:
            zipObj.extractall(extract_to)
    else:
        raise Exception(f"Failed to download file: Status code {response.status_code}")

def transform_coordinates(df):
    """Transform coordinates from LV95 to WGS84."""
    transformer = pyproj.Transformer.from_crs(LV95, WGS84, always_xy=True)
    transformed_coords = df.apply(lambda row: transformer.transform(row['E_KOORD'], row['N_KOORD']), axis=1)
    df[['lng', 'lat']] = pd.DataFrame(transformed_coords.tolist(), index=df.index)
    return df


def process_data():
    """Main function to process the data."""
    csv_path = os.path.join(TMP_PATH, FNAME, "ag-b-00.03-vz2022statpop", "STATPOP2022.csv")
    df = pd.read_csv(csv_path, sep=";")

    # Drop unused columns and normalize population
    df = df.drop(columns=["RELI", "B22B11"])
    # Normalize population using this formula
    # ((population / 20) ** 2) + 0.5 if ((population / 20) ** 2) + 0.5 < 40 else 40
    df['pop'] = ((df['B22BTOT'] / 20) ** 2) + 0.5
    df.loc[df['pop'] > 40, 'pop'] = 40

    # Transform coordinates
    df = transform_coordinates(df[['E_KOORD', 'N_KOORD', 'pop']])
    df = df.drop(columns=['E_KOORD', 'N_KOORD'])
    new_order = ['lat', 'lng', 'pop']
    df = df.reindex(columns=new_order)
    df.rename(columns={'pop': 'intensity'}, inplace=True)
    # Write to CSV
    df.to_csv(os.path.join(TMP_PATH, FNAME + "-updated.csv"), index=False)

if (__name__ == "__main__"):
    download_and_extract(TMP_PATH)
    process_data()