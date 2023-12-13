import { lineColors } from "./colors";
import L, {HeatLatLngTuple} from "leaflet";
import type { PopulationArray } from "../../types/data";

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
                    lineType: "pending",
                    interval: -1
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

function createHeatMap(data: PopulationArray) {
    let heatArray: HeatLatLngTuple[] = [];
    if (data != undefined) {
        for (let row of data) {
            heatArray.push([parseFloat(row.lat), parseFloat(row.lng), parseFloat(row.intensity)] as HeatLatLngTuple);
        }
    }
    return heatArray;
}

export { createHeatMap, getLineColor };