import proj4 from "proj4";

import { WGS84, LV95 } from "../utils/constants";

proj4.defs("EPSG:2056", LV95);

const getPopupPopulationDensity = async (lat: number, lng: number) => {
  const [x, y] = proj4(WGS84, LV95, [lat, lng]);
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
    "," + y + "&lang=en&tolerance=1&sr=2056";
  const response2 = await fetch(url);
  const data2 = await response2.text();
  return data2 ?? "";
};

const getPopupPublicTransportStop = async (lat: number, lng: number) => {
  const [x, y] = proj4(WGS84, LV95, [lng, lat]);
  const url_ident = "https://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry=" + x + "," + y + "&imageDisplay=400,400,96&mapExtent=" + (x - 4000) + "," + (y - 4000) + "," + (x + 4000) + "," + (y + 4000) + "&geometryFormat=geojson&geometryType=esriGeometryPoint&lang=en&layers=all:ch.bav.haltestellen-oev&limit=10&returnGeometry=true&sr=2056&timeInstant=2021&tolerance=10";
  const response = await fetch(url_ident);
  const data = await response.json();
  const id = data.results[0]?.id;
  if (id == null) return "";
  const url = "https://api3.geo.admin.ch/rest/services/ech/MapServer/ch.bav.haltestellen-oev/" + id + "/htmlPopup?coord=" + x + "," + y + "&lang=en&tolerance=0&sr=2056";

  const response2 = await fetch(url);
  const data2 = await response2.text();
  return data2;
};

const isPtStopNearby = async (lat: number, lng: number) => {
  // Check if there is a PT stop nearby (snapping)
  const [x, y] = proj4(WGS84, LV95, [lng, lat]);

  const url_ident = "https://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry=" + x + "," + y + "&imageDisplay=400,400,96&mapExtent=" + (x - 4000) + "," + (y - 4000) + "," + (x + 4000) + "," + (y + 4000) + "&geometryFormat=geojson&geometryType=esriGeometryPoint&lang=en&layers=all:ch.bav.haltestellen-oev&limit=10&returnGeometry=true&sr=2056&timeInstant=2021&tolerance=7";
  const response = await fetch(url_ident);
  const data = await response.json();
  let coords;
  if (data.results[0]) {
    coords = proj4(LV95, WGS84, data.results[0].geometry?.coordinates[0]) as number[];
  }
  else {
    coords = [lng, lat];
  }
  return coords;
};

export { getPopupPopulationDensity, getPopupPublicTransportStop, isPtStopNearby };
