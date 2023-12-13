import { TileLayer, WMSTileLayer, useMap, useMapEvents } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import L from "leaflet";

import { getPTData } from "../../../router/resources/data";
import { makePTCirclesFromData } from "../../utils/qual_layers";
import { useEffect, useRef, useState } from "react";
import { useSwissTopoContext } from "../../ctx/Swisstopo";
import proj4 from "proj4";

const wgs84 = "EPSG:4326"
const lv95 = '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs'


export default function PtMap() {
    const layerStorage = useRef<L.GeoJSON<any, any>[]>([]);
    const layers = useRef<L.GeoJSON<any, any>[]>([]);
    const [infoPtStop, setInfoPtStop] = useState<string>("")
    const {useSwissTopoMap} = useSwissTopoContext()
    const pt_stops_layer = useRef<L.TileLayer.WMS>()
    pt_stops_layer.current = L.tileLayer.wms("https://wms.geo.admin.ch/", {
        layers: "ch.bav.haltestellen-oev", transparent: true, format: "image/png"})
    const firstMount = useRef<boolean>(true);

    useEffect(() => {
        getPTData().then(data => {
            if(data != undefined){
                layerStorage.current = makePTCirclesFromData(data);
            }
        })
    }, []);

    function InfoBox() {
        if (infoPtStop == "") {
            return null;
        }
        return (
            <div dangerouslySetInnerHTML={{__html: infoPtStop}}>
            </div>
        )
    }

    function MapEvents() {
        const map = useMapEvents(
            {
            click: (e) => {
            const [x, y] = proj4(wgs84, lv95, [e.latlng.lng, e.latlng.lat]);
            const url_ident = "https://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry="+x+","+ y + "&imageDisplay=400,400,96&mapExtent="+ (x-4000)+ "," + (y-4000) + ","+ (x+4000) + "," + (y+4000) +"&geometryFormat=geojson&geometryType=esriGeometryPoint&lang=en&layers=all:ch.bav.haltestellen-oev&limit=10&returnGeometry=true&sr=2056&timeInstant=2021&tolerance=10"
            fetch(url_ident).then(response => response.json()).then(data => {
                if (data.results[0].id != undefined)
                console.log(data.results[0].id)
                return data.results[0].id;
            }
            ).then(id => {
            const url = "https://api3.geo.admin.ch/rest/services/ech/MapServer/ch.bav.haltestellen-oev/"+id+"/htmlPopup?coord=" + x + "," + y + "&lang=en&tolerance=0&sr=2056"
            fetch(url).then(response => response.text()).then(data => {
                setInfoPtStop(data);
            })})
        },
        zoomend: () => {
            const currentZoom = map.getZoom();
            if (currentZoom < 14) {
                // Remove pt stops layer if too far zoomed out
                console.log(pt_stops_layer.current)
                pt_stops_layer.current?.setOpacity(0);
                console.log("removing pt stops")
            } else {
                // Add pt stops layer if zoomed in
               if(firstMount.current){
                pt_stops_layer.current?.addTo(map);
                firstMount.current = false;
               }
               pt_stops_layer.current?.setOpacity(1);
               pt_stops_layer.current?.bringToFront();
               
            }
        }}
        )
        return null;
    }

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
            <MapContainer center={[47.36, 8.53]} zoom={10} scrollWheelZoom={true} style={{ height: '400px', width: '1000px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <WMSTileLayer url="https://wms.geo.admin.ch/" layers="ch.are.gueteklassen_oev" format="image/png" transparent={true} opacity={0.5} />
                <MapEvents/>
            </MapContainer>
            <InfoBox/>
            <Legend/>
            </div>
        )
    }
    else {
    return (
        <div id="public-transit-map">
            <MapContainer center={[47.36, 8.53]} zoom={10} scrollWheelZoom={true} style={{ height: '400px', width: '1000px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MakePtMap/>
                <MapEvents/>
            </MapContainer>
            <div className="legend">
                <InfoBox/>
                <Legend/>
            </div>
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