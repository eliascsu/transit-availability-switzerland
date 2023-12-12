import { TileLayer, WMSTileLayer, useMapEvents } from "react-leaflet";
import { MapContainer } from "react-leaflet";

import { getPopulationDensity } from "../../../router/resources/data";
import L, { HeatLatLngTuple } from "leaflet";
import { createHeatMap } from "../../utils/utils";
import { useHeatmapContext, useSwissTopoContext } from "../../ctx/Swisstopo";
import { useEffect, useRef } from "react";
import "leaflet.heat";
import proj4 from "proj4";

const wgs84 = "EPSG:4326"
const lv95 = '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs'

// proj4.defs(wgs84, wgs84)
proj4.defs('EPSG:2056', lv95)

export default function PopulationHeatmap() {
    const {useSwissTopoMap } = useSwissTopoContext()
    const {infoStatePopulation, setInfoStatePopulation} = useHeatmapContext()
    const layers = useRef<any>(null);
    const heatMapLayer = useRef<any>(null);

    // Load the heatmap data on page load
    useEffect(() => {
        getPopulationDensity()
            .then(popArray => {
                let heatArray: HeatLatLngTuple[] = [];
                if(popArray != undefined){
                    heatArray = createHeatMap(popArray);
                    console.log(layers.current)
                    if (layers.current == null) {
                        layers.current = L.heatLayer(heatArray, {radius: 15, max: 20});
                        console.log("adding heat layer")
                        heatMapLayer.current = L.heatLayer(heatArray, {radius: 15, max: 20})
                    }
                }
            });
    }, []);

    function AddHeatLayer() {
        console.log("AddHeatLayer");
        const map = useMapEvents(
            {
            click: (e) => {
            const [x, y] = proj4(wgs84, lv95, [e.latlng.lng, e.latlng.lat]);
            const url_ident = "https://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry="+x+","+ y + "&geometryFormat=geojson&geometryType=esriGeometryPoint&lang=en&layers=all:ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner&limit=10&returnGeometry=true&sr=2056&timeInstant=2021&tolerance=0"
            fetch(url_ident).then(response => response.json()).then(data => {
                if (data.results[0].id != undefined)
                return data.results[0].id;
            }
            ).then(id => {
            const url = "https://api3.geo.admin.ch/rest/services/ech/MapServer/ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner/"+id+"/htmlPopup?coord=" + x + "," + y + "&lang=en&tolerance=1&sr=2056"
            fetch(url).then(response => response.text()).then(data => {
                setInfoStatePopulation(data);
            })})
        }})

        useEffect(() => {
            layers.current = heatMapLayer.current
            layers.current.addTo(map);
        }, []);
        return null;
    }

    function remove_layers() {
        console.log(layers.current)
        layers.current?.remove()
    }

    function AddEvents() {
        const map = useMapEvents(
            {
            click: (e) => {
            const [x, y] = proj4(wgs84, lv95, [e.latlng.lng, e.latlng.lat]);
            const url_ident = "https://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry="+x+","+ y + "&geometryFormat=geojson&geometryType=esriGeometryPoint&lang=en&layers=all:ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner&limit=10&returnGeometry=true&sr=2056&timeInstant=2021&tolerance=0"
            fetch(url_ident).then(response => response.json()).then(data => {
                if (data.results[0].id != undefined)
                console.log(data.results[0].id)
                return data.results[0].id;
            }
            ).then(id => {
            const url = "https://api3.geo.admin.ch/rest/services/ech/MapServer/ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner/"+id+"/htmlPopup?coord=" + x + "," + y + "&lang=en&tolerance=0&sr=2056"
            fetch(url).then(response => response.text()).then(data => {
                setInfoStatePopulation(data);
            })})
        }})
        return null;
    }

    if (useSwissTopoMap) {

        remove_layers();
        return (
            <div>
            <MapContainer id="population-map"center={[47.36, 8.53]} zoom={10} scrollWheelZoom={true} style={{ height: '400px', width: '400px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <WMSTileLayer url="https://wms.geo.admin.ch/" layers="ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner" format="image/png" transparent={true} opacity={0.5} />
                <AddEvents/>
            </MapContainer>
            <InfoBox/>
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
            <InfoBox/>
        </div>
    )
}

function InfoBox() {
    const {infoStatePopulation} = useHeatmapContext()
    console.log(infoStatePopulation)
    if (infoStatePopulation == "") {
        return null;
    }
    return (
        <div dangerouslySetInnerHTML={{__html: infoStatePopulation}}>
        </div>
    )
}