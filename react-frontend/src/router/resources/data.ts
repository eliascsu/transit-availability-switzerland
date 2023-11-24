import { DataPointArray, PopulationArray } from '../../types/data';
import axiosClient from '../apiClient';
import { GeoJsonObject } from 'geojson';

/**
 * get the data points through a post request
 * @param id the identifier of the point array
*/
export function postPoints(id: string): Promise<DataPointArray | undefined> {
  const url = `data/${id}`
  const promise = axiosClient.get<DataPointArray>(url)
  return promise
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}
export function getPopulationDensity(): Promise<PopulationArray | undefined> {
  const url = `data/population`
  const promise = axiosClient.get<PopulationArray>(url);
  return promise
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

export function getPTData(): Promise<GeoJsonObject | undefined> {
  const url = `data/OeV_Haltestellen_ARE`;
  const promise = axiosClient.get<GeoJsonObject>(url);
  return promise
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}