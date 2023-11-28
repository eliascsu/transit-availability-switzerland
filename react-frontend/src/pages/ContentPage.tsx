import { MapContainer, TileLayer, useMap, WMSTileLayer } from 'react-leaflet'
import L, { HeatLatLngTuple, LatLng, LatLngTuple, point } from "leaflet";
import 'leaflet/dist/leaflet.css';
import './pages.css';
import { Control } from 'leaflet';
import { useEffect, useState, useRef, createContext, useContext } from 'react';
import "proj4leaflet";
//import Papa from 'papaparse';
import "leaflet.heat";
import {v4 as uuidv4} from 'uuid';
import { Button, Checkbox, Form, Input, Layout, Col, Row, InputNumber } from 'antd';
import { postAndGetPoints, getPopulationDensity, getPTData, getScore } from '../router/resources/data';
import { FeatureCollection, Feature, Geometry, Properties, GeoJsonObject, Score } from '../types/data';
import { features } from 'process';
import { ExtendedGeometryCollection } from 'd3';

const {Content, Footer} = Layout;

interface CsvData {
    lat: string,
    lng: string,
    pop: string
  }
/*
interface UserPoint {
    Haltestellen_No: string;
    Y_Koord: number;
    X_Koord: number;
    Name: string;
    Bahnknoten: number;
    Bahnlinie_Anz: number;
    TramBus_Anz: number;
    Seilbahn_Anz: number;
    A_Intervall: number;
    B_Intervall: number;
    Hst_Kat: number;
}
*/
let defaultName: string = "";
let defaultBahnknoten = 0;
let defaultBahnlinie_Anz = 0;
let defaultTramBus_Anz = 1;
let defaultSeilbahn_Anz = 0;
let defaultA_Intervall = 0;
let defaultB_Intervall = 8;
let defaultHst_Kat = 3;

const classColors = {
    ClassA: "#ff0022",
    ClassB: "#c300ff",
    ClassC: "#006915",
    ClassD: "#40ff66"
}

interface PointBoxOption extends HTMLCollection {
    Name: HTMLInputElement;
    Bahnknoten: HTMLInputElement;
    Bahnlinie_Anz: HTMLInputElement;
    TramBus_Anz: HTMLInputElement;
    Seilbahn_Anz: HTMLInputElement;
    A_Intervall: HTMLInputElement;
    B_Intervall: HTMLInputElement;
}

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

function MapWrapper() {

    return (
        <>
        <MapContainer className="map-container" id="map-zurich" center={[47.36, 8.53]} zoom={10} scrollWheelZoom={true}>
            <TileLayer url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=119ad4f25bed4ec2a70aeba31a0fb12a" attribution="&copy; <a href=&quot;https://www.thunderforest.com/&quot;>Thunderforest</a> contributors"/>
            <Map></Map>
        </MapContainer>
        <PointControlBox></PointControlBox>
        </>
    );
}

const constrolBoxContext = createContext(null);

