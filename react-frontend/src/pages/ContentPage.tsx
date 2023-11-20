import { MapContainer, TileLayer, useMap, WMSTileLayer } from 'react-leaflet'
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import './pages.css';
import { Control } from 'leaflet';

// Base URL for WMS requests to map.geo.admin.ch
const WMS_GEOCH = "https://wms.geo.admin.ch/services/service?";

// Coordinate Reference System for map.geo.admin.ch
const WMS_GEOCH_CRS = L.CRS.EPSG4326;

// Layer names for map.geo.admin.ch
const PT_QUAL = "ch.are.gueteklassen_oev"
const POP_DENS = "ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner"

function ContentPage() {
    return (
        <body>
        <h1>Content Page</h1>
        <Map/>
        <Legend/>
        </body>)
}

function Map() {
    
    return (
        <MapContainer className="map-container" center={[47.36, 8.53]} zoom={10} scrollWheelZoom={true}>
            <TileLayer url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=119ad4f25bed4ec2a70aeba31a0fb12a" attribution="&copy; <a href=&quot;https://www.thunderforest.com/&quot;>Thunderforest</a> contributors"/>
            <WMSTileLayer url={WMS_GEOCH} layers={PT_QUAL} format="image/png" crs={WMS_GEOCH_CRS} transparent={true} opacity={0.5}/>
            <WMSTileLayer url={WMS_GEOCH} layers={POP_DENS} format="image/png" crs={WMS_GEOCH_CRS} transparent={true} opacity={0.5}/>
        </MapContainer>
    );
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
