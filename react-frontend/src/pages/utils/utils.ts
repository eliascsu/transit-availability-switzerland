import { lineColors } from "./colors";
import L, {LatLngTuple} from "leaflet";
import type { Feature } from "../../types/data";

/**
 * Returns the color of the line based on the line type
 * @param lineType Either "Tram", "Bus" or "S_Bahn"
 * @returns Color of the line
 */
function getLineColor (lineType: string) {
    let lineColor: string;
    switch (lineType) {
        case "Tram": { 
            lineColor = lineColors.Tram;
            break;
         } 
         case "Bus": { 
             lineColor = lineColors.Bus;
             break;
         } 
         case "S_Bahn": { 
             lineColor = lineColors.S_Bahn;
             break
         }
         default: { 
            console.log("BAD LINE"); 
            lineColor = "#000000";
            break; 
         }
        }
    return lineColor;
}

let defaultName: string = "";
let defaultBahnknoten = 0;
let defaultBahnlinie_Anz = 0;
let defaultTramBus_Anz = 1;
let defaultSeilbahn_Anz = 0;
let defaultA_Intervall = 0;
let defaultB_Intervall = 8;
let defaultHst_Kat = 1;

/**
 * Create new PT stop with default properties at given coordinates
 * @param lat Latitude of new PT stop
 * @param lng Longitude of new PT stop
 * @returns New geojson point feature with default properties at given coordinates
 */
function createDefaultPtStop (lat: number, lng: number) {
    console.log("click");
    let newPoint: Feature = {
        type: "Feature",
        geometry: {
            type: 'Point',
            coordinates: [lng, lat] as LatLngTuple
        },
        properties:{
            Haltestellen_No: "PLACEHOLDER",
            Name: defaultName,
            Bahnknoten: defaultBahnknoten,
            Bahnlinie_Anz: defaultBahnlinie_Anz,
            TramBus_Anz: defaultTramBus_Anz,
            Seilbahn_Anz: defaultSeilbahn_Anz,
            A_Intervall: defaultA_Intervall,
            B_Intervall: defaultB_Intervall,
            Hst_Kat: defaultHst_Kat
        }
    }
    return newPoint
}

function addStopToLineString(lineString: GeoJSON.Feature<GeoJSON.LineString>, lat: number, lng: number) {
    let newCoords: GeoJSON.Position[] = lineString.geometry.coordinates;
    newCoords.push([lng, lat]);
    lineString.geometry.coordinates = newCoords;
    return lineString;
}

function createPtLineStringFromPoints(stops: GeoJSON.FeatureCollection<GeoJSON.Point>) {
    if (stops.features.length == 0) {
        console.error("No stops to connect");
        return;
    }
    if (stops.features.length == 1) {
        console.error("Only one stop to connect");
        return;
    }
    function stopsToLineString(stops: GeoJSON.FeatureCollection<GeoJSON.Point>) {
        let coords: GeoJSON.Position[] = [];
        for (let i = 0; i < stops.features.length; i++) {
            let stop = stops.features[i];
            coords.push(stop.geometry.coordinates as GeoJSON.Position);
        }
        return coords;
    }
    let lineString: GeoJSON.Feature<GeoJSON.LineString> = {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: stopsToLineString(stops)
        },
        properties: {
            Haltestellen_No: "PLACEHOLDER",
            Name: defaultName,
            Bahnknoten: defaultBahnknoten,
            Bahnlinie_Anz: defaultBahnlinie_Anz,
            TramBus_Anz: defaultTramBus_Anz,
            Seilbahn_Anz: defaultSeilbahn_Anz,
            A_Intervall: defaultA_Intervall,
            B_Intervall: defaultB_Intervall,
            Hst_Kat: defaultHst_Kat
        }
    }
    return lineString;
}
export { addStopToLineString, getLineColor, createDefaultPtStop, createPtLineStringFromPoints };