import { lineColors } from "./colors";
import L, {HeatLatLngTuple, LatLngTuple} from "leaflet";
import type { Feature, PopulationArray } from "../../types/data";

/**
 * Guarantees that returned value contains a feature
 * @param userLines Existing feature lines
 * @param latlng L.LatLng of point, which should be added to the line
 * @returns Feature list with new LatLng added to last feature linestring
 */
export function addPointToLine(userLines: GeoJSON.Feature[], latlng: L.LatLng) {
    if(userLines.length === 0){
        userLines.push(
            {
                type: "Feature",
                properties: {
                    Haltestellen_No: "0"
                } as GeoJSON.GeoJsonProperties,
                geometry: {
                    type: "LineString",
                    coordinates: [[latlng.lng, latlng.lat]]
                } as GeoJSON.Geometry
            } as GeoJSON.Feature
        )
    }
    let last_line_geojson2 = userLines[userLines.length - 1];
    (last_line_geojson2.geometry as GeoJSON.LineString).coordinates.push([latlng.lng, latlng.lat]);
    userLines[userLines.length - 1] = last_line_geojson2;
    return userLines;
}


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

function createHeatMap(data: PopulationArray) {
    let heatArray: HeatLatLngTuple[] = [];
    if (data != undefined) {
        for (let row of data) {
            heatArray.push([parseFloat(row.lat), parseFloat(row.lng), parseFloat(row.intensity)] as HeatLatLngTuple);
        }
    }
    return heatArray;
}

export { createHeatMap, addStopToLineString, getLineColor, createDefaultPtStop };