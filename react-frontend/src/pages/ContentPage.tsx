import { MapContainer, TileLayer, useMap, WMSTileLayer } from 'react-leaflet'
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import './pages.css';

//import { Loader } from '@googlemaps/js-api-loader';
function ContentPage() {
    return (
        <MapContainer className="map-container" center={[47.36, 8.53]} zoom={10} scrollWheelZoom={false}>
            <WMSTileLayer url="https://wms.geo.admin.ch/services/service?" layers="ch.swisstopo.pixelkarte-farbe-pk100.noscale" format="image/png" crs={L.CRS.EPSG4326}/>
        </MapContainer>
    );
}

export default ContentPage;
