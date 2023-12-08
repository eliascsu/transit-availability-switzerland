/**
 * 
 */

import L from 'leaflet';
import { Feature, FeatureCollection, GeoJsonObject } from '../../types/data';
import { classColors } from './colors';
import { createDefaultPtStop } from './utils';

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
        let kat =  4 //props?.Hst_Kat;
        /* tslint:disable-next-line */
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
 * Create a quality layer with information about the PT stop
 * @param data GeoJSON data
 * @param makePoint Function to create a new PT stop
 * @returns Quality layer as L.geoJSON
 */
function qualityLayerInfo(data: GeoJSON.Feature[], makePoint: any) {
    let onClick = function (e: any, feature: any, circle: any) {
        L.DomEvent.stopPropagation(e);
        console.log(feature.properties.Haltestellen_No);
        const properties = feature.properties;
        const tooltipContent = `Name: ${properties.Name}<br>Bahnlinie_Anz: ${properties.Bahnlinie_Anz}`;
        // Create a tooltip and bind it to the circle
        circle.bindPopup(tooltipContent).openPopup();
        let newPoint: Feature = createDefaultPtStop(e.latlng.lat, e.latlng.lng);
        makePoint(newPoint, false);
        L.DomEvent.stopPropagation(e);
    }
    let geoJsonInfoLayer = L.geoJSON(data, {
        filter(geoJsonFeature) {
            return geoJsonFeature.properties.Haltestellen_No != "false";
        },
        pointToLayer: function (feature, latlng) {
            geojsonMarkerOptions.radius = 70;
            const circle = L.circle(latlng, geojsonMarkerOptions);
            circle.setStyle({color: "#000000", stroke: false, fillOpacity: 1});
            // Add a click event listener to each circle for displaying a tooltip
            circle.on('click', (e) => onClick(e, feature, circle));
            return circle;
        }
    })
    return geoJsonInfoLayer;
}

export { qualityLayerInfo, createQualityLayer, createQualityLayerLineString }