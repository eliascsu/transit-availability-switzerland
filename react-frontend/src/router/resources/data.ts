import { PopulationArray } from '../../types/data';
import axiosClient from '../apiClient';
import { GeoJsonObject } from 'geojson';
import { FeatureCollection, Score } from '../../types/data';

/**
 * get the data points through a post request
 * @param id the identifier of the point array
*/
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

export function postAndGetPoints(userPoints: FeatureCollection): Promise<GeoJsonObject | undefined> {
  const url = `data/user_Haltestellen`;
  const promise = axiosClient.post<GeoJsonObject>(url, userPoints);
  return promise
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

export function getScore() {
  const url = `data/user_Haltestellen`;
  const promise = axiosClient.get<Score>(url);
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