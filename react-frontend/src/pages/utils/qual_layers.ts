/**
 *
 */

import L from 'leaflet';
import { FeatureCollection } from '../../types/data';
import { classColors } from './colors';

// Configuration of markers
const geojsonMarkerOptions = {
    radius: 20,
    color: "#ff7800",
    stroke: false,
    opacity: 1,
    fillOpacity: 1,
};

// Configuration for each quality layer
const qualityLayerConfig = {
    A: { color: classColors.ClassA, categories: [1, 2], radius: [500, 300] },
    B: { color: classColors.ClassB, categories: [1, 2, 3], radius: [750, 500, 300] },
    C: { color: classColors.ClassC, categories: [1, 2, 3, 4], radius: [1000, 750, 500, 300] },
    D: { color: classColors.ClassD, categories: [2, 3, 4, 5], radius: [1000, 750, 500, 300] }
};

/**
 * Create a quality layer based on the given data and layer type
 * @param data GeoJSON data
 * @param layerType Either 'A', 'B', 'C' or 'D'
 * @returns Quality layer as L.geoJSON
 */
function createQualityLayer(data: GeoJSON.Feature[] | FeatureCollection, layerType: 'A' | 'B' | 'C' | 'D') {
    const config = qualityLayerConfig[layerType];

    return L.geoJSON(data, {
        filter(geoJsonFeature) {
            let kat = geoJsonFeature.properties.Hst_Kat;
            return config.categories.includes(kat) && geoJsonFeature.properties.Haltestellen_No != "false";
        },
        pointToLayer: function (geoJsonFeature, latlng) {
            const properties = geoJsonFeature.properties;
            let radiusIndex = config.categories.indexOf(properties.Hst_Kat);
            let radius = config.radius[radiusIndex] || 20; // Default radius if not found

            geojsonMarkerOptions.color = config.color;
            geojsonMarkerOptions.radius = radius;


            return L.circle(latlng, geojsonMarkerOptions);
        }
    });
}

function createQualityLayerLineString(data: any, layerType: 'A' | 'B' | 'C' | 'D') {
    // data should be GeoJson.Feature[] and a linestring
    const config = qualityLayerConfig[layerType];
    console.log("createQualityLayerLineString");
    console.log(data);
    let layer: L.GeoJSON = L.geoJSON();
    for (let feature of data) {
        let props = feature.properties;
        let kat = 2
        for (let coord_pair of feature.geometry.coordinates) {
            let latlng = L.latLng(coord_pair[1], coord_pair[0]);
            let radiusIndex = config.categories.indexOf(kat);
            let radius = config.radius[radiusIndex] || 20; // Default radius if not found

            geojsonMarkerOptions.color = config.color;
            geojsonMarkerOptions.radius = radius;

            let circle = L.circle(latlng, geojsonMarkerOptions);
            circle.addTo(layer);
        }
        console.log(props);
        console.log(kat);
        console.log(feature);
    }
    return layer;
 }
/**
 * Create a quality layer
 * @param data GeoJSON data
 * @param makePoint Function to create a new PT stop
 * @returns Quality layer as L.geoJSON
 */

function makePTCirclesFromData(data: GeoJSON.Feature[]){
    console.log(data[0]);
    // Working with the default layers
    if (data[0] == undefined) {
        let layers: L.GeoJSON<any, any>[] = [];
        let geoJsonLayerA = createQualityLayer(data, "A")
        let geoJsonLayerB = createQualityLayer(data, "B")
        let geoJsonLayerC = createQualityLayer(data, "C")
        let geoJsonLayerD = createQualityLayer(data, "D")

        layers.push(geoJsonLayerD);
        layers.push(geoJsonLayerC);
        layers.push(geoJsonLayerB);
        layers.push(geoJsonLayerA);
        return layers
    }
    // Working with the user layers
    else {
        // Types are now linestrings
        let layers: L.GeoJSON<any, any>[] = [];
        let geoJsonLayerA = createQualityLayerLineString(data, "A")
        let geoJsonLayerB = createQualityLayerLineString(data, "B")
        let geoJsonLayerC = createQualityLayerLineString(data, "C")
        let geoJsonLayerD = createQualityLayerLineString(data, "D")

        layers.push(geoJsonLayerD);
        layers.push(geoJsonLayerC);
        layers.push(geoJsonLayerB);
        layers.push(geoJsonLayerA);
        return layers
    }
}

export { createQualityLayer, createQualityLayerLineString, makePTCirclesFromData }