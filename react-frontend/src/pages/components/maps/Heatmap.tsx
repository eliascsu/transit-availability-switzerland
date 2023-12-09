import { TileLayer, useMap } from "react-leaflet";
import { MapContainer } from "react-leaflet";

import { getPopulationDensity } from "../../../router/resources/data";
import L, { HeatLatLngTuple, map } from "leaflet";
import { createHeatMap } from "../../utils/utils";

export default function PopulationHeatmap() {
    return (
        <div>
            <MapContainer center={[47.36, 8.53]} zoom={10} scrollWheelZoom={true} style={{ height: '400px', width: '400px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <AddHeatLayer/>
            </MapContainer>
        </div>
    )
}

function AddHeatLayer() {
    console.log("AddHeatLayer");
    const map = useMap();
    getPopulationDensity()
        .then(popArray => {
            let heatArray: HeatLatLngTuple[] = [];
            if(popArray != undefined){
                heatArray = createHeatMap(popArray);
                L.heatLayer(heatArray, {radius: 15, max: 10}).addTo(map);
            }
        });
    return null;
}

