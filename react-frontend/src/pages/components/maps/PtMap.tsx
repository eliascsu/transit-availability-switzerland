import { TileLayer, WMSTileLayer, useMap } from "react-leaflet";
import { MapContainer } from "react-leaflet";

import { getPTData } from "../../../router/resources/data";
import { makePTCirclesFromData } from "../../utils/qual_layers";
import { useEffect, useRef } from "react";
import { useSwissTopoContext } from "../../ctx/Swisstopo";

export default function PtMap() {
    const layerStorage = useRef<L.GeoJSON<any, any>[]>([]);
    const layers = useRef<L.GeoJSON<any, any>[]>([]);
    const {useSwissTopoMap} = useSwissTopoContext()

    useEffect(() => {
        getPTData().then(data => {
            if(data != undefined){
                layerStorage.current = makePTCirclesFromData(data);
            }
        })
    }, []);

    function MakePtMap() {
        const map = useMap();
        useEffect(() => {
            layers.current = layerStorage.current;
            layers.current[0].addTo(map);
            layers.current[1].addTo(map);
            layers.current[2].addTo(map);
            layers.current[3].addTo(map);
        }, []);
        return null;
    }

    function remove_layers() {
        layers.current.forEach(layer => {
            layer.remove();
        });
    }

    if (useSwissTopoMap) {
        remove_layers();
        return (
            <div id="public-transit-map">
            <MapContainer center={[47.36, 8.53]} zoom={10} scrollWheelZoom={true} style={{ height: '400px', width: '400px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <WMSTileLayer url="https://wms.geo.admin.ch/" layers="ch.are.gueteklassen_oev" format="image/png" transparent={true} opacity={0.5} />
            </MapContainer>
            <Legend/>
            </div>
        )
    }
    else {
    return (
        <div id="public-transit-map">
            <MapContainer center={[47.36, 8.53]} zoom={10} scrollWheelZoom={true} style={{ height: '400px', width: '400px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MakePtMap/>
            </MapContainer>
            <Legend/>
        </div>
    )
    }
}

function Legend() {
    return (
        <div>
            <h1>Legend</h1>
            <h2>
                This map represents the connection quality of public transit in Switzerland
                </h2>
                <br/>
                <li>
                    <ul>
                        <div id="rectangle" style={{
                            width: "20px",
                            height:"15px",
                            background:"#700038"}}>
                        </div>
                    <p>Very good connection quality</p>
                    </ul>
                    <ul>
                        <div id="rectangle" style={{
                            width: "20px",
                            height:"15px",
                            background:"#9966FF"}}>
                        </div>
                    <p>Good connection quality</p>
                    </ul>
                    <ul>
                        <div id="rectangle" style={{
                            width: "20px",
                            height:"15px",
                            background:"#00B000"}}>
                        </div>
                    <p>Medium connection quality</p>
                    </ul>
                    <ul>
                        <div id="rectangle" style={{
                            width: "20px",
                            height:"15px",
                            background:"#B3FF40"}}>
                        </div>
                    <p>Bad connection quality</p>
                    </ul>
                    </li>
                <br/>

        </div>
    )
}