function Map(){
    const map = useMap();
    const [csvData, setCsvData] = useState<CsvData[]>();
    const [updatePing, setUpdatePing] = useState<number>(0);
    const pointInLineIndex = useRef<number>(0);
    const lineIndex = useRef<number>(0);
    const addedPointsRef = useRef<FeatureCollection>({type: "FeatureCollection", features: []});
    const addedPointsGeoJsonRef = useRef<GeoJsonObject>();
    const geoJsonLayersRef = useRef<L.GeoJSON<any, any>[]>([]);
    const userGeoJsonLayersRef = useRef<L.GeoJSON<any, any>[]>([]);
    const score = useRef<number>();

    useEffect(() => {
        getPopulationDensity()
        .then(popArray => {
            //console.log(popArray);
            let i = 0;
            let heatArray: HeatLatLngTuple[] = [];
            let pops = []
            if(popArray != undefined){
                for(let row of popArray){
                    if(row.lat && i++<1000000){
                        heatArray.push([parseFloat(row.lat), parseFloat(row.lng), parseFloat(row.intensity)] as HeatLatLngTuple);
                        //console.log(row.intensity);
                        pops.push(row.intensity);
                    }
                }
                /*
                pops.sort((a, b) => b - a); // Sort in descending order
                    if (pops.length > 1000) {
                        pops = pops.slice(0, 1000); // Keep only top 10 values
                    }
                console.log(pops);
                */
                //console.log(heatArray);
                
                let heat = L.heatLayer(heatArray, {radius: 15, max: 10}).addTo(map);
            }
        });
        

        getPTData()
            .then(data => {
                if(data != undefined){
                    console.log("data being rendered: " + data);
                    geoJsonLayersRef.current = makePTCirclesFromData(data as GeoJsonObject);
        
                    geoJsonLayersRef.current[0].addTo(map);
                    geoJsonLayersRef.current[1].addTo(map);
                    geoJsonLayersRef.current[2].addTo(map);
                    geoJsonLayersRef.current[3].addTo(map);
                    //geoJsonInfoLayer.addTo(map);
                }
                map.on("click", function(e){
                    let hst_No: string = pointInLineIndex.current.toString() + "-" + lineIndex.current.toString();
                    
                    let newPoint: Feature = {
                        type: "Feature",
                        geometry: {
                            type: 'Point',
                            coordinates: [e.latlng.lng, e.latlng.lat] as LatLngTuple
                        },
                        properties:{
                            Haltestellen_No: hst_No,
                            Name: defaultName,
                            Bahnknoten: defaultBahnknoten,
                            Bahnlinie_Anz: defaultBahnlinie_Anz,
                            TramBus_Anz: defaultTramBus_Anz,
                            Seilbahn_Anz: defaultSeilbahn_Anz,
                            A_Intervall: defaultA_Intervall,
                            B_Intervall: defaultB_Intervall,
                            Hst_Kat: defaultHst_Kat
                        }
                    }
                    pointInLineIndex.current++;
                    addedPointsRef.current.features = [...addedPointsRef.current.features, newPoint];
                    let userAddedPoints: FeatureCollection = addedPointsRef.current;
                    postAndGetPoints(userAddedPoints)
                    .then(userGeoJson => {
                        if(userGeoJson != undefined){
                            addedPointsGeoJsonRef.current = userGeoJson as GeoJsonObject;
                            setUpdatePing(updatePing + 1);
                        }
                    })
                    .then( () => {
                        if(addedPointsGeoJsonRef.current != undefined){
                            let data: GeoJsonObject = addedPointsGeoJsonRef.current;
                            userGeoJsonLayersRef.current = makePTCirclesFromData(data);   
                            map.eachLayer((layer) => {
                                if(geoJsonLayersRef.current.some((curr) => layer == curr)){
                                    map.removeLayer(layer);
                                };
                            }) 
                            
                            userGeoJsonLayersRef.current[0].addTo(geoJsonLayersRef.current[0].addTo(map));
                            userGeoJsonLayersRef.current[1].addTo(geoJsonLayersRef.current[1].addTo(map));
                            userGeoJsonLayersRef.current[2].addTo(geoJsonLayersRef.current[2].addTo(map));
                            userGeoJsonLayersRef.current[3].addTo(geoJsonLayersRef.current[3].addTo(map));
                            
                            let polyLineCoords: LatLng[] = []
                            for(let point of userAddedPoints["features"]){
                                polyLineCoords.push(new L.LatLng(point["geometry"]["coordinates"][1], point["geometry"]["coordinates"][0]))
                            }
                            //console.log(polyLineCoords);
                            let polyLine = new L.Polyline(polyLineCoords, {
                                color: 'red',
                                weight: 5,
                                opacity: 1,
                                smoothFactor: 1
                                }).addTo(map);
                            console.log("added userpoints");
                        }
                    });
                    console.log("onClick: " + addedPointsGeoJsonRef.current)
                    setUpdatePing(updatePing + 1);
                    console.log(updatePing);

                    getScore().then((data: any) => {
                        console.log(data);
                        score.current = data?.population_served;
                    });
                    console.log("score: " + score.current);
                    console.log(score.current);
                    let text = document.getElementById("info_text");
                    if(text){
                        text.innerHTML = "<h2>" + score.current + "</h2>";
                    }
                });
                let textbox;
                getScore().then((data: any) => {
                    console.log(data);
                    score.current = data?.population_served;
                    textbox = L.Control.extend({
                        onAdd: function() {
                            let text = L.DomUtil.create('div');
                            text.id = "info_text";
                            text.innerHTML = "<h2>" + score.current + "</h2>"
                            return text;
                        },
                    });
                    if(textbox != undefined){
                        new textbox({ position: 'topleft' }).addTo(map);
                    }
                });
            });  
    }, []); 
    return null;
}

