import React from "react";
import styled from "@emotion/styled";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { TileLayer, WMSTileLayer, useMapEvents } from "react-leaflet";

import Box from "@mui/material/Box";

import MapContext from "../../context/mapContext";

import { createHeatMap } from "../../utils/utils";
import { getPopupPopulationDensity } from "../../api/swisstopo";

import StyledMapContainer from "../mapContainer";
import HeatmapDescription from "./heatmapDescription";

const PageContainer = styled(Box)`
  height: 100%;
  width: 100%;
  display: flex;
  column-gap: 3rem;
  margin: 16px;
  padding-top: 32px;
`;

const PopulationHeatmap: React.FC = () => {
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

  function AddHeatLayer() {
    const map = useMapEvents({
      click: async (e) => {
        map.scrollWheelZoom.enable();
        const data2 = await getPopupPopulationDensity(e.latlng.lng, e.latlng.lat);
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
    layers.current?.remove();
  }

  function AddEvents() {
    const map = useMapEvents({
      click: async (e) => {
        // Identify the point on the map
        map.scrollWheelZoom.enable();
        const data2 = await getPopupPopulationDensity(e.latlng.lng, e.latlng.lat);
        setInfoStatePopulation(data2 ?? "");
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
          <HeatmapDescription
            useSwissTopoMap={useSwissTopoMap}
            setSwissTopoMap={setSwissTopoMap}
            infoStatePopulation={infoStatePopulation}
          />
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
        <HeatmapDescription
          useSwissTopoMap={useSwissTopoMap}
          setSwissTopoMap={setSwissTopoMap}
          infoStatePopulation={infoStatePopulation}
        />
      </PageContainer>
    </>
  );
};

export default PopulationHeatmap;
