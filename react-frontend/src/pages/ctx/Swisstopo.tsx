import { createContext, useContext, useState } from "react";


interface SwissTopoContextType {
    useSwissTopoMap: boolean;
    setSwissTopoMap: React.Dispatch<React.SetStateAction<boolean>>;
    useAreMap: boolean;
    setAreMap: React.Dispatch<React.SetStateAction<boolean>>;
}

interface HeatmapContextType {
    infoStatePopulation: string;
    setInfoStatePopulation: React.Dispatch<React.SetStateAction<string>>;
}

const StContext = createContext<SwissTopoContextType | undefined>(undefined);

export const useSwissTopoContext = () => {
    const context = useContext(StContext);
    if (!context) {
        throw new Error('useSwissTopoContext must be used within a LayerProvider');
    }
    return context;
};

export const StProvider: React.FC = ({ children }) => {
    const [useSwissTopoMap, setSwissTopoMap] = useState<boolean>(true)
    const [useAreMap, setAreMap] = useState<boolean>(false)

    const value = {
        useSwissTopoMap, setSwissTopoMap,
        useAreMap, setAreMap,
    };

    return (
        <StContext.Provider value={value}>
            {children}
        </StContext.Provider>
    );
};

const HeatmapContext = createContext<HeatmapContextType | undefined>(undefined);

export const useHeatmapContext = () => {
    const context = useContext(HeatmapContext);
    if (!context) {
        throw new Error('useHeatmapContext must be used within a LayerProvider');
    }
    return context;
};

export const HeatmapProvider: React.FC = ({ children }) => {
    const [infoStatePopulation, setInfoStatePopulation] = useState<string>("")

    const value = {
        infoStatePopulation, setInfoStatePopulation
    };

    return (
        <HeatmapContext.Provider value={value}>
            {children}
        </HeatmapContext.Provider>
    );
}