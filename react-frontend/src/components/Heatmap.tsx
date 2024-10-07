import React from "react";

import { TileLayer, WMSTileLayer, useMapEvents } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { createHeatMap } from "../utils/utils";
// import { useHeatmapContext, useSwissTopoContext } from "../../ctx/Swisstopo";
import "leaflet.heat";
import proj4 from "proj4";
// import { SwisstopoButton } from "../Checkboxes";
// import info_icon from "../../../svg/info_icon.svg";
import MapContext from "../context/mapContext";

const wgs84 = "EPSG:4326";
const lv95 = "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs";

// proj4.defs(wgs84, wgs84)
proj4.defs("EPSG:2056", lv95);

export default function PopulationHeatmap() {
  const didCancel = React.useRef(false);
  React.useEffect(() => () => { didCancel.current = true; }, []);
  // const { useSwissTopoMap } = useSwissTopoContext();
  const { populationDensity } = React.useContext(MapContext);
  const [infoStatePopulation, setInfoStatePopulation] = React.useState<string>("");
  const layers = React.useRef<any>(null);
  const heatMapLayer = React.useRef<any>(null);

  React.useEffect(() => {
    if (populationDensity != undefined) {
      const heatArray = createHeatMap(populationDensity, false);
      console.log(layers.current);
      if (layers.current == null) {
        layers.current = L.heatLayer(heatArray, { radius: 15, max: 20 });
        heatMapLayer.current = L.heatLayer(heatArray, { radius: 15, max: 20 });
      }
    }
  }, [populationDensity]);

  function AddHeatLayer() {
    const map = useMapEvents(
      {
        click: async (e) => {
          map.scrollWheelZoom.enable();
          const [x, y] = proj4(wgs84, lv95, [e.latlng.lng, e.latlng.lat]);
          const url_ident = "https://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry=" + x + "," + y + "&geometryFormat=geojson&geometryType=esriGeometryPoint&lang=en&layers=all:ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner&limit=10&returnGeometry=true&sr=2056&timeInstant=2021&tolerance=0";
          const response = await fetch(url_ident);
          const data = await response.json();
          const id = data.results[0]?.id;
          if (id == null) return;
          console.log(id);

          const url = "https://api3.geo.admin.ch/rest/services/ech/MapServer/ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner/" + id + "/htmlPopup?coord=" + x + "," + y + "&lang=en&tolerance=1&sr=2056";
          const response2 = await fetch(url);
          const data2 = await response2.text();
          if (didCancel.current) return;
          setInfoStatePopulation(data2 ?? "");
        },
      });

    React.useEffect(() => {
      layers.current = heatMapLayer.current;
      layers.current.addTo(map);
    }, []);
    return null;
  }

  function remove_layers() {
    console.log(layers.current);
    layers.current?.remove();
  }

  function AddEvents() {
    const map = useMapEvents(
      {
        click: async (e) => {
          // Identify the point on the map
          map.scrollWheelZoom.enable();
          const [x, y] = proj4(wgs84, lv95, [e.latlng.lng, e.latlng.lat]);
          const url_ident = "https://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry=" + x + "," + y + "&geometryFormat=geojson&geometryType=esriGeometryPoint&lang=en&layers=all:ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner&limit=10&returnGeometry=true&sr=2056&timeInstant=2021&tolerance=0";
          const response = await fetch(url_ident);
          const data = await response.json();
          const id = data.results[0]?.id;
          if (id == undefined) return;
          console.log(id);

          // Get the population data for the point
          const url = "https://api3.geo.admin.ch/rest/services/ech/MapServer/ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner/" + id + "/htmlPopup?coord=" + x + "," + y + "&lang=en&tolerance=0&sr=2056";
          const response2 = await fetch(url);
          const data2 = await response2.text();
          if (didCancel.current) return;
          setInfoStatePopulation(data2 ?? "");
        },
      });
    return null;
  }

  if (false) {//(useSwissTopoMap) {

    remove_layers();
    return (
            <div id="population-map">
            <MapContainer
              center={[47.36, 8.53]}
              zoom={10}
              scrollWheelZoom={false}
              zoomSnap={0.5}
              minZoom={8}
              style={{ height: "400px", width: "400px" }}
              maxBounds={new L.LatLngBounds([48.076, 5.397], [45.599, 11.416])}
            >
              <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <WMSTileLayer url="https://wms.geo.admin.ch/" layers="ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner" format="image/png" transparent={true} opacity={0.5} />
              <AddEvents/>
            </MapContainer>
            <PopDescription/>
            <CheckboxDisplay/>
            <InfoBox infoStatePopulation={infoStatePopulation} />
            </div>
    );
  }

  return (
    <div id="population-map">
      <MapContainer
        center={[47.36, 8.53]}
        zoom={10}
        scrollWheelZoom={false}
        zoomSnap={0.5}
        minZoom={8}
        style={{ height: "400px", width: "400px" }}
        maxBounds={new L.LatLngBounds([48.076, 5.397], [45.599, 11.416])}
      >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddHeatLayer/>
      </MapContainer>
      <PopDescription/>
      <CheckboxDisplay/>
      <InfoBox infoStatePopulation={infoStatePopulation}/>
    </div>
  );
}

const InfoBox: React.FC<{ infoStatePopulation: string }> = ({ infoStatePopulation }) => {
  console.log(infoStatePopulation);
  if (infoStatePopulation == "") {
    return (
            <p style={{ textAlign: "center" }}>{ /*<img src={info_icon}/>*/} Click on a tile to display info</p>
    );
  }
  return (
        <div id="infoBox" dangerouslySetInnerHTML={{ __html: infoStatePopulation.replace(/Population\scount/g, "Population Count / ha") }}/>
  );
};

function PopDescription() {
  return (
        <h2 id="populationTitle">
            <div className="highlightedText">Population density</div> in Switzerland
        </h2>
  );
}

function CheckboxDisplay() {
  return (
    <div id="swissTopoCheckboxDiv">
      <p id="buttonText">
        This checkbox allows you to switch between two different population density maps
        - one provided by SwissTopo (default) and another custom map designed to highlight
        population hotspots with an exponential grading scale
      </p>
      {/* <SwisstopoButton/> */}
    </div>
  );
}
