import L from "leaflet";
import { classColors } from "./colors";

const BASE_MARKER_OPTIONS = Object.freeze({
  stroke: false,
  opacity: 1,
  fillOpacity: 1,
});

// Optimize layer configuration with pre-computed maps for faster lookups
const QUALITY_LAYER_CONFIG = {
  A: { color: classColors.ClassA, categoryMap: new Set([1, 2]), radiusMap: new Map([[1, 500], [2, 300]]) },
  B: { color: classColors.ClassB, categoryMap: new Set([1, 2, 3]), radiusMap: new Map([[1, 750], [2, 500], [3, 300]]) },
  C: { color: classColors.ClassC, categoryMap: new Set([1, 2, 3, 4]), radiusMap: new Map([[1, 1000], [2, 750], [3, 500], [4, 300]]) },
  D: { color: classColors.ClassD, categoryMap: new Set([2, 3, 4, 5]), radiusMap: new Map([[2, 1000], [3, 750], [4, 500], [5, 300]]) },
} as const;

type LayerType = keyof typeof QUALITY_LAYER_CONFIG;

// Cache for circle creation
const circleCache = new Map<string, L.Circle>();

/**
 * Creates a circle with memoization to reuse identical circles
 */
function createCircle(latlng: L.LatLng, color: string, radius: number): L.Circle {
  const key = `${latlng.lng},${color},${radius}`;
  let circle = circleCache.get(key);

  if (!circle) {
    circle = L.circle(latlng, {
      ...BASE_MARKER_OPTIONS,
      color,
      radius,
    });
    circleCache.set(key, circle);
  }

  return circle;
}

/**
 * Create a quality layer based on the given data and layer type
 * @param data GeoJSON data
 * @param layerType Either 'A', 'B', 'C' or 'D'
 * @returns Quality layer as L.geoJSON
 */
/**
 * Create a quality layer based on the given data and layer type
 */
function createQualityLayer(data: GeoJSON.Feature[], layerType: LayerType): L.GeoJSON {
  const config = QUALITY_LAYER_CONFIG[layerType];

  return L.geoJSON(data, {
    filter: (feature) => {
      const kat = feature.properties.Hst_Kat;
      return config.categoryMap.has(kat) && feature.properties.Haltestellen_No !== "false";
    },
    pointToLayer: (feature, latlng) => {
      const kat = feature.properties.Hst_Kat;
      const radius = config.radiusMap.get(kat) ?? 20;
      return createCircle(latlng, config.color, radius);
    },
  });
}

/**
 * Create a quality layer for LineString features
 */
function createQualityLayerLineString(data: any, layerType: LayerType): L.GeoJSON {
  const config = QUALITY_LAYER_CONFIG[layerType];
  const layer = L.geoJSON();

  // Process features in batch for better performance
  const circles: L.Circle[] = [];

  for (const feature of data) {
    const kat = feature.properties?.Hst_kat;
    const radius = config.radiusMap.get(kat) ?? 20;

    // Process all coordinates for this feature
    if (feature.geometry.coordinates) {
      for (const [lng, lat] of feature.geometry.coordinates) {
        const latlng = L.latLng(lat, lng);
        circles.push(createCircle(latlng, config.color, radius));
      }
    }
  }

  // Batch add all circles to the layer
  circles.forEach(circle => circle.addTo(layer));

  return layer;
}

/**
 * Create a quality layer
 * @param data GeoJSON data
 * @param makePoint Function to create a new PT stop
 * @returns Quality layer as L.geoJSON
 */

function makePTCirclesFromData(data: GeoJSON.Feature[]): L.GeoJSON[] {
  if (!data.length) {
    return [];
  }

  const layerTypes: LayerType[] = ["D", "C", "B", "A"];
  const createLayerFn = data[0] !== undefined ? createQualityLayer : createQualityLayerLineString;

  return layerTypes.map(type => createLayerFn(data, type));
}

// Clear circle cache when needed
function clearCircleCache(): void {
  circleCache.clear();
}

export { createQualityLayer, createQualityLayerLineString, makePTCirclesFromData, clearCircleCache };
