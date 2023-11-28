# Some of this code was taken and heavily modified from
# https://github.com/miquel-vv/csv-to-geojson/
# A copy of the original code can be found at
# https://github.com/miquel-vv/csv-to-geojson/blob/master/csv_to_geojson/geojson_transformer.py

# It is licensed under the MIT License

"""
MIT License

Copyright (c) 2019 Miquel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""

import pandas
import os
import numpy
import pyproj
from geojson import Point, Feature, FeatureCollection, dumps
from pyproj import CRS

# Suppress pandas warning
pandas.options.mode.chained_assignment = None

LV95 = CRS.from_epsg(2056)
WGS84 = CRS.from_epsg(4326)

def create_geojson(file_name, file):

    fold = os.path.dirname(file_name)
    name,_ = os.path.basename(file_name).split('.')

    output_file = os.path.join(fold, '{}.geojson'.format(name))

    df = pandas.read_csv(file, encoding_errors="ignore", delimiter=";").fillna('')
    lat = df['X_Koord']
    lng = df['Y_Koord']
    transformer = pyproj.Transformer.from_crs(LV95, WGS84, always_xy=True)
    for i, (longitude, latitude) in enumerate(zip(lat, lng)):
        new_lat, new_long = transformer.transform(latitude, longitude)
        lat.loc[i] = new_long
        lng.loc[i] = new_lat
        if i % 100 == 0:
            print(f"{i} of {len(df.index)} done.")
    df = df.drop(columns=['X_Koord', 'Y_Koord'])

    feat_list = []
    failed = []
    for i in range(0, len(df.index)):
        props = remove_np_from_dict(dict(df.loc[i]))
        try:
            f = Feature(geometry=Point((float(lng[i]), float(lat[i]))),
                       properties = props)
            feat_list.append(f)
        except ValueError:
            failed.append(props)
        
    collection = FeatureCollection(feat_list)
    with open(output_file, 'w+') as f:
        f.write(dumps(collection))
    
    return output_file

def remove_np_from_dict(d):
    '''numpy int64 objects are not serializable so need to convert values first.'''
    new={}
    for key, value in d.items():
        if isinstance(key, numpy.int64):
            key = int(key)
        if isinstance(value, numpy.int64):
            value = int(value)
        new[key] = value
    return new
    
def convert_numpy(val):
    if isinstance(val, numpy.int64): return int(val)