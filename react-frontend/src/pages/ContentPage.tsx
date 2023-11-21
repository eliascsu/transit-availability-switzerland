import { MapContainer, TileLayer, useMap, WMSTileLayer } from 'react-leaflet'
import L, { LatLng } from "leaflet";
import 'leaflet/dist/leaflet.css';
import './pages.css';
import { Control } from 'leaflet';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import "proj4leaflet";
import proj4 from "proj4";
import { assertDebuggerStatement } from '@babel/types';
import { color } from 'd3-color';


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
//proj4.defs("EPSG:2056","+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs +type=crs");

// Coordinate Reference System for map.geo.admin.ch

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
        fetch('/OeV_Haltestellen_ARE.csv')
        .then(response => response.text())
        .then(text => {
            Papa.parse<CsvData>(text, {
            header: true,
            complete: (results) => {
                setCsvData(results.data);
            }
            });
        });
    }, []);
    
    useEffect(() => {
        if (csvData) {
            const ACircles = new L.LayerGroup();
            const BCircles = new L.LayerGroup();
            const CCircles = new L.LayerGroup();
            const DCircles = new L.LayerGroup();
            
            let i= 0
            for(let row of csvData){
                if (row.Name !== '' && i++<5000) {
                    if(i % 800 == 0 || i == 23811){
                        console.log(Math.round(i/23812*100) +"% of dataset")
                    }
                    let x_coord = parseFloat(row.X_Koord);
                    let y_coord = parseFloat(row.Y_Koord);
                    let converted = proj4(EPSG2056, EPSG4326, proj4.toPoint([y_coord, x_coord]));
                    let radius = 0;
                    switch(parseFloat(row.Hst_Kat)){
                        case 0:
                            console.log("Hst is 0");
                            break;
                        case 1:
                            L.circle([converted.y, converted.x], {radius: 500, color: classColors.ClassA, stroke: false, fillOpacity: 1}).addTo(ACircles);
                            L.circle([converted.y, converted.x], {radius: 750, color: classColors.ClassB, stroke: false, fillOpacity: 1}).addTo(BCircles);
                            L.circle([converted.y, converted.x], {radius: 1000, color: classColors.ClassC, stroke: false, fillOpacity: 1}).addTo(CCircles);
                            break;
                        case 2:
                            L.circle([converted.y, converted.x], {radius: 300, color: classColors.ClassA, stroke: false, fillOpacity: 1}).addTo(ACircles);
                            L.circle([converted.y, converted.x], {radius: 500, color: classColors.ClassB, stroke: false, fillOpacity: 1}).addTo(BCircles);
                            L.circle([converted.y, converted.x], {radius: 750, color: classColors.ClassC, stroke: false, fillOpacity: 1}).addTo(CCircles);
                            L.circle([converted.y, converted.x], {radius: 1000, color: classColors.ClassD, stroke: false, fillOpacity: 1}).addTo(DCircles);
                            break;
                        case 3:
                            L.circle([converted.y, converted.x], {radius: 300, color: classColors.ClassB, stroke: false, fillOpacity: 1}).addTo(BCircles);
                            L.circle([converted.y, converted.x], {radius: 500, color: classColors.ClassC, stroke: false, fillOpacity: 1}).addTo(CCircles);
                            L.circle([converted.y, converted.x], {radius: 750, color: classColors.ClassD, stroke: false, fillOpacity: 1}).addTo(CCircles);
                            break;
                        case 4:
                            L.circle([converted.y, converted.x], {radius: 300, color: classColors.ClassC, stroke: false, fillOpacity: 1}).addTo(CCircles);
                            L.circle([converted.y, converted.x], {radius: 500, color: classColors.ClassD, stroke: false, fillOpacity: 1}).addTo(CCircles);
                            break;
                        case 5:
                            L.circle([converted.y, converted.x], {radius: 300, color: classColors.ClassD, stroke: false, fillOpacity: 1 }).addTo(CCircles);
                            break;
                        default:
                            console.log("Invalid datapoint");
                    }
                }
            };
            map.addLayer(DCircles);
            map.addLayer(CCircles);
            map.addLayer(BCircles);
            map.addLayer(ACircles);
        }
    }, [csvData, map]);
    
    //L.Util.setOptions(map, {crs: L.CRS.EPSG4326})
    
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
