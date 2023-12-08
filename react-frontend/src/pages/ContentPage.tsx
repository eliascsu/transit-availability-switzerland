import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import { Button, Checkbox, Form, Layout, Row } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

import { MapContainer, TileLayer, useMapEvents} from 'react-leaflet'
import L, { HeatLatLngTuple } from "leaflet";
import "leaflet.heat";
import 'leaflet/dist/leaflet.css';

import { useLayerContext } from './LayerContext';
import FormComponent from './components/FormComponent';
import { Legend } from './components/legend';
import { postAndGetPoints, getPopulationDensity, getPTData, getScoreUserPtLine, getPopulationUnserved } from '../router/resources/data';
import type { Feature, LayerVisibility, Line, PopulationArray } from '../types/data';
import { getLineColor, createDefaultPtStop, createHeatMap } from './utils/utils';
import { makePTCirclesFromData } from './utils/qual_layers';
import { Score } from './components/Score';

import './pages.css';

const {Content, Footer} = Layout;

function ContentPage() {

    return (
        <Layout className="layout" id="contentPage">
            <Content className="content" id="mapContent">
                <Row id="titelPage">
                    <h1 id="contentTitel">Zürich</h1>
                </Row>
                <Row id="mapPage">
                    <h1 id="mapHeader">Content Page</h1>
                    <MapWrapper/>
                    <Legend/>
                    <CheckBoxes/>
                    <PointControlBox/>
                    <Link to="/">
                        <Button>Back to home (TEMP)</Button>
                    </Link>
                </Row>
                
            </Content>
            <Footer className="footer" id="mapFooter">
                <span id="footerText">
                    <h5 id="fortnite">Elias Csuka, Joshua Durrant, Leander Hemmi, Cedric Koller, Mathias Schmid</h5>
                </span>
            </Footer>
        </Layout>
    );
}

