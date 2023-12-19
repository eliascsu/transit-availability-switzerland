import React, { useEffect, useState, useRef } from 'react';

import { MapContainer, TileLayer, useMapEvents} from 'react-leaflet'
import L from "leaflet";
import "leaflet.heat";
import 'leaflet/dist/leaflet.css';

import { useLayerContext } from '../ctx/LayerContext';
import { postAndGetPoints, getPopulationDensity, getPTData, getScoreUserPtLine, getPopulationUnserved } from '../../router/resources/data';
import type { Feature } from '../../types/data';
import { getLineColor, createHeatMap } from '../utils/utils';
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
        <MapContainer className="map-container" id="map-zurich" center={[47.36, 8.53]} zoom={10} scrollWheelZoom={true} zoomSnap={0.5}>
            <TileLayer maxZoom={100} url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=119ad4f25bed4ec2a70aeba31a0fb12a" attribution="&copy; <a href=&quot;https://www.thunderforest.com/&quot;>Thunderforest</a> contributors"/>
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
                geoJsonCache.current = makePTCirclesFromData(data);
            }
        })
    }, [])

    // Currently active layers
    const geoJsonLayersRef = useRef<L.GeoJSON<any, any>[]>([]);
    const userGeoJsonLayersRef = useRef<L.GeoJSON<any, any>[]>([]);
    const heatMapLayerRef = useRef<L.HeatLayer>();
    const unservedHeatmapRef = useRef<L.HeatLayer>();

    // Trigger update of PT layers
    const [updatePT, setUpdatePT] = useState<number>(0);

    // Keep track of pt layers over zoom states
    const pt_stops_layer = useRef<L.TileLayer.WMS>()
    pt_stops_layer.current = L.tileLayer.wms("https://wms.geo.admin.ch/", {
        layers: "ch.bav.haltestellen-oev", transparent: true, format: "image/png", minZoom: 14, maxZoom: 20})

    const firstMount = useRef<boolean>(true);

    const {
        visibleLayersState, linesFromFormState,
        drawingState, userLinesRef, setScore
    } = useLayerContext();

    const map = useMapEvents({
        click: (e) => {
            console.log(linesFromFormState);
            if(drawingState || true){
                for (let line of userLinesRef.current) {
                    L.geoJSON(line).removeFrom(map)
                }
                // On click add point to currently active line and redraw
                let user_lines_geojson = userLinesRef.current;
                userLinesRef.current = addPointToLine(user_lines_geojson, e.latlng);

                // Redraw user lines
                for (let feat of userLinesRef.current) {
                    L.geoJSON(feat, {
                        style: {
                            color: getLineColor(feat.properties?.lineType),
                            opacity: 1
                        }
                    }).addTo(map)
                }

                // Redraw pt quality layers
                setUpdatePT(updatePT+1);
            }
        }
    });

    useEffect(() => {
        pt_stops_layer.current?.addTo(map);
    },[])

    useEffect(() => {
        
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
            unservedHeatmapRef.current = populationUnservedHeatMapCache.current
            unservedHeatmapRef.current?.addTo(map)
        }
        else {
            unservedHeatmapRef.current?.removeFrom(map);
        }
    }, [visibleLayersState.popUnservedLayer]);

    useEffect(() => {
        if(visibleLayersState.transportLayer){
            geoJsonLayersRef.current = geoJsonCache.current;

            geoJsonLayersRef.current[0].addTo(map);
            geoJsonLayersRef.current[1].addTo(map);
            geoJsonLayersRef.current[2].addTo(map);
            geoJsonLayersRef.current[3].addTo(map);
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
        //Adding points for traffic stops
        //TODO HST KAT CALULATION

        for (let line of userLinesRef.current) {
            L.geoJSON(line).removeFrom(map)
        }
        // First set the type and interval for the new line
        let lineInfo = linesFromFormState[linesFromFormState.length - 1];
        let lastFeature = userLinesRef.current[userLinesRef.current.length - 1];
        if (lastFeature != undefined && linesFromFormState.length > 0) {
            let typ = lineInfo.typ;
            let interval = lineInfo.intervall;
            let kat;
            if((interval==3.5 && typ=="S_Bahn") || (interval==7 && (typ=="Bus" || typ=="Tram"))){
                kat = 1;
            }
            if((interval==3.5 && (typ=="Bus" || typ=="Tram")) || (interval==7 && typ=="S_Bahn")){
                kat = 2;
            }
            if((interval==7 && (typ=="Bus" || typ=="Tram")) || interval==15 && typ=="S_Bahn"){
                kat = 3;
            }
            if((interval==15 && (typ=="Bus" || typ=="Tram")) || (interval==30 && typ=="S_Bahn")){
                kat = 4;
            }
            if((interval==30 && (typ=="Bus" || typ=="Tram")) || interval==60){
                kat = 5;
            }

            let newLastFeature = {
                "type": "Feature",
                "geometry": lastFeature.geometry,
                "properties": {
                    lineType: lineInfo.typ,
                    interval: lineInfo.intervall,
                    Hst_kat: kat
                }
            } as GeoJSON.Feature
            userLinesRef.current[userLinesRef.current.length - 1] = newLastFeature
        }
        if(userLinesRef.current != undefined && visibleLayersState.transportLayer){
            let data: GeoJSON.Feature[] = userLinesRef.current;
            userGeoJsonLayersRef.current = makePTCirclesFromData(data);
            map.eachLayer((layer) => {
                if(geoJsonLayersRef.current.some((curr) => layer == curr)){
                    map.removeLayer(layer);
                };
            });

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
                    lineType: "pending",
                    interval: -1
                }
            }
        );
        postAndGetPoints(userLinesRef.current)
            .then(userGeoJson => {
                if(userGeoJson != undefined){
                    userLinesRef.current = userGeoJson;
                }
            }).then(() => {
        getScoreUserPtLine().then((data: any) => {
            setScore(data?.population_served);
        });})

    }, [linesFromFormState, visibleLayersState.transportLayer]);

    return null;
});
