import { LatLngTuple } from "leaflet";

export interface PopulationPoint {
  lat: string;
  lng: string;
  intensity: string;
}

export function isPopulationPoint(data: any): data is PopulationPoint {
  return (
    (data as PopulationPoint).lat !== undefined &&
    (data as PopulationPoint).lng !== undefined &&
    (data as PopulationPoint).intensity !== undefined
  );
}

export function isPopulationArray(data: any): data is PopulationPoint[] {
  return (
    data != null &&
    data.every((el: any) => isPopulationPoint(el))
  );
}

export interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}

export interface Feature {
  type: "Feature";
  geometry: Geometry;
  properties: Properties;
}

interface Geometry {
  type: "Point";
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
  popUnservedLayer: boolean,
}

export interface Line {
  intervall: number,
  typ: string
}

