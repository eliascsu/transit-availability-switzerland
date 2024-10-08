import React from "react";
import styled from "@emotion/styled";

import { useTranslation } from "react-i18next";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { TileLayer, WMSTileLayer, useMapEvents } from "react-leaflet";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import Typography from "@mui/material/Typography";

import StyledMapContainer from "../mapContainer";
import { createHeatMap } from "../../utils/utils";
import "leaflet.heat";
import proj4 from "proj4";

import MapContext from "../../context/mapContext";
import { WGS84, LV95 } from "../../utils/constants";

proj4.defs("EPSG:2056", LV95);

const PageContainer = styled(Box)`
  height: 100%;
  width: 100%;
  display: flex;
  column-gap: 3rem;
  margin: 16px;
  padding-top: 32px;
`;

const Description: React.FC<
{ useSwissTopoMap: boolean,
  setSwissTopoMap: (value: boolean) => void,
  infoStatePopulation: string,
}> = ({ useSwissTopoMap, setSwissTopoMap, infoStatePopulation }) => {
  const { t } = useTranslation();
  const { populationDensityLoaded } = React.useContext(MapContext);
  return (
    <div className="test" style={{ flexBasis: "33.33%" }}>
      <Typography
      variant="h6"
      style={{
        gridArea: "description",
        paddingTop: "2rem",
      }}
      >
        <b>{t("heatmap.population-density-in-switzerland")}</b>
      </Typography>
      <InfoBox infoStatePopulation={infoStatePopulation} />
      <div
        id="swissTopoCheckboxDiv"
        style={{
          gridArea: "checkbox",
        }}>
        <p id="buttonText">
          {t("heatmap.checkbox-switch")}
        </p>
        <div id="swisstopButton">
          <Button
            disabled={!populationDensityLoaded}
            onClick={() => setSwissTopoMap(!useSwissTopoMap)}
          >
            {useSwissTopoMap ? (
              <p>{t("heatmap.switch-to-heatmap-layer")}</p>
            ) : (
              <p>{t("heatmap.switch-to-swisstopo-layer")}</p>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function PopulationHeatmap() {
  const didCancel = React.useRef(false);
  React.useEffect(() => () => { didCancel.current = true; }, []);

  const { populationDensity } = React.useContext(MapContext);
  const [infoStatePopulation, setInfoStatePopulation] = React.useState<string>("");
  const [useSwissTopoMap, setSwissTopoMap] = React.useState<boolean>(false);
  const layers = React.useRef<any>(null);
  const heatMapLayer = React.useRef<any>(null);

  React.useEffect(() => {
    if (populationDensity != null) {
      const heatArray = createHeatMap(populationDensity, false);
      if (layers.current == null && heatArray.length > 0) {
        layers.current = L.heatLayer(heatArray, { radius: 15, max: 20 });
        heatMapLayer.current = L.heatLayer(heatArray, { radius: 15, max: 20 });
      }
    }
  }, [populationDensity]);

  const getPopup = async (e: any) => {
    const [x, y] = proj4(WGS84, LV95, [e.latlng.lng, e.latlng.lat]);
    const url_identify =
      "https://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry=" +
      x +
      "," +
      y +
      "&geometryFormat=geojson" +
      "&geometryType=esriGeometryPoint" +
      "&lang=en" +
      "&layers=all:ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner" +
      "&limit=10" +
      "&returnGeometry=true" +
      "&sr=2056" +
      "&timeInstant=2021" +
      "&tolerance=0";
    const response = await fetch(url_identify);
    const data = await response.json();
    const id = data.results[0]?.id;
    if (id == null) return;

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
    setInfoStatePopulation(data2 ?? "");
  };

  function AddHeatLayer() {
    const map = useMapEvents({
      click: async (e) => {
        map.scrollWheelZoom.enable();
        getPopup(e);
      },
    });

    React.useEffect(() => {
      layers.current = heatMapLayer.current;
      layers.current?.addTo(map);
    }, [map]);
    return null;
  }

  function remove_layers() {
    layers.current?.remove();
  }

  function AddEvents() {
    const map = useMapEvents({
      click: async (e) => {
        // Identify the point on the map
        map.scrollWheelZoom.enable();
        getPopup(e);
      },
    });
    return null;
  }

  if (useSwissTopoMap) {
    remove_layers();
    return (
      <>
        <PageContainer
        >
          <StyledMapContainer>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <WMSTileLayer
              url="https://wms.geo.admin.ch/"
              layers="ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner"
              format="image/png"
              transparent={true}
              opacity={0.5}
            />
            <AddEvents />
          </StyledMapContainer>
          <div className="test" style={{ flexBasis: "33.33%" }}>
            <Description
              useSwissTopoMap={useSwissTopoMap}
              setSwissTopoMap={setSwissTopoMap}
              infoStatePopulation={infoStatePopulation}
            />
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <PageContainer>
        <StyledMapContainer>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <AddHeatLayer />
        </StyledMapContainer>
        <div className="test" style={{ flexBasis: "33.33%" }}>
          <Description
            useSwissTopoMap={useSwissTopoMap}
            setSwissTopoMap={setSwissTopoMap}
            infoStatePopulation={infoStatePopulation}
            />
        </div>
      </PageContainer>
    </>
  );
}

const InfoBox: React.FC<{ infoStatePopulation: string }> = ({
  infoStatePopulation,
}) => {
  const { t } = useTranslation();
  if (infoStatePopulation === "") {
    return (
      <p style={{ textAlign: "center" }}>
        <InfoTwoToneIcon/> {t("heatmap.click-on-a-tile-to-display-info")}
      </p>
    );
  }
  return (
    <div
      id="infoBox"
      dangerouslySetInnerHTML={{
        __html: infoStatePopulation.replace(
          /Population\scount/g,
          t("heatmap.population-count-ha"),
        ),
      }}
    />
  );
};
