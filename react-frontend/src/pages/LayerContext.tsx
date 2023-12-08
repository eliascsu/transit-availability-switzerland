import { CheckboxValueType } from "antd/es/checkbox/Group";
import { Feature, FeatureCollection, LayerVisibility, Line } from "../types/data";
import { createContext, useContext, useRef, useState } from "react";


interface LayerContextType {
    visibleLayersState: LayerVisibility;
    setVisibleLayersState: React.Dispatch<React.SetStateAction<LayerVisibility>>;
    checkboxValues: CheckboxValueType[];
    setCheckboxValues: React.Dispatch<React.SetStateAction<CheckboxValueType[]>>;
    linesFromFormState: Line[];
    setLinesFromFormState: React.Dispatch<React.SetStateAction<Line[]>>;
    drawingState: boolean;
    setDrawingState: React.Dispatch<React.SetStateAction<boolean>>;
    userLinesRef: React.MutableRefObject<GeoJSON.Feature[]>;
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
}

const LayerContext = createContext<LayerContextType | undefined>(undefined);

export const useLayerContext = () => {
    const context = useContext(LayerContext);
    if (!context) {
        throw new Error('useLayerContext must be used within a LayerProvider');
    }
    return context;
};

export const LayerProvider: React.FC = ({ children }) => {
    const [visibleLayersState, setVisibleLayersState] = useState<LayerVisibility>({ popLayer: false, transportLayer: false, popUnservedLayer: false });
    const [checkboxValues, setCheckboxValues] = useState<CheckboxValueType[]>([]);
    const [linesFromFormState, setLinesFromFormState] = useState<Line[]>([]);
    const [drawingState, setDrawingState] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const userLinesRef = useRef<GeoJSON.Feature[]>([]);

    // Send GeoJSON FeatureCollection to backend
    let sender: FeatureCollection = { type: "FeatureCollection", features: userLinesRef.current as Feature[] };


    const value = {
        visibleLayersState,
        setVisibleLayersState,
        checkboxValues,
        setCheckboxValues,

        linesFromFormState,
        setLinesFromFormState,
        drawingState,
        setDrawingState,
        userLinesRef,
        score, setScore
    };

    return (
        <LayerContext.Provider value={value}>
            {children}
        </LayerContext.Provider>
    );
};
