import React from "react";

import { PopulationPoint, isPopulationArray } from "../models/data";
export const BASE_URL = process.env.NODE_ENV === "production" ? `http://be.${window.location.hostname}/api/v1` : "http://localhost:8000/api/v1"

/**export const BASE_URL = process.env.NODE_ENV==="production"? `http://be.${window.location.hostname}/api/v1`:"http://localhost:8000/api/v1"

 * get the data points through a post request
 * @param id the identifier of the point array
*/

type MapContextType = {
  populationDensityLoaded: boolean,
  populationDensity: PopulationPoint[],
};

const MapContext = React.createContext<MapContextType>({
  populationDensityLoaded: false,
  populationDensity: [],
});

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const didCancel = React.useRef<boolean>(false);
  React.useEffect(() => () => { didCancel.current = true; }, []);

  const [populationDensityLoaded, setPopulationDensityLoaded] = React.useState<boolean>(false);

  const [populationDensity, setPopulationDensity] = React.useState<PopulationPoint[]>([]);

  const getPopulationDensity = async () => {
    try {
      const url = "datasets/population-heatmap";
      const response = await fetch(`/api/v1/${url}`);
      const data = await response.json();
      if (isPopulationArray(data)) {
        if (didCancel.current) return;
        setPopulationDensity(data);
        setPopulationDensityLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    getPopulationDensity();
  }, []);

  return (
    <MapContext.Provider value={
      {
        populationDensityLoaded,
        populationDensity,
      }}>
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;