const MapWrapper = React.memo(function MapWrapper() {
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
    const geoJsonLayersRef = useRef<L.GeoJSON<any, any>[]>([]);
    const userGeoJsonLayersRef = useRef<L.GeoJSON<any, any>[]>([]);
    const heatMapLayerRef = useRef<L.HeatLayer>();
    const polyLineArrayRef = useRef<L.Polyline[]>([]);
    const [updatePT, setUpdatePT] = useState<boolean>(false); 

    const { 
        visibleLayersState, linesFromFormState, 
        drawingState, userLinesRef, setScore
    } = useLayerContext();

    const map = useMapEvents({
        click: (e) => {
            if(drawingState || true){
                console.log(e)
                let user_lines_geojson = userLinesRef.current;
                if(user_lines_geojson.length === 0){
                    user_lines_geojson.push(
                        {
                            type: "Feature",
                            properties: {
                                Haltestellen_No: "0"
                            } as GeoJSON.GeoJsonProperties,
                            geometry: {
                                type: "LineString",
                                coordinates: [[e.latlng.lng, e.latlng.lat]]
                            } as GeoJSON.Geometry
                        } as GeoJSON.Feature
                    )
                }
                let last_line_geojson2 = user_lines_geojson[user_lines_geojson.length - 1];
                (last_line_geojson2.geometry as GeoJSON.LineString).coordinates.push([e.latlng.lng, e.latlng.lat]);
                user_lines_geojson[user_lines_geojson.length - 1] = last_line_geojson2;
                userLinesRef.current = user_lines_geojson;

                L.geoJSON(userLinesRef.current,
                    {
                        style: {
                            color: "red",
                            weight: 2,
                            opacity: 1,
                        }
                    }
                ).addTo(map);
                

                let newPoint = createDefaultPtStop(e.latlng.lat, e.latlng.lng);
                makePoint(newPoint, true);
            }
        },
        zoomend: () => {
            const currentZoom = map.getZoom();
            if (currentZoom < 12) {
                geoJsonLayersRef.current[4] && map.removeLayer(geoJsonLayersRef.current[4]);
            } else {
                geoJsonLayersRef.current[4] && map.addLayer(geoJsonLayersRef.current[4]);
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
                    for(let line of polyLineArrayRef.current){
                        line.bringToFront();
                    } 
                }
            });
            getScoreUserPtLine().then((data: any) => {
                //console.log(data);
                setScore(data?.population_served);
            });
    }, [updatePT, userLinesRef])
    
    useEffect(() => {
        getPopulationDensity()
        .then(popArray => {
            let heatArray: HeatLatLngTuple[] = [];
            if(popArray != undefined && visibleLayersState.popLayer){
                heatArray = createHeatMap(popArray);
                heatMapLayerRef.current = L.heatLayer(heatArray, {radius: 15, max: 10});
                heatMapLayerRef.current.addTo(map);
            }
            else {
                heatMapLayerRef.current?.removeFrom(map);
            }
        });
    }, [visibleLayersState.popLayer]);
    
    useEffect(() => {
        getPopulationUnserved().then(pop => {
            if (pop != undefined && visibleLayersState.popUnservedLayer) {
                let heatArray = createHeatMap(pop);
                heatMapLayerRef.current = L.heatLayer(heatArray, {radius: 15, max: 10});
                heatMapLayerRef.current.addTo(map);
            }
            else {
                heatMapLayerRef.current?.removeFrom(map);
            }
        })},
        [visibleLayersState.popUnservedLayer]);

    useEffect(() => {

        getPTData()
            .then(data => {
                if(data != undefined && visibleLayersState.transportLayer){
                    console.log("data being rendered: " + data);
                    geoJsonLayersRef.current = makePTCirclesFromData(data, makePoint);
        
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
                
                let textbox;
                
            }); 
             
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

function CheckBoxes() {
    const { 
        visibleLayersState, setVisibleLayersState,
        checkboxValues, setCheckboxValues,
        linesFromFormState, setLinesFromFormState,
        drawingState, setDrawingState
    } = useLayerContext();

    const CheckboxGroup = Checkbox.Group;
    const options = ['PublicTransport', 'PopulationDensity', 'PopulationUnserved'];
    const layers: LayerVisibility = {popLayer:false, transportLayer:false, popUnservedLayer:false}

    const publicTransport = (element: CheckboxValueType) => element == 'PublicTransport';
    const populationDensity = (element: CheckboxValueType) => element == 'PopulationDensity';
    const populationUnserved = (element: CheckboxValueType) => element == 'PopulationUnserved';

    const onChange = (list: CheckboxValueType[]) => {
        setCheckboxValues(list);
        if (list.some(publicTransport)) {
            layers.transportLayer = true;
        } else {
            layers.transportLayer = false;
        }
        if (list.some(populationDensity)) {
            layers.popLayer = true;
        } else {
            layers.popLayer = false;
        }
        if (list.some(populationUnserved)) {
            layers.popUnservedLayer = true;
        } else {
            layers.popUnservedLayer = false;
        }
        setVisibleLayersState(layers);
        console.log(layers);
  };

    return (
        <div id="checkBoxes">
          <Score/>
          <CheckboxGroup options={options} value={checkboxValues} onChange={onChange}/>
        </div>
      );
}

function PointControlBox() {
    const { 
        visibleLayersState, setVisibleLayersState,
        checkboxValues, setCheckboxValues,
        linesFromFormState, setLinesFromFormState,
        drawingState, setDrawingState,
    } = useLayerContext();
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Success:', values);
        let newLine: Line = {
            intervall: values.interval,
            typ: values.transportType
        }

        setLinesFromFormState([...linesFromFormState, newLine]);
        form.resetFields(); // Reset form fields after the operation
    };

    const onCollapse = (key: string | string[]) => {
        console.log('Collapse state changed:', key);
        setDrawingState(key.length == 1);
    }

    useEffect(() => {
        return(console.log("unmounting"))
    }, [])

    return (
        <FormComponent form={form} onFinish={onFinish} onCollapse={onCollapse}></FormComponent>
    );
}

export default ContentPage;