import React from "react";

import { TileLayer, WMSTileLayer, useMap, useMapEvents } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import L, { LatLng, LatLngTuple } from "leaflet";

import proj4 from "proj4";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";

const wgs84 = "EPSG:4326";
const lv95 = "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs";

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
          const [x, y] = proj4(wgs84, lv95, [e.latlng.lng, e.latlng.lat]);
          const url_ident = "https://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry=" + x + "," + y + "&imageDisplay=400,400,96&mapExtent=" + (x - 4000) + "," + (y - 4000) + "," + (x + 4000) + "," + (y + 4000) + "&geometryFormat=geojson&geometryType=esriGeometryPoint&lang=en&layers=all:ch.bav.haltestellen-oev&limit=10&returnGeometry=true&sr=2056&timeInstant=2021&tolerance=10";
          const response = await fetch(url_ident);
          const data = await response.json();
          const id = data.results[0]?.id;
          if (id == null) return;
          const url = "https://api3.geo.admin.ch/rest/services/ech/MapServer/ch.bav.haltestellen-oev/" + id + "/htmlPopup?coord=" + x + "," + y + "&lang=en&tolerance=0&sr=2056";

          const response2 = await fetch(url);
          const data2 = await response2.text();
          infoPtStop.current = data2;
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
        <div className="legend">
            <h4 id="legendTitle">Connection quality:</h4>
            <div style={{ listStyleType: "none" }} id="legendList">
                <div className="listElement">
                    <div id="rectangle" style={{
                      width: "20px",
                      height:"15px",
                      background:"#700038",
                    }}>
                    </div><p>Very good connection quality</p>
                </div>
                <div className="listElement">
                    <div id="rectangle" style={{
                      width: "20px",
                      height:"15px",
                      background:"#9966FF",
                    }}>
                    </div><p>Good connection quality</p>
                </div>
                <div className="listElement">
                    <div id="rectangle" style={{
                      width: "20px",
                      height:"15px",
                      background:"#00B000",
                    }}>
                    </div><p>Medium connection quality</p>
                </div>
                <div className="listElement">
                    <div id="rectangle" style={{
                      width: "20px",
                      height:"15px",
                      background:"#B3FF40",
                    }}>
                    </div><p>Bad connection quality</p>
                </div>
            </div>
        </div>
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
