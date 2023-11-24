import { LatLngTuple } from "leaflet";

export interface PopulationPoint {
    lat: string;
    lng: string;
    intensity: string;
}

export type PopulationArray = PopulationPoint[];

export interface UserPoint {
    Haltestellen_No: string;
    Y_Koord: number;
    X_Koord: number;
    Name: string;
    Bahnknoten: number;
    Bahnlinie_Anz: number;
    TramBus_Anz: number;
    Seilbahn_Anz: number;
    A_Intervall: number;
    B_Intervall: number;
    Hst_Kat: number;
}

export type UserPointArray = UserPoint[];

export type GeoJsonObject = FeatureCollection | Feature;

export interface FeatureCollection {
    type: 'FeatureCollection';
    features: Feature[];
}

export interface Feature {
    type: 'Feature';
    geometry: Geometry;
    properties: Properties;
}

export interface Geometry {
    type: 'Point';
    coordinates: LatLngTuple;
}   

export interface Properties {
    Haltestellen_No: string;
    Name: string;
    Bahnknoten: number;
    Bahnlinie_Anz: number;
    TramBus_Anz: number;
    Seilbahn_Anz: number;
    A_Intervall: number;
    B_Intervall: number;
    Hst_Kat: number;
}