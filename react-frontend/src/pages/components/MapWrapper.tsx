import React, { useEffect, useState, useRef } from 'react';

import { MapContainer, TileLayer, useMapEvents} from 'react-leaflet'
import L from "leaflet";
import "leaflet.heat";
import 'leaflet/dist/leaflet.css';

import { useLayerContext } from '../ctx/LayerContext';
import { postAndGetPoints, getPopulationDensity, getPTData, getScoreUserPtLine, getPopulationUnserved } from '../../router/resources/data';
import type { Feature } from '../../types/data';
import { getLineColor, createDefaultPtStop, createHeatMap } from '../utils/utils';
import { makePTCirclesFromData } from '../utils/qual_layers';
import { addPointToLine } from '../utils/utils';

import '../pages.css';

const defaultLineStyle = {
    color: "red",
    weight: 2,
    opacity: 1,
}

export const MapWrapper = React.memo(function MapWrapper() {
    return (
        <MapContainer className="map-container" id="map-zurich" center={[47.36, 8.53]} zoom={10} scrollWheelZoom={true}>
            <TileLayer url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=119ad4f25bed4ec2a70aeba31a0fb12a" attribution="&copy; <a href=&quot;https://www.thunderforest.com/&quot;>Thunderforest</a> contributors"/>
            <TileLayer url="https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"></TileLayer>
            <Map></Map>
        </MapContainer>
    );
})


