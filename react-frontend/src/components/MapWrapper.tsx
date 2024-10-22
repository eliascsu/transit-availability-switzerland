import React, { useEffect, useState, useRef } from "react";

import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import { TileLayer, useMapEvents } from "react-leaflet";

import Box from "@mui/material/Box";

import { WGS84, LV95 } from "../utils/constants";

import {
  addPointToLine,
  createHeatMap,
  getLineColor,
} from "../utils/utils";
import { makePTCirclesFromData } from "../utils/qual_layers";

import CheckBoxes from "./Checkboxes";
import FormComponent from "./FormComponent";
import StyledMapContainer from "./mapContainer";

import LayerContext from "../context/LayerContext";
import MapContext from "../context/mapContext";

import proj4 from "proj4";

const MapWrapper = React.memo(function MapWrapper() {
  return (
    <>
    <Box
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        columnGap: "3rem",
        margin: "16px",
        paddingTop: "32px",
      }}
    >
      <StyledMapContainer>
        <TileLayer maxZoom={100} url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=119ad4f25bed4ec2a70aeba31a0fb12a" attribution="&copy; <a href=&quot;https://www.thunderforest.com/&quot;>Thunderforest</a> contributors" />
        <TileLayer url="https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"></TileLayer>
        <Map></Map>
      </StyledMapContainer>
      <Box style={{
        flexBasis: "33.33%",
        height: "90%",
        flexDirection: "column",
        display: "flex",
        justifyContent: "space-between",
      }}>
        <CheckBoxes/>
        <FormComponent />
      </Box>
    </Box>
    </>
  );
});

