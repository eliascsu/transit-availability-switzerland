import { PopulationArray } from '../../types/data';
import axiosClient from '../apiClient';

/**
 * get the data points through a post request
 * @param id the identifier of the point array
*/
export function getPopulationDensity(): Promise<PopulationArray | undefined> {
  const url = `datasets/population-heatmap`
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

export function getPopulationUnserved(): Promise<PopulationArray | undefined> {
  const url = `datasets/population-unserved`
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

export function getPTData(): Promise<GeoJSON.Feature[] | undefined> {
  const url = `datasets/pt-stops-are`;
  const promise = axiosClient.get<GeoJSON.Feature[]>(url);
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

export function postAndGetPoints(userPoints: GeoJSON.Feature[]): Promise<GeoJSON.Feature[] | undefined> {
  const url = `user/pt-stops`;
  const promise = axiosClient.post<GeoJSON.Feature[]>(url, userPoints);
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

export function getScoreUserPtLine(): Promise<Number> {
  const url = `user/pt-stops`;
  const promise = axiosClient.get<Number>(url);
  return promise
    .then((res) => {
      if (res.status !== 204) {
        console.log(res.data);
        return res.data;
      }
      return 0;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });

}

/*
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
*/