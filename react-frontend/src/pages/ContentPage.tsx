import { MapContainer, TileLayer, useMap, WMSTileLayer } from 'react-leaflet'
import L, { LatLng } from "leaflet";
import 'leaflet/dist/leaflet.css';
import './pages.css';
import { Control } from 'leaflet';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import "proj4leaflet";

interface CsvData {
    Haltestellen_No: number;
    Y_Koord: number;
    X_Koord: number;
    Name: string;
    Bahnknoten: number;
    Bahnlinie_Anz: number;
    TramBus_Anz: number;
    Seilbahn_Anz: number;
    A_Intervall: number;
    B_Intervall: number;
    Hst_Kat: number;
  }

// Base URL for WMS requests to map.geo.admin.ch
const WMS_GEOCH = "https://wms.geo.admin.ch/services/service?";

const myCrs = new L.Proj.CRS(
    'EPSG:2056',
    "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs",
    {
        resolutions: [
            8192, 4096, 2048, 1024, 512, 256, 128
          ],
          origin: [2485869.5728, 1076443.1884]
    },
)


// Coordinate Reference System for map.geo.admin.ch
const WMS_GEOCH_CRS = myCrs;

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
        
        <MapContainer className="map-container" center={[47.36, 8.53]} zoom={10} scrollWheelZoom={true} crs={L.CRS.EPSG4326}>
            <WMSTileLayer url={WMS_GEOCH} layers={BASEMAP} format='image/png' crs={L.CRS.EPSG4326}/>
            <WMSTileLayer url={WMS_GEOCH} layers={POP_DENS} format="image/png" crs={L.CRS.EPSG4326} transparent={true} opacity={0.5}/>
            <Map></Map>
        </MapContainer>
        
    );
}

function Map(){
    const map = useMap();
    L.Util.setOptions(map, {crs: myCrs})
    const marker = L.circle([47.36, 8.53], 100).addTo(map);
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
    
    if(csvData != undefined){
        console.log(csvData[0].X_Koord);
        console.log(csvData[0].Y_Koord);

        //const marker2 = L.circle([csvData[0].X_Koord, csvData[0].Y_Koord], 10000).addTo(map);
    }
    //L.Util.setOptions(map, {crs: L.CRS.EPSG4326})
    
    /*
    for(let row of csvData){
        const marker = L.circle([row["X_Koord"], row["Y_Koord"]], 1).addTo(map);
        //console.log(row["X_Koord"]);
    }
    */

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
