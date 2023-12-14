import React from "react";
import { Layout, Row, Button } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import { Legend } from "./components/legend";
import { MapWrapper } from "./components/MapWrapper";
import { CheckBoxes, SwisstopoCheckbox } from "./components/Checkboxes";
import PointControlBox from "./components/PointControlBox";
import PopulationHeatmap from "./components/maps/Heatmap";
import PtMap from "./components/maps/PtMap";

export default function ContentPage() {

    return (
        <Layout className="layout" id="contentPage">
            <Content className="content" id="mapContent">
                <Row id="titelPage">
                    <h1 id="contentTitel">Zürich</h1>
                    <Link to="/" id="homeButton">
                        <img id="homeImg" src="https://cdn1.iconfinder.com/data/icons/duotone-essentials/24/chevron_backward-1024.png"/>
                        <h1>HOME</h1>
                    </Link>
                </Row>
                <Row id="popPage">
                    <PopulationHeatmap/>
                </Row>
                <Row id="transportPage">
                    <PtMap/>
                </Row>
                <Row id="interactivePage">
                    <MapWrapper/>
                    <Legend/>
                    <CheckBoxes/>
                    <PointControlBox/>
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