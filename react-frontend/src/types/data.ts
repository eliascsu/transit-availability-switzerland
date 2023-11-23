export interface DataPoint {
    X1: number;
    X2: number;
    cluster: string
}

export type DataArray = DataPoint[];

export interface PopulationPoint {
    lat: number;
    lng: number;
    intensity: number;
}

export type PopulationArray = PopulationPoint[];