from io import BytesIO
import pandas as pd
import pyproj
from pyproj import CRS
import os
import warnings
import requests
from zipfile import ZipFile

LV95 = CRS.from_epsg(2056)
WGS84 = CRS.from_epsg(4326)

warnings.filterwarnings("ignore", category=Warning)

URL = "https://dam-api.bfs.admin.ch/hub/api/dam/assets/27965868/master"
FNAME = "population"
CSV_NAME = "STATPOP2022"


def transform_coordinates(df):
    """Transform coordinates from LV95 to WGS84."""
    transformer = pyproj.Transformer.from_crs(LV95, WGS84, always_xy=True)
    transformed_coords = df.apply(
        lambda row: transformer.transform(row["E_KOORD"], row["N_KOORD"]), axis=1
    )
    df[["lng", "lat"]] = pd.DataFrame(transformed_coords.tolist(), index=df.index)
    return df


def main():
    """Main function to process the data."""
    response = requests.get(URL)
    archive = ZipFile(BytesIO(response.content))
    csv = archive.open("ag-b-00.03-vz2022statpop/"+ CSV_NAME + ".csv")

    df = pd.read_csv(csv, sep=";")

    # Drop unused columns and normalize population
    df = df.drop(columns=["RELI", "B22B11"])
    # Normalize population using this formula
    # ((population / 20) ** 2) + 0.5 if ((population / 20) ** 2) + 0.5 < 40 else 40
    df["pop_actual"] = df["B22BTOT"].copy()
    df["pop"] = ((df["B22BTOT"] / 20) ** 2) + 0.5

    df.loc[df["pop"] > 40, "pop"] = 40

    # Transform coordinates
    df = transform_coordinates(df[["E_KOORD", "N_KOORD", "pop", "pop_actual"]])
    df = df.drop(columns=["E_KOORD", "N_KOORD"])
    new_order = ["lat", "lng", "pop", "pop_actual"]
    df = df.reindex(columns=new_order)
    df.rename(columns={"pop": "intensity"}, inplace=True)
    # Write to CSV
    df.to_csv(os.path.join("backend-project", "data", "Population.csv"), index=False)


if __name__ == "__main__":
    main()