const Map = React.memo(function Map() {
    //const map = useMap();
    const geoJsonCache = useRef<L.GeoJSON<any, any>[]>([]);
    const populationHeatMapCache = useRef<L.HeatLayer>();
    const populationUnservedHeatMapCache = useRef<L.HeatLayer>();

    // Populate caches
    useEffect(() => {
        getPopulationDensity().then(popArray => {
            if(popArray != undefined){
                let heatArray = createHeatMap(popArray);
                populationHeatMapCache.current = L.heatLayer(heatArray, {radius: 15, max: 10});
            }
        });
        getPopulationUnserved().then(popArray => {
            if(popArray != undefined){
                let heatArray = createHeatMap(popArray);
                populationUnservedHeatMapCache.current = L.heatLayer(heatArray, {radius: 15, max: 10});
            }
        })
        getPTData().then(data => {
            if(data != undefined){
                geoJsonCache.current = makePTCirclesFromData(data, makePoint);
            }
        })
    }, [])

    const geoJsonLayersRef = useRef<L.GeoJSON<any, any>[]>([]);
    const userGeoJsonLayersRef = useRef<L.GeoJSON<any, any>[]>([]);
    const heatMapLayerRef = useRef<L.HeatLayer>();
    const [updatePT, setUpdatePT] = useState<boolean>(false);
    const pt_stops_layer = useRef<any>(null)

    const {
        visibleLayersState, linesFromFormState,
        drawingState, userLinesRef, setScore
    } = useLayerContext();

    const map = useMapEvents({
        click: (e) => {
            if(drawingState || true){
                console.log(e)
                let user_lines_geojson = userLinesRef.current;
                user_lines_geojson = addPointToLine(user_lines_geojson, e.latlng);
                userLinesRef.current = user_lines_geojson;

                L.geoJSON(userLinesRef.current, {style: defaultLineStyle}).addTo(map);

                let newPoint = createDefaultPtStop(e.latlng.lng, e.latlng.lat);
                makePoint(newPoint, true);
            }
        },
        zoomend: () => {
            const currentZoom = map.getZoom();
            console.log(currentZoom)
            if (currentZoom < 14) {
                console.log(pt_stops_layer.current)
                pt_stops_layer.current?.remove()

                console.log("removing pt stops")
            } else {
                console.log("adding pt stops")
                pt_stops_layer.current = L.tileLayer.wms("https://wms.geo.admin.ch/", {
                    layers: "ch.bav.haltestellen-oev", transparent: true, format: "image/png",  })
                console.log(pt_stops_layer.current)
                pt_stops_layer.current?.addTo(map)
                pt_stops_layer.current?.bringToFront()
            }
        }
    });

    useEffect(() => {
        setUpdatePT(false)
        console.log("STATECHANGE");
        postAndGetPoints(userLinesRef.current)
            .then(userGeoJson => {
                if(userGeoJson != undefined){
                    userLinesRef.current = userGeoJson;
                }
            })
            .then( () => {
                if(userLinesRef.current != undefined && visibleLayersState.transportLayer){
                    let data: GeoJSON.Feature[] = userLinesRef.current;
                    userGeoJsonLayersRef.current = makePTCirclesFromData(data, makePoint);
                    const currentZoom = map.getZoom();
                    map.eachLayer((layer) => {
                        if(geoJsonLayersRef.current.some((curr) => layer == curr)){
                            map.removeLayer(layer);
                        };
                    });

                    userGeoJsonLayersRef.current[0].addTo(geoJsonLayersRef.current[0]);
                    userGeoJsonLayersRef.current[1].addTo(geoJsonLayersRef.current[1]);
                    userGeoJsonLayersRef.current[2].addTo(geoJsonLayersRef.current[2]);
                    userGeoJsonLayersRef.current[3].addTo(geoJsonLayersRef.current[3]);
                    userGeoJsonLayersRef.current[4].addTo(geoJsonLayersRef.current[4]);

                    map.addLayer(geoJsonLayersRef.current[0]);
                    map.addLayer(geoJsonLayersRef.current[1]);
                    map.addLayer(geoJsonLayersRef.current[2]);
                    map.addLayer(geoJsonLayersRef.current[3]);
                    if((currentZoom >= 12)){
                        map.addLayer(geoJsonLayersRef.current[4]);
                    }
                }
            });
            getScoreUserPtLine().then((data: any) => {
                //console.log(data);
                setScore(data?.population_served);
            });
    }, [updatePT, userLinesRef])

    useEffect(() => {
        if (visibleLayersState.popLayer){
            heatMapLayerRef.current = populationHeatMapCache.current;
            heatMapLayerRef.current?.addTo(map);
        }
        else {
            heatMapLayerRef.current?.removeFrom(map);
        }
    }, [visibleLayersState.popLayer]);

    useEffect(() => {
        if (visibleLayersState.popUnservedLayer) {
            heatMapLayerRef.current = populationUnservedHeatMapCache.current
            heatMapLayerRef.current?.addTo(map)
        }
        else {
            heatMapLayerRef.current?.removeFrom(map);
        }
    }, [visibleLayersState.popUnservedLayer]);

    useEffect(() => {
        if(visibleLayersState.transportLayer){
            geoJsonLayersRef.current = geoJsonCache.current;

            geoJsonLayersRef.current[0].addTo(map);
            geoJsonLayersRef.current[1].addTo(map);
            geoJsonLayersRef.current[2].addTo(map);
            geoJsonLayersRef.current[3].addTo(map);
            //geoJsonLayersRef.current[4].addTo(map);
        }
        else{
            for(let layer of geoJsonLayersRef.current){
                layer.removeFrom(map);
            }
        }
    }, [visibleLayersState.transportLayer]);

    /**
     * On form submit redraw user lines
     */
    useEffect(() => {
        for (let line of userLinesRef.current) {
            L.geoJSON(line).removeFrom(map)
        }
        // First set the type and interval for the new line
        let lineInfo = linesFromFormState[-1]
        let lastFeature = userLinesRef.current[-1]
        if (lastFeature != undefined) {
            let newLastFeature = {
                "type": "Feature",
                "geometry": lastFeature.geometry,
                "properties": {
                    interval: lineInfo.intervall,
                    lineType: lineInfo.typ
                }
            } as GeoJSON.Feature
            userLinesRef.current[-1] = newLastFeature
        }
        // Rerender geoJSON features on map
        for (let feat of userLinesRef.current) {
            L.geoJSON(feat, {
                style: {
                    color: getLineColor(feat.properties?.lineType)
                }
            }).addTo(map)
        }

        // Push new empty linestring to array
        userLinesRef.current.push(
            {
            "type": "Feature",
            "geometry": {
                type: "LineString",
                coordinates: []
            },
            "properties": {
            }
        }
        );
    }, [linesFromFormState]);

    function makePoint(point: Feature, visible: boolean){
        let hst_No: string = visible.valueOf().toString();
        point.properties.Haltestellen_No = hst_No;
        // Redraw layers
        setUpdatePT(true);
    }
    return null;
});
