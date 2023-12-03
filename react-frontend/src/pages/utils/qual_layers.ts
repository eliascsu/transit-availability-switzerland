/**
 * 
 */

import L from 'leaflet';
import { GeoJsonObject } from '../../types/data';
import { classColors } from './colors';

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


export { qualityLayerA, qualityLayerB, qualityLayerC, qualityLayerD }