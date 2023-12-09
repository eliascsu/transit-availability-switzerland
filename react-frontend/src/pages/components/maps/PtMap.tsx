import { TileLayer, useMap } from "react-leaflet";
import { MapContainer } from "react-leaflet";

import { getPTData } from "../../../router/resources/data";
import { makePTCirclesFromData } from "../../utils/qual_layers";
import { useEffect } from "react";

export default function PtMap() {
    return (
        <div>
            <MapContainer center={[47.36, 8.53]} zoom={10} scrollWheelZoom={true} style={{ height: '400px', width: '400px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MakePtMap/>
            </MapContainer>
        </div>
    )
}

function MakePtMap() {
    const map = useMap();
    useEffect(() => {
    getPTData()
            .then(data => {
                if(data != undefined){
                    console.log("data being rendered: " + data);
                    const layers = makePTCirclesFromData(data);
                    layers[0].addTo(map);
                    layers[1].addTo(map);
                    layers[2].addTo(map);
                    layers[3].addTo(map);
                }
            });
    }, []);
    return null;
}