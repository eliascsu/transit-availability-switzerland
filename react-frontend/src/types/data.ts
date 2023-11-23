export interface DataPoint {
    X1: number;
    X2: number;
    cluster: string
}

export type DataArray = DataPoint[];

export interface PopulationPoint {
    lat: String;
    lng: String;
    intensity: String;
}

export type PopulationArray = PopulationPoint[];