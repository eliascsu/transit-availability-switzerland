import React, { useEffect, useState, useRef, createContext, useContext } from 'react';

import { Checkbox, Form, Layout, Row } from 'antd';

import { MapContainer, TileLayer, useMapEvents} from 'react-leaflet'
import L, { HeatLatLngTuple, LatLngTuple } from "leaflet";
import "leaflet.heat";

import 'leaflet/dist/leaflet.css';
import './pages.css';

import FormComponent from './components/FormComponent';
import { Legend } from './components/legend';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { postAndGetPoints, getPopulationDensity, getPTData } from '../router/resources/data';
import type { FeatureCollection, Feature, GeoJsonObject, LayerVisibility, Line, LineIndexLookup } from '../types/data';
import { getLineColor, createDefaultPtStop } from './utils/utils';
import { createQualityLayer, qualityLayerInfo } from './utils/qual_layers';

const {Content, Footer} = Layout;


interface LayerContextType {
    visibleLayersState: LayerVisibility;
    setVisibleLayersState: React.Dispatch<React.SetStateAction<LayerVisibility>>;
    checkboxValues: CheckboxValueType[];
    setCheckboxValues: React.Dispatch<React.SetStateAction<CheckboxValueType[]>>;
    linesFromFormState: Line[];
    setLinesFromFormState: React.Dispatch<React.SetStateAction<Line[]>>;
    drawingState: boolean;
    setDrawingState: React.Dispatch<React.SetStateAction<boolean>>;
    userLinesRef: React.MutableRefObject<GeoJSON.LineString[]>;
}

const LayerContext = createContext<LayerContextType | undefined>(undefined);

export const useLayerContext = () => {
    const context = useContext(LayerContext);
    if (!context) {
        throw new Error('useLayerContext must be used within a LayerProvider');
    }
    return context;
};

