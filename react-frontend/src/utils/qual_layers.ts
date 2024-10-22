import L from "leaflet";
import { classColors } from "./colors";

// Configuration of markers
const geojsonMarkerOptions = {
  radius: 20,
  color: "#ff7800",
  stroke: false,
  opacity: 1,
  fillOpacity: 1,
};

// Configuration for each quality layer
const qualityLayerConfig = {
  A: { color: classColors.ClassA, categories: [1, 2], radius: [500, 300] },
  B: { color: classColors.ClassB, categories: [1, 2, 3], radius: [750, 500, 300] },
  C: { color: classColors.ClassC, categories: [1, 2, 3, 4], radius: [1000, 750, 500, 300] },
  D: { color: classColors.ClassD, categories: [2, 3, 4, 5], radius: [1000, 750, 500, 300] },
};

/**
 * Create a quality layer based on the given data and layer type
 * @param data GeoJSON data
 * @param layerType Either 'A', 'B', 'C' or 'D'
 * @returns Quality layer as L.geoJSON
 */
function createQualityLayer(data: GeoJSON.Feature[], layerType: "A" | "B" | "C" | "D") {
  const config = qualityLayerConfig[layerType];
  return L.geoJSON(data, {
    filter(geoJsonFeature) {
      const kat = geoJsonFeature.properties.Hst_Kat;
      return config.categories.includes(kat) && geoJsonFeature.properties.Haltestellen_No != "false";
    },
    pointToLayer: function (geoJsonFeature, latlng) {
      const properties = geoJsonFeature?.properties;
      const radiusIndex = config.categories.indexOf(properties.Hst_Kat);
      const radius = config.radius[radiusIndex] || 20; // Default radius if not found

      geojsonMarkerOptions.color = config.color;
      geojsonMarkerOptions.radius = radius;

      return L.circle(latlng, geojsonMarkerOptions);
    },
  });
}

function createQualityLayerLineString(data: any, layerType: "A" | "B" | "C" | "D") {
  // data should be GeoJson.Feature[] and a linestring
  const config = qualityLayerConfig[layerType];
  const layer: L.GeoJSON = L.geoJSON();
  for (const feature of data) {
    const props = feature.properties;
    const kat = props.Hst_kat;
    for (const coord_pair of feature.geometry.coordinates) {
      const latlng = L.latLng(coord_pair[1], coord_pair[0]);
      const radiusIndex = config.categories.indexOf(kat);
      const radius = config.radius[radiusIndex] || 20; // Default radius if not found

      geojsonMarkerOptions.color = config.color;
      geojsonMarkerOptions.radius = radius;

      const circle = L.circle(latlng, geojsonMarkerOptions);
      circle.addTo(layer);
    }
  }
  return layer;
}
/**
 * Create a quality layer
 * @param data GeoJSON data
 * @param makePoint Function to create a new PT stop
 * @returns Quality layer as L.geoJSON
 */

function makePTCirclesFromData(data: GeoJSON.Feature[]) {
  console.log("makePTCirclesFromData");
  console.log(typeof (data));
  // Working with the default layers
  if (data[0] != undefined) {
    console.log("makePTCirclesFromData: default layers");
    const layers: L.GeoJSON<any, any>[] = [];
    const geoJsonLayerA = createQualityLayer(data, "A");
    const geoJsonLayerB = createQualityLayer(data, "B");
    const geoJsonLayerC = createQualityLayer(data, "C");
    const geoJsonLayerD = createQualityLayer(data, "D");

    layers.push(geoJsonLayerD);
    layers.push(geoJsonLayerC);
    layers.push(geoJsonLayerB);
    layers.push(geoJsonLayerA);
    console.log(layers);
    return layers;
  }
  // Working with the user layers
  else {
    // Types are now linestrings
    const layers: L.GeoJSON<any, any>[] = [];
    const geoJsonLayerA = createQualityLayerLineString(data, "A");
    const geoJsonLayerB = createQualityLayerLineString(data, "B");
    const geoJsonLayerC = createQualityLayerLineString(data, "C");
    const geoJsonLayerD = createQualityLayerLineString(data, "D");

    layers.push(geoJsonLayerD);
    layers.push(geoJsonLayerC);
    layers.push(geoJsonLayerB);
    layers.push(geoJsonLayerA);
    return layers;
  }
}

export { createQualityLayer, createQualityLayerLineString, makePTCirclesFromData };
