import os
import requests
from zipfile import ZipFile
import numpy as np
import pandas as pd
from constants import *

R = 6371000  # radius of the Earth in meters

def download_and_extract(extract_to, url, filename):
    response = requests.get(url)
    if response.status_code == 200:
        zip_path = os.path.join(extract_to, filename + ".zip")
        with open(zip_path, 'wb+') as file:
            file.write(response.content)

        with ZipFile(zip_path, 'r') as zipObj:
            zipObj.extractall(extract_to)
    else:
        raise Exception(f"Failed to download file: Status code {response.status_code}")
    
def haversine_vectorized(lon1, lat1, lon2, lat2):
        lon1, lat1, lon2, lat2 = map(np.radians, [lon1, lat1, lon2, lat2])
        dlon = lon2 - lon1

        dlat = lat2 - lat1
        a = np.sin(dlat/2.0)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2.0)**2
        c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
        return R * c