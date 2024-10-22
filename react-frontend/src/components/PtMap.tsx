import React from "react";

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import "leaflet/dist/leaflet.css";

import { TileLayer, WMSTileLayer, useMapEvents } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import L, { LatLng } from "leaflet";

import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";

import { getPopupPublicTransportStop } from "../api/swisstopo";

export default function PtMap() {
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
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        columnGap: "3rem",
        margin: "16px",
      }}
    >
      <div style={{ flexBasis: "33.33%" }}>
        <Title/>
        <Legend/>
        <InfoBox/>
      </div>
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
    </div>
  );
}

function Legend() {
  return (
        <Card variant="outlined" sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: 1,
          bgcolor: (theme) => theme.palette.background.default,
        }}>
            <Typography id="legendTitle">Connection quality:</Typography>
            <Divider sx={{
              margin: 1,
              color: "black",
              width: "90%",
            }}/>
            <div style={{ listStyleType: "none" }} >
                <LegendRow color="#700038" text="Very good connection quality"/>
                <LegendRow color="#9966FF" text="Good connection quality"/>
                <LegendRow color="#00B000" text="Medium connection quality"/>
                <LegendRow color="#B3FF40" text="Bad connection quality"/>
            </div>
        </Card>
  );
}

function InfoBox() {
  return (
        <p id="ptInfo">
            This map visually represents the quality of public transport connections throughout Switzerland.
            It displays data on train, bus, and tram connectivity and coverage.
            Key transport hubs are emphasized, and areas with less frequent or reliable service are identified.
            It offes a clear overview of the Swiss public transport network's quality and accessibility.
            <br/><br/>
            <InfoTwoToneIcon />   Click on a Stop to display the next departures
        </p>
  );
}

function Title() {
  return (
        <h2 id="transitTitle">
            Connection quality of <div className="highlightedText">public transport</div> in Switzerland
        </h2>
  );
}

const Rectangle: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div id="rectangle" style={{
      width: "20px",
      height: "15px",
      background: color,
    }}>
    </div>
  );
};

const LegendRow: React.FC<{ color: string, text: string }> = ({ color, text }) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      gap: "1rem",
      alignItems: "center",
      height: "30px",
    }}>
      <Rectangle color={color}/>
      <Typography>{text}</Typography>
    </div>
  );
};
