import React from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import "leaflet/dist/leaflet.css";

import { TileLayer, WMSTileLayer, useMapEvents } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import L, { LatLng } from "leaflet";

import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";

import { getPopupPublicTransportStop } from "../api/swisstopo";
import Legend from "./ptmap/legend";

export default function PtMap() {
  const { t } = useTranslation();
  const infoPtStop = React.useRef<string>("");
  const pt_stops_layer = React.useRef<L.TileLayer.WMS>();
  pt_stops_layer.current = L.tileLayer.wms("https://wms.geo.admin.ch/", { layers: "ch.bav.haltestellen-oev", transparent: true, format: "image/png" });
  const firstMount = React.useRef<boolean>(true);
  const tmp = React.useRef<LatLng>(new LatLng(0, 0));

  function MapEvents() {
    const map = useMapEvents(
      {
        click: async (e) => {
          map.scrollWheelZoom.enable();
          infoPtStop.current = "";
          infoPtStop.current = await getPopupPublicTransportStop(e.latlng.lat, e.latlng.lng);
          tmp.current = e.latlng;

          if (infoPtStop.current != "" && tmp.current != undefined) {
            map.openPopup(infoPtStop.current, tmp.current, { minWidth: 400, className: "custom-popup" });
          }
        },
        zoomend: () => {
          const currentZoom = map.getZoom();
          if (currentZoom < 14) {
            // Remove pt stops layer if too far zoomed out
            console.log(pt_stops_layer.current);
            pt_stops_layer.current?.setOpacity(0);
            console.log("removing pt stops");
          } else {
            // Add pt stops layer if zoomed in
            if (firstMount.current) {
              pt_stops_layer.current?.addTo(map);
              firstMount.current = false;
            }
            pt_stops_layer.current?.setOpacity(1);
            pt_stops_layer.current?.bringToFront();
          }
        },
      },
    );
    React.useEffect(() => {
      map.scrollWheelZoom.disable();
    }, []);
    return null;
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        columnGap: "3rem",
        margin: "16px",
      }}
    >
      <Box sx={{ flexBasis: "33.33%" }}>
        <Typography variant="h6" id="transitTitle">
          <b>{t("connection-quality-of")} <Box component="span" className="highlightedText">{t("public-transport")}</Box> {t("in-switzerland")}</b>
        </Typography>
        <Legend/>
        <Typography variant="body1" id="ptInfo">
          {t("pt-info")}
          <br/><br/>
          <InfoTwoToneIcon /> {t("click-on-a-stop-to-display-the-next-departures")}
        </Typography>
      </Box>
      <MapContainer
        center={[47.36, 8.53]}
        zoom={10}
        scrollWheelZoom={true}
        zoomSnap={0.5}
        minZoom={8}
        style={{ height: "400px", width: "1000px" }}
        maxBounds={new L.LatLngBounds([48.076, 5.397], [45.599, 11.416])}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <WMSTileLayer url="https://wms.geo.admin.ch/" layers="ch.are.gueteklassen_oev" format="image/png" transparent={true} opacity={0.5} />
        <MapEvents/>
      </MapContainer>
    </Box>
  );
}

