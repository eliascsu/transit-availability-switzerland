import React from "react";
import { LayerVisibility, Line } from "../models/data";

interface LayerContextType {
  visibleLayersState: LayerVisibility;
  setVisibleLayersState: React.Dispatch<React.SetStateAction<LayerVisibility>>;
  linesFromFormState: Line[];
  setLinesFromFormState: React.Dispatch<React.SetStateAction<Line[]>>;
  drawingState: boolean;
  setDrawingState: React.Dispatch<React.SetStateAction<boolean>>;
  userLinesRef: React.MutableRefObject<GeoJSON.Feature[]>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

const LayerContext = React.createContext<LayerContextType>({
  visibleLayersState: { popLayer: false, transportLayer: false, popUnservedLayer: false },
  setVisibleLayersState: () => {},
  linesFromFormState: [],
  setLinesFromFormState: () => {},
  drawingState: false,
  setDrawingState: () => {},
  userLinesRef: { current: [] },
  score: 0,
  setScore: () => {},
});

type LayerProviderProps = {
  children: React.ReactNode;
};

export const LayerProvider: React.FC<LayerProviderProps> = ({ children }) => {
  const [visibleLayersState, setVisibleLayersState] = React.useState<LayerVisibility>({ popLayer: false, transportLayer: false, popUnservedLayer: false });
  const [linesFromFormState, setLinesFromFormState] = React.useState<Line[]>([]);
  const [drawingState, setDrawingState] = React.useState<boolean>(false);
  const [score, setScore] = React.useState<number>(0);
  const userLinesRef = React.useRef<GeoJSON.Feature[]>([]);

  const value = {
    visibleLayersState,
    setVisibleLayersState,

    linesFromFormState,
    setLinesFromFormState,
    drawingState,
    setDrawingState,
    userLinesRef,
    score, setScore,
  };

  return (
        <LayerContext.Provider value={value}>
            {children}
        </LayerContext.Provider>
  );
};

export default LayerContext;
