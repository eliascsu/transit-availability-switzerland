import React from "react";

import { TileLayer, WMSTileLayer, useMapEvents } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";

import L from "leaflet";
import { createHeatMap } from "../utils/utils";
// import { useHeatmapContext, useSwissTopoContext } from "../../ctx/Swisstopo";
import "leaflet.heat";
import proj4 from "proj4";
// import { SwisstopoButton } from "../Checkboxes";
import MapContext from "../context/mapContext";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const wgs84 = "EPSG:4326";
const lv95 =
  "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs";

// proj4.defs(wgs84, wgs84)
proj4.defs("EPSG:2056", lv95);

export default function PopulationHeatmap() {
  const didCancel = React.useRef(false);
  React.useEffect(
    () => () => {
      didCancel.current = true;
    },
    [],
  );
  // const { useSwissTopoMap } = useSwissTopoContext();
  const { populationDensity, populationDensityLoaded } =
    React.useContext(MapContext);
  const [infoStatePopulation, setInfoStatePopulation] =
    React.useState<string>("");
  const [useSwissTopoMap, setSwissTopoMap] = React.useState<boolean>(false);
  const layers = React.useRef<any>(null);
  const heatMapLayer = React.useRef<any>(null);

  React.useEffect(() => {
    if (populationDensity != null) {
      const heatArray = createHeatMap(populationDensity, false);
      console.log(layers.current);
      if (layers.current == null && heatArray.length > 0) {
        layers.current = L.heatLayer(heatArray, { radius: 15, max: 20 });
        heatMapLayer.current = L.heatLayer(heatArray, { radius: 15, max: 20 });
      }
    }
  }, [populationDensity]);

  function AddHeatLayer() {
    const map = useMapEvents({
      click: async (e) => {
        map.scrollWheelZoom.enable();
        const [x, y] = proj4(wgs84, lv95, [e.latlng.lng, e.latlng.lat]);
        const url_ident =
          "https://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry=" +
          x +
          "," +
          y +
          "&geometryFormat=geojson&geometryType=esriGeometryPoint&lang=en&layers=all:ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner&limit=10&returnGeometry=true&sr=2056&timeInstant=2021&tolerance=0";
        const response = await fetch(url_ident);
        const data = await response.json();
        const id = data.results[0]?.id;
        if (id == null) return;
        console.log(id);

        const url =
          "https://api3.geo.admin.ch/rest/services/ech/MapServer/ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner/" +
          id +
          "/htmlPopup?coord=" +
          x +
          "," +
          y +
          "&lang=en&tolerance=1&sr=2056";
        const response2 = await fetch(url);
        const data2 = await response2.text();
        if (didCancel.current) return;
        setInfoStatePopulation(data2 ?? "");
      },
    });

    React.useEffect(() => {
      layers.current = heatMapLayer.current;
      layers.current?.addTo(map);
    }, [map]);
    return null;
  }

  function remove_layers() {
    console.log(layers.current);
    layers.current?.remove();
  }

  function AddEvents() {
    const map = useMapEvents({
      click: async (e) => {
        // Identify the point on the map
        map.scrollWheelZoom.enable();
        const [x, y] = proj4(wgs84, lv95, [e.latlng.lng, e.latlng.lat]);
        const url_ident =
          "https://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry=" +
          x +
          "," +
          y +
          "&geometryFormat=geojson&geometryType=esriGeometryPoint&lang=en&layers=all:ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner&limit=10&returnGeometry=true&sr=2056&timeInstant=2021&tolerance=0";
        const response = await fetch(url_ident);
        const data = await response.json();
        const id = data.results[0]?.id;
        if (id == null) return;
        console.log(id);

        // Get the population data for the point
        const url =
          "https://api3.geo.admin.ch/rest/services/ech/MapServer/ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner/" +
          id +
          "/htmlPopup?coord=" +
          x +
          "," +
          y +
          "&lang=en&tolerance=0&sr=2056";
        const response2 = await fetch(url);
        const data2 = await response2.text();
        if (didCancel.current) return;
        setInfoStatePopulation(data2 ?? "");
      },
    });
    return null;
  }

  if (useSwissTopoMap) {
    remove_layers();
    return (
      <>
        <div
          style={{
            height: "100%",
            width: "100%",

            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gridTemplateRows: "1fr 1fr 1fr",
            columnGap: "3rem",
            gridTemplateAreas: `
        "map description"
        "map checkbox"
        "map infobox"
      `,
          }}
        >
          <MapContainer
            center={[47.36, 8.53]}
            zoom={10}
            scrollWheelZoom={false}
            zoomSnap={0.5}
            minZoom={8}
            style={{ height: "400px", width: "400px" }}
            maxBounds={new L.LatLngBounds([48.076, 5.397], [45.599, 11.416])}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <WMSTileLayer
              url="https://wms.geo.admin.ch/"
              layers="ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner"
              format="image/png"
              transparent={true}
              opacity={0.5}
            />
            <AddEvents />
          </MapContainer>
          <PopDescription />
          <InfoBox infoStatePopulation={infoStatePopulation} />
          <div
            id="swissTopoCheckboxDiv"
            style={{
              gridArea: "checkbox",
            }}
          >
            <p id="buttonText">
              This checkbox allows you to switch between two different population
              density maps - one provided by SwissTopo (default) and another
              custom map designed to highlight population hotspots with an
              exponential grading scale
            </p>
            <div id="swisstopButton">
              <Button
                disabled={!populationDensityLoaded}
                onClick={() => setSwissTopoMap(!useSwissTopoMap)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                }}
              >
                {useSwissTopoMap ? (
                  <p>Switch to heatmap</p>
                ) : (
                  <p>Switch to SwissTopo layer</p>
                )}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        style={{
          height: "100%",
          width: "100%",

          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gridTemplateRows: "1fr 1fr 1fr",
          columnGap: "3rem",
          gridTemplateAreas: `
        "map description"
        "map checkbox"
        "map infobox"
      `,
        }}
      >
        <MapContainer
          center={[47.36, 8.53]}
          zoom={10}
          scrollWheelZoom={false}
          zoomSnap={0.5}
          minZoom={8}
          style={{ height: "400px", width: "400px" }}
          maxBounds={new L.LatLngBounds([48.076, 5.397], [45.599, 11.416])}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <AddHeatLayer />
        </MapContainer>
        <PopDescription />
        <InfoBox infoStatePopulation={infoStatePopulation} />
        <div
          id="swissTopoCheckboxDiv"
          style={{
            gridArea: "checkbox",
          }}>
          <p id="buttonText">
            This checkbox allows you to switch between two different population
            density maps - one provided by SwissTopo (default) and another custom
            map designed to highlight population hotspots with an exponential
            grading scale
          </p>
          <div id="swisstopButton">
            <Button
              disabled={!populationDensityLoaded}
              onClick={() => setSwissTopoMap(!useSwissTopoMap)}
            >
              {useSwissTopoMap ? (
                <p>Switch to heatmap</p>
              ) : (
                <p>Switch to SwissTopo layer</p>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

const InfoBox: React.FC<{ infoStatePopulation: string }> = ({
  infoStatePopulation,
}) => {
  console.log(infoStatePopulation);
  if (infoStatePopulation === "") {
    return (
      <p style={{ textAlign: "center" }}>
        <InfoTwoToneIcon/> Click on a tile to display info
      </p>
    );
  }
  return (
    <div
      id="infoBox"
      dangerouslySetInnerHTML={{
        __html: infoStatePopulation.replace(
          /Population\scount/g,
          "Population Count / ha",
        ),
      }}
    />
  );
};

function PopDescription() {
  return (
    <Typography
      variant="h6"
      style={{
        gridArea: "description",
        paddingTop: "2rem",
      }}
    >
      <b>Population density in Switzerland</b>
    </Typography>
  );
}
