import { MapContainer, TileLayer, useMap, WMSTileLayer } from 'react-leaflet'
import L, { LatLng } from "leaflet";
import 'leaflet/dist/leaflet.css';
import './pages.css';
import { Control } from 'leaflet';
import { useEffect, useState, useRef } from 'react';
import "proj4leaflet";
import Papa from 'papaparse';


interface CsvData {
    Haltestellen_No: number;
    Y_Koord: string;
    X_Koord: string;
    Name: string;
    Bahnknoten: number;
    Bahnlinie_Anz: number;
    TramBus_Anz: number;
    Seilbahn_Anz: number;
    A_Intervall: number;
    B_Intervall: number;
    Hst_Kat: string;
  }

  const classColors = {
    ClassA: "#ff0022",
    ClassB: "#c300ff",
    ClassC: "#006915",
    ClassD: "#40ff66"
  }

// Base URL for WMS requests to map.geo.admin.ch
const WMS_GEOCH = "https://wms.geo.admin.ch/services/service?";

const EPSG2056 = '+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs +type=crs';
const EPSG4326 = '+proj=longlat +datum=WGS84 +no_defs';

// Layer names for map.geo.admin.ch
const PT_QUAL = "ch.are.gueteklassen_oev"
const POP_DENS = "ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner"
const BASEMAP = "ch.swisstopo.pixelkarte-farbe-pk100.noscale"

function ContentPage() {
    return (
        <>
        <h1>Content Page</h1>
        <MapWrapper/>
        <Legend/>
        </>)
}

function MapWrapper() {
    
    return (
        
        <MapContainer className="map-container" center={[47.36, 8.53]} zoom={10} scrollWheelZoom={true}>
            <TileLayer url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=119ad4f25bed4ec2a70aeba31a0fb12a" attribution="&copy; <a href=&quot;https://www.thunderforest.com/&quot;>Thunderforest</a> contributors"/>
            <Map></Map>
        </MapContainer>
        
    );
}

function Map(){
    const map = useMap();
    const [csvData, setCsvData] = useState<CsvData[]>();

    useEffect(() => {
        fetch('/population-updated.csv')
        .then(response => response.text())
        .then(text => {
            Papa.parse<CsvData>(text, {
            header: true,
            complete: (results) => {
                setCsvData(results.data);
            }
            });
        });

        fetch("/OeV_Haltestellen_ARE.geojson").then(response => response.json())
            .then(data => {
                console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEEE" + data);
                var geojsonMarkerOptions = {
                    radius: 50,
                    color: "#ff7800",
                    stroke: false,
                    opacity: 1,
                    fillOpacity: 1,
                };
                /*
                let geoJsonInfoLayer = L.geoJSON(data, {
                    pointToLayer: function (feature, latlng) {
                        const circle = L.circle(latlng, geojsonMarkerOptions);
                        // Add a click event listener to each circle for displaying a tooltip
                        circle.on('click', function (e) {
                            const properties = feature.properties;
                            const tooltipContent = `Name: ${properties.Name}<br>Bahnlinie_Anz: ${properties.Bahnlinie_Anz}`;
                            // Create a tooltip and bind it to the circle
                            circle.bindPopup(tooltipContent).openPopup();
                        });

                        return circle;
                    }
                }).addTo(map);
                */

                let geoJsonLayerA = L.geoJSON(data, {
                    filter(geoJsonFeature) {
                        let kat = geoJsonFeature.properties.Hst_Kat;
                        return kat == 1 || kat == 2;
                    },
                    pointToLayer: function (geoJsonFeature, latlng) {
                        const properties = geoJsonFeature.properties;
                        geojsonMarkerOptions.color = classColors.ClassA;
                        const circle = L.circle(latlng, geojsonMarkerOptions);
                        // Add a click event listener to each circle for displaying a tooltip
                        if(properties.Hst_Kat == 1){
                            circle.setRadius(500);
                        }
                        else{
                            circle.setRadius(300);
                        }
                        return circle; 
                    }
                });

                let geoJsonLayerB = L.geoJSON(data, {
                    filter(geoJsonFeature) {
                        let kat = geoJsonFeature.properties.Hst_Kat;
                        return kat == 1 || kat == 2 || kat == 3;
                    },
                    pointToLayer: function (geoJsonFeature, latlng) {
                        const properties = geoJsonFeature.properties;
                        const circle = L.circle(latlng, geojsonMarkerOptions);
                        circle.setStyle({color: classColors.ClassB, stroke: false, fillOpacity: 1});
                            // Add a click event listener to each circle for displaying a tooltip
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

                let geoJsonLayerC = L.geoJSON(data, {
                    filter(geoJsonFeature) {
                        let kat = geoJsonFeature.properties.Hst_Kat;
                        return kat == 1 || kat == 2 || kat == 3 || kat == 4;
                    },
                    pointToLayer: function (geoJsonFeature, latlng) {
                        const properties = geoJsonFeature.properties;
                        const circle = L.circle(latlng, geojsonMarkerOptions);
                        circle.setStyle({color: classColors.ClassC, stroke: false, fillOpacity: 1});
                            // Add a click event listener to each circle for displaying a tooltip
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

                let geoJsonLayerD = L.geoJSON(data, {
                    filter(geoJsonFeature) {
                        let kat = geoJsonFeature.properties.Hst_Kat;
                        return kat == 2 || kat == 3 || kat == 4 || kat == 5;
                    },
                    pointToLayer: function (geoJsonFeature, latlng) {
                        const properties = geoJsonFeature.properties;
                        const circle = L.circle(latlng, geojsonMarkerOptions);
                        circle.setStyle({color: classColors.ClassD, stroke: false, fillOpacity: 1});
                            // Add a click event listener to each circle for displaying a tooltip
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
                let heatArray = [];
                if(csvData != undefined){
                    for(let row of csvData){
                        
                    }
                }
                geoJsonLayerD.addTo(map);
                geoJsonLayerC.addTo(map);
                geoJsonLayerB.addTo(map);
                geoJsonLayerA.addTo(map);
                //geoJsonInfoLayer.addTo(map);
            });  
    }, []);
    
    return null;
}

function Legend() {

    const legend = new Control({ position: 'bottomright' });
    return (
        <div className="legend">
            <img src={"https://api3.geo.admin.ch/static/images/legends/ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner_en.png"} alt="Legend"/>
            
        </div>
    )
}

export default ContentPage;
