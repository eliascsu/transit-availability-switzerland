import React from "react";

import { PopulationPoint, isPopulationArray } from "../models/data";
export const BASE_URL = process.env.NODE_ENV === "production" ? `http://be.${window.location.hostname}/api/v1` : "http://localhost:8000/api/v1";

/**export const BASE_URL = process.env.NODE_ENV==="production"? `http://be.${window.location.hostname}/api/v1`:"http://localhost:8000/api/v1"

 * get the data points through a post request
 * @param id the identifier of the point array
*/

type MapContextType = {
  populationDensityLoaded: boolean,
  populationDensity: PopulationPoint[],

  populationUnservedLoaded: boolean,
  populationUnserved: PopulationPoint[],

  ptStopsAreLoaded: boolean,
  ptStopsAre: GeoJSON.Feature[],

  postUserPoints: (userPoints: GeoJSON.Feature[]) => void,
  userPoints: GeoJSON.Feature[],
  setUserPoints: (userPoints: GeoJSON.Feature[]) => void,

  getScoreUserPtLines: () => Promise<number>,
};

const MapContext = React.createContext<MapContextType>({
  populationDensityLoaded: false,
  populationDensity: [],

  populationUnservedLoaded: false,
  populationUnserved: [],

  ptStopsAreLoaded: false,
  ptStopsAre: [],

  postUserPoints: () => { },
  userPoints: [],
  setUserPoints: () => { },

  getScoreUserPtLines: () => Promise.resolve(0),
});

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const didCancel = React.useRef<boolean>(false);
  React.useEffect(() => () => { didCancel.current = true; }, []);

  const [populationDensityLoaded, setPopulationDensityLoaded] = React.useState<boolean>(false);
  const [populationUnservedLoaded, setPopulationUnservedLoaded] = React.useState<boolean>(false);
  const [ptStopsAreLoaded, setPtStopsAreLoaded] = React.useState<boolean>(false);

  const [populationDensity, setPopulationDensity] = React.useState<PopulationPoint[]>([]);
  const [populationUnserved, setPopulationUnserved] = React.useState<PopulationPoint[]>([]);
  const [ptStopsAre, setPtStopsAre] = React.useState<GeoJSON.Feature[]>([]);
  const [userPoints, setUserPoints] = React.useState<GeoJSON.Feature[]>([]);

  const getPopulationDensity = async () => {
    try {
      const url = "/datasets/population-heatmap";
      const response = await fetch(BASE_URL + url);
      const data = await response.json();
      if (isPopulationArray(data)) {
        // if (didCancel.current) return; // todo: very funky
        setPopulationDensity(data);
        setPopulationDensityLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPopulationUnserved = async () => {
    try {
      const url = "/datasets/population-unserved";
      const response = await fetch(BASE_URL + url);
      const data = await response.json();
      if (isPopulationArray(data)) {
        // if (didCancel.current) return; // todo: very funky
        setPopulationUnserved(data);
        setPopulationUnservedLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPtStopsAre = async () => {
    try {
      const url = "/datasets/pt-stops-are";
      const response = await fetch(BASE_URL + url);
      const data = await response.json();
      const parsed = JSON.parse(data).features;
      // if (Array.isArray(data)) {
      // if (didCancel.current) return; // todo: very funky
      setPtStopsAre(parsed);
      setPtStopsAreLoaded(true);
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const postPoints = async (userPoints: GeoJSON.Feature[]) => {
    try {
      const url = "/user/pt-stops";
      const response = await fetch(BASE_URL + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPoints),
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setUserPoints(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const postUserPoints = async (userPoints: GeoJSON.Feature[]) => {
    try {
      const url = "/user/pt-stops";
      const response = await fetch(BASE_URL + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPoints),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const getScoreUserPtLines = async () => {
    try {
      const url = "/user/pt-stops";
      const response = await fetch(BASE_URL + url);
      const data: number = await response.json();

      return data;

    } catch (error) {
      console.error(error);
      // In case of an error, return a fallback number
      return 0;
    }
  };

  React.useEffect(() => {
    getPopulationDensity();
    getPtStopsAre();
    getPopulationUnserved();
  }, []);

  React.useEffect(() => {
    if (userPoints.length > 0) {
      postPoints(userPoints);
    }
  }, [userPoints]);

  return (
    <MapContext.Provider value={
      {
        populationDensityLoaded,
        populationDensity,

        populationUnservedLoaded,
        populationUnserved,

        ptStopsAreLoaded,
        ptStopsAre,

        userPoints,
        setUserPoints,

        postUserPoints,
        getScoreUserPtLines,
      }}>
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;
