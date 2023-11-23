import { MapContainer, TileLayer, useMap, WMSTileLayer } from 'react-leaflet'
import L, { HeatLatLngTuple, LatLng, point } from "leaflet";
import 'leaflet/dist/leaflet.css';
import './pages.css';
import { Control } from 'leaflet';
import { useEffect, useState, useRef } from 'react';
import "proj4leaflet";
import Papa from 'papaparse';
import "leaflet.heat";
import {v4 as uuidv4} from 'uuid';
import { Button, Checkbox, Form, Input, Layout, Col, Row } from 'antd';
import { getPopulationDensity } from '../router/resources/data';

const {Content, Footer} = Layout;

interface CsvData {
    lat: string,
    lng: string,
    pop: string
  }

interface Point {
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
let defaultName: string = "";
let defaultBahnknoten = 0;
let defaultBahnlinie_Anz = 0;
let defaultTramBus_Anz = 1;
let defaultSeilbahn_Anz = 0;
let defaultA_Intervall = 0;
let defaultB_Intervall = 8;
let defaultHst_Kat = -1;

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

        <MapContainer className="map-container" id="map-zurich" center={[47.36, 8.53]} zoom={10} scrollWheelZoom={true}>
            <TileLayer url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=119ad4f25bed4ec2a70aeba31a0fb12a" attribution="&copy; <a href=&quot;https://www.thunderforest.com/&quot;>Thunderforest</a> contributors"/>
            <Map></Map>
        </MapContainer>

    );
}

function Map(){
    const map = useMap();
    const [csvData, setCsvData] = useState<CsvData[]>();
    const addedPoints = useRef<Point[]>([]);

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
                console.log(heatArray);
                
                let heat = L.heatLayer(heatArray, {radius: 15, max: 10}).addTo(map);
            }
        });
        

        fetch("/OeV_Haltestellen_ARE.geojson").then(response => response.json()) 
            .then(data => {
                console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEEE" + data);
                var geojsonMarkerOptions = {
                    radius: 50,
                    color: "#ff7800",
                    stroke: false,
                    opacity: 1,
                    fillOpacity: 1,
                };
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
    
                geoJsonLayerD.addTo(map);
                geoJsonLayerC.addTo(map);
                geoJsonLayerB.addTo(map);
                geoJsonLayerA.addTo(map);
                //geoJsonInfoLayer.addTo(map);
                map.on("click", function(e){
                    let uuid = uuidv4();
                    let newPoint: Point = {
                        Haltestellen_No: uuid,
                        Y_Koord: e.latlng.lng,
                        X_Koord: e.latlng.lat,
                        Name: defaultName,
                        Bahnknoten: defaultBahnknoten,
                        Bahnlinie_Anz: defaultBahnlinie_Anz,
                        TramBus_Anz: defaultTramBus_Anz,
                        Seilbahn_Anz: defaultSeilbahn_Anz,
                        A_Intervall: defaultA_Intervall,
                        B_Intervall: defaultB_Intervall,
                        Hst_Kat: defaultHst_Kat
                    }
                    addedPoints.current = [...addedPoints.current, newPoint];
                    console.log(addedPoints.current);
                });
            });  
    }, []);
    /*
    useEffect(() => {
        let pointsToSend = addedPoints.current;
        let formdata = new FormData();
        formdata.append("points", pointsToSend.toString());
        fetch("/points", {
            method: "POST",
            body: formdata})
    }, [addedPoints]);*/
    
    return null;
}

/*
function PointControlBox(){
    
    const onFinish = (values: any) => {
        console.log('Success:', values);
      };
    const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    };
    return(
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >

            <Form.Item<PointBoxOption>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            >
            <Input.Password />
            </Form.Item>

            <Form.Item<PointBoxOption>
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
            >
            <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
            </Form.Item>
        </Form>
    );
}
*/

function Legend() {

    const legend = new Control({ position: 'bottomright' });
    return (
        <div className="legend" id="legend-zurich">
            <img src={"https://api3.geo.admin.ch/static/images/legends/ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner_en.png"} alt="Legend"/>
            
        </div>
    )
}

export default ContentPage;