export const LayerProvider: React.FC = ({ children }) => {
    const [visibleLayersState, setVisibleLayersState] = useState<LayerVisibility>({ popLayer: false, transportLayer: false });
    const [checkboxValues, setCheckboxValues] = useState<CheckboxValueType[]>([]);
    const [linesFromFormState, setLinesFromFormState] = useState<Line[]>([]);
    const [drawingState, setDrawingState] = useState<boolean>(false);
    const userLinesRef = useRef<GeoJSON.LineString[]>([]);

    const value = {
        visibleLayersState,
        setVisibleLayersState,
        checkboxValues,
        setCheckboxValues,
        linesFromFormState,
        setLinesFromFormState,
        drawingState,
        setDrawingState,
        userLinesRef
    };

    return (
        <LayerContext.Provider value={value}>
            {children}
        </LayerContext.Provider>
    );
};

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
                    <CheckBoxes></CheckBoxes>
                    <PointControlBox></PointControlBox>
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
    const lineIndexLookupRef = useRef<LineIndexLookup>({numLines: 0, numPointsPerLine: [0], lineTypes: []});
    const [addedPointsState, setAddedPointsState] = useState<FeatureCollection>({type: "FeatureCollection", features: []});
    const addedPointsGeoJsonRef = useRef<GeoJsonObject>();
    const geoJsonLayersRef = useRef<L.GeoJSON<any, any>[]>([]);
    const userGeoJsonLayersRef = useRef<L.GeoJSON<any, any>[]>([]);
    const heatMapLayerRef = useRef<L.HeatLayer>();
    const polyLineArrayRef = useRef<L.Polyline[]>([]);

    const score = useRef<number>();

    const { 
        visibleLayersState, setVisibleLayersState,
        checkboxValues, setCheckboxValues,
        linesFromFormState, setLinesFromFormState,
        drawingState, setDrawingState,
        userLinesRef
    } = useLayerContext();


    const map = useMapEvents({
        click: (e) => {
            if(drawingState || true){
                
                let user_lines_geojson = userLinesRef.current;
                if(user_lines_geojson.length == 0){
                    user_lines_geojson.push({
                        type: "LineString",
                        coordinates: [[e.latlng.lng, e.latlng.lat]],
                    });
                }
                let last_line_geojson = user_lines_geojson[user_lines_geojson.length - 1];
                console.log(last_line_geojson);
                last_line_geojson.coordinates.push([e.latlng.lng, e.latlng.lat]);
                user_lines_geojson[user_lines_geojson.length - 1] = last_line_geojson;
                console.log(user_lines_geojson)
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
            /*
            getScore().then((data: any) => {
                //console.log(data);
                score.current = data?.population_served;
            });
            //console.log("score: " + score.current);
            let text = document.getElementById("info_text");
            if(text){
                text.innerHTML = "<h2>" + score.current + "</h2>";
            }
            */
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
        console.log("STATECHANGE");
        postAndGetPoints(addedPointsState)
            .then(userGeoJson => {
                if(userGeoJson != undefined){
                    addedPointsGeoJsonRef.current = userGeoJson as GeoJsonObject;
                }
            })
            .then( () => {
                if(addedPointsGeoJsonRef.current != undefined && visibleLayersState.transportLayer){
                    let data: GeoJsonObject = addedPointsGeoJsonRef.current;
                    userGeoJsonLayersRef.current = makePTCirclesFromData(data);   
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
    }, [addedPointsState])
    

    useEffect(() => {
        /*
        console.log("adding geojson layer");
        let gjson = fetch("myAgency.geojson").then(res => res.json()).then(data => {
            console.log("length of data: " + data.features.length);
            let layer = L.geoJSON(data);
            layer.addTo(map);
        });
        console.log("done rendering points")
        */
        getPopulationDensity()
        .then(popArray => {
            let i = 0;
            let heatArray: HeatLatLngTuple[] = [];
            let pops = []
            if(popArray != undefined && visibleLayersState.popLayer){
                for(let row of popArray){
                    if(row.lat && i++<1000000){
                        heatArray.push([parseFloat(row.lat), parseFloat(row.lng), parseFloat(row.intensity)] as HeatLatLngTuple);
                        //console.log(row.intensity);
                        pops.push(row.intensity);
                    }
                }     
                heatMapLayerRef.current = L.heatLayer(heatArray, {radius: 15, max: 10});
                heatMapLayerRef.current.addTo(map);
            }
            else{
                heatMapLayerRef.current?.removeFrom(map);
            }
        });
        
                
    }, [visibleLayersState.popLayer]);

    useEffect(() => {
        
        getPTData()
            .then(data => {
                if(data != undefined && visibleLayersState.transportLayer){
                    console.log("data being rendered: " + data);
                    geoJsonLayersRef.current = makePTCirclesFromData(data as GeoJsonObject);
        
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

    useEffect(() => {
        console.log(linesFromFormState);
        if(linesFromFormState[linesFromFormState.length-1] != undefined){
            let newLookup: LineIndexLookup = {
                numLines: lineIndexLookupRef.current.numLines + 1,
                numPointsPerLine: (lineIndexLookupRef.current.numPointsPerLine),
                lineTypes: [...lineIndexLookupRef.current.lineTypes, linesFromFormState[linesFromFormState.length-1].typ]
            }
            newLookup.numPointsPerLine.push(0);
            lineIndexLookupRef.current = newLookup;
        }
        console.log(lineIndexLookupRef);

        let polyLineCoordsArray: LatLngTuple[][] = []
        for(let i = 0; i < lineIndexLookupRef.current.numLines; i++){
            polyLineCoordsArray.push([]);
        }
        let currentLine = 0;
        let pointer = 0;
        for(let numPoints of lineIndexLookupRef.current.numPointsPerLine){
            for(let pointIndex = 0; pointIndex < numPoints; pointIndex++){
                let point = (addedPointsGeoJsonRef.current as FeatureCollection).features[pointIndex + pointer];
                polyLineCoordsArray[currentLine].push([point["geometry"]["coordinates"][1] as number, point["geometry"]["coordinates"][0] as number] as LatLngTuple)
            }
            pointer += numPoints;
            currentLine++;
        }
        //console.log(polyLineCoords);
        map.eachLayer((layer) => {
            if(polyLineArrayRef.current.some((curr) => layer == curr)){
                map.removeLayer(layer);
            }
        });
        
        console.log(polyLineCoordsArray);
        console.log(lineIndexLookupRef.current.numLines);
        for(let line of polyLineArrayRef.current){
            line.removeFrom(map);
        }
        polyLineArrayRef.current = [];
        for(let i = 0; i < lineIndexLookupRef.current.numLines; i++){
            let lineColor = getLineColor(lineIndexLookupRef.current.lineTypes[i]);
            let polyLine = new L.Polyline(polyLineCoordsArray[i], {
                color: lineColor,
                weight: 2,
                opacity: 1,
                smoothFactor: 0
            });
            console.log(polyLine);
            console.log("YIPPIIEEE")
            polyLineArrayRef.current.push(polyLine);
        }
        console.log(polyLineArrayRef.current);
        for(let line of polyLineArrayRef.current){
            line.addTo(map);
            line.bringToFront();
        }        
        console.log("added userpoints");
    }, [linesFromFormState]);

    function makePTCirclesFromData(data: GeoJsonObject){
        let layers: L.GeoJSON<any, any>[] = [];
        let geoJsonLayerA = createQualityLayer(data, "A")
        let geoJsonLayerB = createQualityLayer(data, "B")
        let geoJsonLayerC = createQualityLayer(data, "C")
        let geoJsonLayerD = createQualityLayer(data, "D")

        let geoJsonInfoLayer = qualityLayerInfo(data, makePoint);

        layers.push(geoJsonLayerD);
        layers.push(geoJsonLayerC);
        layers.push(geoJsonLayerB);
        layers.push(geoJsonLayerA);
        layers.push(geoJsonInfoLayer);
        return layers;        
    }
    function makePoint(point: Feature, visible: boolean){
        lineIndexLookupRef.current.numPointsPerLine[lineIndexLookupRef.current.numPointsPerLine.length - 1]++;
        let hst_No: string = visible.valueOf().toString();
        point.properties.Haltestellen_No = hst_No;
        setAddedPointsState(prevState => ({
            ...prevState,
            features: [...prevState.features, point]
        }))
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
    const options = ['PublicTransport', 'PopulationDensity'];
    const layers: LayerVisibility = {popLayer:false, transportLayer:false}

    const publicTransport = (element: CheckboxValueType) => element == 'PublicTransport';
    const populationDensity = (element: CheckboxValueType) => element == 'PopulationDensity';

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
        setVisibleLayersState(layers);
        console.log(layers);
  };

    return (
        <div id="checkBoxes">
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
        userLinesRef
    } = useLayerContext();
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Success:', values);
        let newLine: Line = {
            intervall: values.interval,
            typ: values.transportType
        }
    
        userLinesRef.current.push(
            {
                type: "LineString",
                coordinates: []
            }
        );
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
