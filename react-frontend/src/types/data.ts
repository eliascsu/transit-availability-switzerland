export interface DataPoint {
    X1: number;
    X2: number;
    cluster: string
}

export type DataPointArray = DataPoint[];

export interface PopulationPoint {
    lat: string;
    lng: string;
    intensity: string;
}

export type PopulationArray = PopulationPoint[];