function makePTCirclesFromData(data: GeoJsonObject){
    let layers: L.GeoJSON<any, any>[] = [];
    let geojsonMarkerOptions = {
        radius: 50,
        color: "#ff7800",
        stroke: false,
        opacity: 1,
        fillOpacity: 1,
    };
    let geoJsonLayerA = L.geoJSON(data, {
        filter(geoJsonFeature) {
            let kat = geoJsonFeature.properties.Hst_Kat;
            return kat == 1 || kat == 2;
        },
        pointToLayer: function (geoJsonFeature, latlng) {
            const properties = geoJsonFeature.properties;
            geojsonMarkerOptions.color = classColors.ClassA;
            const circle = L.circle(latlng, geojsonMarkerOptions);
            // Add a click event listener to each circle for displaying a tooltip
            if(properties.Hst_Kat == 1){
                circle.setRadius(500);
            }
            else{
                circle.setRadius(300);
            }
            return circle; 
        }
    });

    let geoJsonLayerB = L.geoJSON(data, {
        filter(geoJsonFeature) {
            let kat = geoJsonFeature.properties.Hst_Kat;
            return kat == 1 || kat == 2 || kat == 3;
        },
        pointToLayer: function (geoJsonFeature, latlng) {
            const properties = geoJsonFeature.properties;
            const circle = L.circle(latlng, geojsonMarkerOptions);
            circle.setStyle({color: classColors.ClassB, stroke: false, fillOpacity: 1});
                // Add a click event listener to each circle for displaying a tooltip
            if(properties.Hst_Kat == 1){
                circle.setRadius(750);
            }
            else if(properties.Hst_Kat == 2){
                circle.setRadius(500);
            }
            else{
                circle.setRadius(300);
            }
            return circle; 
        }
    });

    let geoJsonLayerC = L.geoJSON(data, {
        filter(geoJsonFeature) {
            let kat = geoJsonFeature.properties.Hst_Kat;
            return kat == 1 || kat == 2 || kat == 3 || kat == 4;
        },
        pointToLayer: function (geoJsonFeature, latlng) {
            const properties = geoJsonFeature.properties;
            const circle = L.circle(latlng, geojsonMarkerOptions);
            circle.setStyle({color: classColors.ClassC, stroke: false, fillOpacity: 1});
                // Add a click event listener to each circle for displaying a tooltip
            if(properties.Hst_Kat == 1){
                circle.setRadius(1000);
            }
            else if(properties.Hst_Kat == 2){
                circle.setRadius(750);
            }
            else if(properties.Hst_Kat == 3){
                circle.setRadius(500);
            }
            else{
                circle.setRadius(300);
            }
            return circle; 
        }
    });

    let geoJsonLayerD = L.geoJSON(data, {
        filter(geoJsonFeature) {
            let kat = geoJsonFeature.properties.Hst_Kat;
            return kat == 2 || kat == 3 || kat == 4 || kat == 5;
        },
        pointToLayer: function (geoJsonFeature, latlng) {
            const properties = geoJsonFeature.properties;
            const circle = L.circle(latlng, geojsonMarkerOptions);
            circle.setStyle({color: classColors.ClassD, stroke: false, fillOpacity: 1});
                // Add a click event listener to each circle for displaying a tooltip
            if(properties.Hst_Kat == 2){
                circle.setRadius(1000);
            }
            else if(properties.Hst_Kat == 3){
                circle.setRadius(750);
            }
            else if(properties.Hst_Kat == 4){
                circle.setRadius(500);
            }
            else{
                circle.setRadius(300);
            }
            return circle; 
        }
    });
    layers.push(geoJsonLayerD);
    layers.push(geoJsonLayerC);
    layers.push(geoJsonLayerB);
    layers.push(geoJsonLayerA);
    return layers;
    /*
                let geoJsonInfoLayer = L.geoJSON(data, {
                    pointToLayer: function (feature, latlng) {
                        const circle = L.circle(latlng, geojsonMarkerOptions);
                        // Add a click event listener to each circle for displaying a tooltip
                        circle.on('click', function (e) {
                            const properties = feature.properties;
                            const tooltipContent = `Name: ${properties.Name}<br>Bahnlinie_Anz: ${properties.Bahnlinie_Anz}`;
                            // Create a tooltip and bind it to the circle
                            circle.bindPopup(tooltipContent).openPopup();
                        });

                        return circle;
                    }
                }).addTo(map);
                */
}

function PointControlBox(){
    
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    /* eslint-disable no-template-curly-in-string */
    const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
    };
    /* eslint-enable no-template-curly-in-string */
    const onFinish = (values: any) => {
    console.log(values);
    };
    return(
        <Form
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
            validateMessages={validateMessages}
        >
            <Form.Item name={['user', 'name']} label="Name" rules={[{ required: true }]}>
            <Input />
            </Form.Item>
            <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email' }]}>
            <Input />
            </Form.Item>
            <Form.Item name={['user', 'age']} label="Age" rules={[{ type: 'number', min: 0, max: 99 }]}>
            <InputNumber />
            </Form.Item>
            <Form.Item name={['user', 'website']} label="Website">
            <Input />
            </Form.Item>
            <Form.Item name={['user', 'introduction']} label="Introduction">
            <Input.TextArea />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
            </Form.Item>
        </Form>
    );
}


function Legend() {

    const legend = new Control({ position: 'bottomright' });
    return (
        <div className="legend" id="legend-zurich">
            <img src={"https://api3.geo.admin.ch/static/images/legends/ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner_en.png"} alt="Legend"/>
            
        </div>
    )
}

export default ContentPage;
