import { TileLayer, WMSTileLayer, useMap } from "react-leaflet";
import { MapContainer } from "react-leaflet";

import { getPopulationDensity } from "../../../router/resources/data";
import L, { HeatLatLngTuple } from "leaflet";
import { createHeatMap } from "../../utils/utils";
import { useSwissTopoContext } from "../../ctx/Swisstopo";
import { useEffect, useRef } from "react";
import "leaflet.heat";

export default function PopulationHeatmap() {
    const {useSwissTopoMap} = useSwissTopoContext()
    const layers = useRef<any>(null);

    function AddHeatLayer() {
        console.log("AddHeatLayer");
        const map = useMap();
        useEffect(() => {
        getPopulationDensity()
            .then(popArray => {
                let heatArray: HeatLatLngTuple[] = [];
                if(popArray != undefined){
                    heatArray = createHeatMap(popArray);
                    layers.current = L.heatLayer(heatArray, {radius: 15, max: 20});
                    console.log("adding heat layer")
                    layers.current.addTo(map);
                }
            });
        }, []);
        return null;
    }

    function remove_layers() {
        console.log(layers.current)
        layers.current?.remove()
    }

    if (useSwissTopoMap) {
        remove_layers();
        return (
            <div>
            <MapContainer center={[47.36, 8.53]} zoom={10} scrollWheelZoom={true} style={{ height: '400px', width: '400px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <WMSTileLayer url="https://wms.geo.admin.ch/" layers="ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner" format="image/png" transparent={true} opacity={0.5} />
            </MapContainer>
            </div>
        )
    }

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
