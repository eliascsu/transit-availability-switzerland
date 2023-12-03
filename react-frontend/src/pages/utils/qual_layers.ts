/**
 * 
 */

import L from 'leaflet';
import { Feature, GeoJsonObject } from '../../types/data';
import { classColors } from './colors';
import { createDefaultPtStop } from './utils';

let geojsonMarkerOptions = {
    radius: 70,
    color: "#ff7800",
    stroke: false,
    opacity: 1,
    fillOpacity: 1,
};

function qualityLayerA(data: GeoJsonObject){
    let geoJsonLayerA = L.geoJSON(data, {
        filter(geoJsonFeature) {
            //console.log(geoJsonFeature.properties.Haltestellen_No);
            let kat = geoJsonFeature.properties.Hst_Kat;
            return (kat == 1 || kat == 2) && (geoJsonFeature.properties.Haltestellen_No != "false");
        },
        pointToLayer: function (geoJsonFeature, latlng) {
            const properties = geoJsonFeature.properties;
            geojsonMarkerOptions.color = classColors.ClassA;
            const circle = L.circle(latlng, geojsonMarkerOptions);
            if(properties.Hst_Kat == 1){
                circle.setRadius(500);
            }
            else{
                circle.setRadius(300);
            }
            return circle; 
        }
    });
    return geoJsonLayerA;
}

function qualityLayerB(data: GeoJsonObject){
    let b = L.geoJSON(data, {
        filter(geoJsonFeature) {
            //console.log(geoJsonFeature.properties.Haltestellen_No);
            let kat = geoJsonFeature.properties.Hst_Kat;
            return (kat == 1 || kat == 2 || kat == 3) && (geoJsonFeature.properties.Haltestellen_No != "false");
        },
        pointToLayer: function (geoJsonFeature, latlng) {
            const properties = geoJsonFeature.properties;
            const circle = L.circle(latlng, geojsonMarkerOptions);
            circle.setStyle({color: classColors.ClassB, stroke: false, fillOpacity: 1});
            if(properties.Hst_Kat == 1){
                circle.setRadius(750);
            }
            else if(properties.Hst_Kat == 2){
                circle.setRadius(500);
            }
            else{
                circle.setRadius(300);
            }
            return circle; 
        }
    });
    return b;
}

function qualityLayerC(data: GeoJsonObject){
    let geoJsonLayerC = L.geoJSON(data, {
        filter(geoJsonFeature) {
            //console.log(geoJsonFeature.properties.Haltestellen_No);
            let kat = geoJsonFeature.properties.Hst_Kat;
            return (kat == 1 || kat == 2 || kat == 3 || kat == 4) && (geoJsonFeature.properties.Haltestellen_No != "false");
        },
        pointToLayer: function (geoJsonFeature, latlng) {
            const properties = geoJsonFeature.properties;
            const circle = L.circle(latlng, geojsonMarkerOptions);
            circle.setStyle({color: classColors.ClassC, stroke: false, fillOpacity: 1});
            if(properties.Hst_Kat == 1){
                circle.setRadius(1000);
            }
            else if(properties.Hst_Kat == 2){
                circle.setRadius(750);
            }
            else if(properties.Hst_Kat == 3){
                circle.setRadius(500);
            }
            else{
                circle.setRadius(300);
            }
            return circle; 
        }
    });
    return geoJsonLayerC;
}

function qualityLayerD(data: GeoJsonObject){
    let geoJsonLayerD = L.geoJSON(data, {
        filter(geoJsonFeature) {
            //console.log(geoJsonFeature.properties.Haltestellen_No);
            let kat = geoJsonFeature.properties.Hst_Kat;
            return (kat == 2 || kat == 3 || kat == 4 || kat == 5) && (geoJsonFeature.properties.Haltestellen_No != "false");
        },
        pointToLayer: function (geoJsonFeature, latlng) {
            const properties = geoJsonFeature.properties;
            const circle = L.circle(latlng, geojsonMarkerOptions);
            circle.setStyle({color: classColors.ClassD, stroke: false, fillOpacity: 1});
            if(properties.Hst_Kat == 2){
                circle.setRadius(1000);
            }
            else if(properties.Hst_Kat == 3){
                circle.setRadius(750);
            }
            else if(properties.Hst_Kat == 4){
                circle.setRadius(500);
            }
            else{
                circle.setRadius(300);
            }
            return circle; 
        }
    });
    return geoJsonLayerD;
}

function qualityLayerInfo(data: GeoJsonObject, makePoint: any) {
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
            const circle = L.circle(latlng, geojsonMarkerOptions);
            circle.setStyle({color: "#000000", stroke: false, fillOpacity: 1});
            // Add a click event listener to each circle for displaying a tooltip
            circle.on('click', (e) => onClick(e, feature, circle));
            return circle;
        }
    })
    return geoJsonInfoLayer;
}

export { qualityLayerA, qualityLayerB, qualityLayerC, qualityLayerD, qualityLayerInfo }