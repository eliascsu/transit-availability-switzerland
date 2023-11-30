import { LatLngTuple, Polyline } from "leaflet";

export interface PopulationPoint {
    lat: string;
    lng: string;
    intensity: string;
}

export type PopulationArray = PopulationPoint[];

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
    type: 'Point' | Polyline;
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

export interface Score {
    Value: number;
}

export interface LayerVisibility {
    popLayer: boolean,
    transportLayer: boolean
}

export interface LineArray {
    Lines: Line[],
    currIndex: number
}

interface Line {
    intervall: number,
    typ: StopType,
    points: FeatureCollection
}

interface LineIndexLookup {
    numLines: number,
    numPointsPerLine: number[],
    lineTypes: StopType[]
}

type StopType=  "Bahn" | "Tram" | "Bus";


