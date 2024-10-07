
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface LoadingContextType {
  loadHeatmap: boolean;
  setLoadHeatmap: React.Dispatch<React.SetStateAction<boolean>>;
  loadPtMap: boolean;
  setLoadPtMap: React.Dispatch<React.SetStateAction<boolean>>;
  loadUnservedMap: boolean;
  setLoadUnservedMap: React.Dispatch<React.SetStateAction<boolean>>;
  allLoaded: boolean;
  setAllLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoadingContext = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLayerContext must be used within a LayerProvider");
  }
  return context;
};

type LoadingProviderProps = {
  children: React.ReactNode;
};

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loadHeatmap, setLoadHeatmap] = useState<boolean>(false);
  const [loadPtMap, setLoadPtMap] = useState<boolean>(true);
  const [loadUnservedMap, setLoadUnservedMap] = useState<boolean>(false);
  const [allLoaded, setAllLoaded] = useState<boolean>(false);

  useEffect(() => {
    console.log("loadHeatmap: ", loadHeatmap);
    console.log("loadPtMap: ", loadPtMap);
    console.log("loadUnservedMap: ", loadUnservedMap);
    if (loadHeatmap && loadPtMap && loadUnservedMap) {
      setAllLoaded(true);
      console.log("all loaded");
    }
  }, [loadHeatmap, loadPtMap, loadUnservedMap]);

  const value = {
    loadHeatmap, setLoadHeatmap,
    loadPtMap, setLoadPtMap,
    loadUnservedMap, setLoadUnservedMap,
    allLoaded, setAllLoaded,
  };

  return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
  );
};