const Map = React.memo(function Map() {
  const geoJsonCache = useRef<L.GeoJSON<any, any>[]>([]);
  const populationHeatMapCache = useRef<L.HeatLayer>();
  const populationUnservedHeatMapCache = useRef<L.HeatLayer>();

  const {
    populationDensity,
    populationUnserved,
    ptStopsAre,
    postUserPoints,
    getScoreUserPtLines,
  } = React.useContext(MapContext);

  useEffect(() => {
    if (populationDensity != null && populationDensity.length > 0) {
      const heatArray = createHeatMap(populationDensity, false);
      populationHeatMapCache.current = L.heatLayer(heatArray, { radius: 15, max: 1 });
    }
  }, [populationDensity]);

  useEffect(() => {
    if (populationUnserved != null && populationUnserved.length > 0) {
      const heatArray = createHeatMap(populationUnserved, true);
      populationUnservedHeatMapCache.current = L.heatLayer(heatArray, { radius: 15, max: 1 });
    }
  }, [populationUnserved]);

  useEffect(() => {
    if (ptStopsAre != null && ptStopsAre.length > 0) {
      geoJsonCache.current = makePTCirclesFromData(ptStopsAre);
    }
  }, [ptStopsAre]);

  // Currently active layers
  const geoJsonLayersRef = useRef<L.GeoJSON<any, any>[]>([]);
  const userGeoJsonLayersRef = useRef<L.GeoJSON<any, any>[]>([]);
  const heatMapLayerRef = useRef<L.HeatLayer>();
  const unservedHeatmapRef = useRef<L.HeatLayer>();

  // Trigger update of PT layers
  const [updatePT, setUpdatePT] = useState<number>(0);

  // Keep track of pt layers over zoom states
  const pt_stops_layer = useRef<L.TileLayer.WMS>();
  pt_stops_layer.current = L.tileLayer.wms("https://wms.geo.admin.ch/", { layers: "ch.bav.haltestellen-oev", transparent: true, format: "image/png", minZoom: 14, maxZoom: 20 });

  const {
    visibleLayersState, linesFromFormState,
    drawingState, userLinesRef, setScore,
  } = React.useContext(LayerContext);

  const map = useMapEvents({
    click: async (e) => {
      map.scrollWheelZoom.enable();
      console.log(linesFromFormState);
      console.log(drawingState);
      if (drawingState) {

        // Check if there is a PT stop nearby (snapping)
        const [x, y] = proj4(WGS84, LV95, [e.latlng.lng, e.latlng.lat]);

        const url_ident = "https://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry=" + x + "," + y + "&imageDisplay=400,400,96&mapExtent=" + (x - 4000) + "," + (y - 4000) + "," + (x + 4000) + "," + (y + 4000) + "&geometryFormat=geojson&geometryType=esriGeometryPoint&lang=en&layers=all:ch.bav.haltestellen-oev&limit=10&returnGeometry=true&sr=2056&timeInstant=2021&tolerance=7";
        const response = await fetch(url_ident);
        const data = await response.json();
        let coords;
        if (data.results[0]) {
          coords = proj4(LV95, WGS84, data.results[0].geometry?.coordinates[0]) as number[];
        }
        else {
          coords = [e.latlng.lng, e.latlng.lat];
        }

        for (const line of userLinesRef.current) {
          L.geoJSON(line).removeFrom(map);
        }
        // On click add point to currently active line and redraw
        const user_lines_geojson = userLinesRef.current;
        userLinesRef.current = addPointToLine(user_lines_geojson, coords);
        console.log(userLinesRef.current);
        // Redraw user lines
        for (const feat of userLinesRef.current) {
          L.geoJSON(feat, {
            style: {
              color: getLineColor(feat.properties?.lineType),
              opacity: 1,
            },
          }).addTo(map).bringToFront();
        }

        // Redraw pt quality layers
        setUpdatePT(updatePT + 1);
      }
    },
  });

  useEffect(() => {
    map.scrollWheelZoom.disable();
    pt_stops_layer.current?.addTo(map);
  }, []);

  useEffect(() => {
    if (visibleLayersState.popLayer) {
      heatMapLayerRef.current = populationHeatMapCache.current;
      heatMapLayerRef.current?.addTo(map);
    }
    else {
      heatMapLayerRef.current?.removeFrom(map);
    }
  }, [visibleLayersState.popLayer]);

  useEffect(() => {
    if (visibleLayersState.popUnservedLayer) {
      unservedHeatmapRef.current = populationUnservedHeatMapCache.current;
      unservedHeatmapRef.current?.addTo(map);
    }
    else {
      unservedHeatmapRef.current?.removeFrom(map);
    }
  }, [visibleLayersState.popUnservedLayer]);

  useEffect(() => {
    if (visibleLayersState.transportLayer) {
      geoJsonLayersRef.current = geoJsonCache.current;

      if (geoJsonLayersRef.current.length == 0) {
        return;
      }
      geoJsonLayersRef.current[0].addTo(map);
      geoJsonLayersRef.current[1].addTo(map);
      geoJsonLayersRef.current[2].addTo(map);
      geoJsonLayersRef.current[3].addTo(map);
    }
    else {
      for (const layer of geoJsonLayersRef.current) {
        layer.removeFrom(map);
      }
    }
  }, [visibleLayersState.transportLayer, updatePT]);

  /**
     * On form submit redraw user lines
     */
  const redrawUserLines = async () => {
    //Adding points for traffic stops
    //TODO HST KAT CALULATION

    for (const line of userLinesRef.current) {
      L.geoJSON(line).removeFrom(map);
    }
    // First set the type and interval for the new line
    const lineInfo = linesFromFormState[linesFromFormState.length - 1];
    const lastFeature = userLinesRef.current[userLinesRef.current.length - 1];
    if (lastFeature != undefined && linesFromFormState.length > 0) {
      const typ = lineInfo.typ;
      const interval = lineInfo.intervall;
      let kat;
      if ((interval == 3.5 && typ == "S_Bahn") || (interval == 7 && (typ == "Bus" || typ == "Tram"))) {
        kat = 1;
      }
      if ((interval == 3.5 && (typ == "Bus" || typ == "Tram")) || (interval == 7 && typ == "S_Bahn")) {
        kat = 2;
      }
      if ((interval == 7 && (typ == "Bus" || typ == "Tram")) || interval == 15 && typ == "S_Bahn") {
        kat = 3;
      }
      if ((interval == 15 && (typ == "Bus" || typ == "Tram")) || (interval == 30 && typ == "S_Bahn")) {
        kat = 4;
      }
      if ((interval == 30 && (typ == "Bus" || typ == "Tram")) || interval == 60) {
        kat = 5;
      }

      const newLastFeature = {
        "type": "Feature",
        "geometry": lastFeature.geometry,
        "properties": {
          lineType: lineInfo.typ,
          interval: lineInfo.intervall,
          Hst_kat: kat,
        },
      } as GeoJSON.Feature;
      userLinesRef.current[userLinesRef.current.length - 1] = newLastFeature;
    }
    if (userLinesRef.current != undefined && visibleLayersState.transportLayer) {
      const data: GeoJSON.Feature[] = userLinesRef.current;
      userGeoJsonLayersRef.current = makePTCirclesFromData(data);
      map.eachLayer((layer) => {
        if (geoJsonLayersRef.current.some((curr) => layer == curr)) {
          map.removeLayer(layer);
        };
      });
      if (userGeoJsonLayersRef.current.length == 0 || geoJsonLayersRef.current.length == 0) {
        return;
      }

      userGeoJsonLayersRef.current[0].addTo(geoJsonLayersRef.current[0]);
      userGeoJsonLayersRef.current[1].addTo(geoJsonLayersRef.current[1]);
      userGeoJsonLayersRef.current[2].addTo(geoJsonLayersRef.current[2]);
      userGeoJsonLayersRef.current[3].addTo(geoJsonLayersRef.current[3]);

      map.addLayer(geoJsonLayersRef.current[0]);
      map.addLayer(geoJsonLayersRef.current[1]);
      map.addLayer(geoJsonLayersRef.current[2]);
      map.addLayer(geoJsonLayersRef.current[3]);
    }
    // Rerender geoJSON features on map
    for (const feat of userLinesRef.current) {
      L.geoJSON(feat, {
        style: {
          color: getLineColor(feat.properties?.lineType),
        },
      }).addTo(map);
    }

    // Push new empty linestring to array
    userLinesRef.current.push(
      {
        "type": "Feature",
        "geometry": {
          type: "LineString",
          coordinates: [],
        },
        "properties": {
          lineType: "pending",
          interval: -1,
        },
      },
    );
    const data = await postUserPoints(userLinesRef.current);
    if (data != undefined) {
      userLinesRef.current = data;
    }
    // Get score for user lines
    const score = await getScoreUserPtLines();
    setScore(score);
  };

  useEffect(() => {
    redrawUserLines();

  }, [linesFromFormState, visibleLayersState.transportLayer]);

  return null;
});

export default MapWrapper;
