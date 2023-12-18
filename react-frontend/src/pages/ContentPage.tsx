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
import PtMap_desc from "./components/descriptions/PtMap_desc";
import Zuerich from "./zuerich_minterpolated.mp4";
import HeatMap_desc from "./components/descriptions/HeatMap_desc";

const handleContextMenu: React.MouseEventHandler<HTMLVideoElement> = (event) => {
    event.preventDefault();
  };

export default function ContentPage() {

    return (
        <Layout className="layout" id="contentPage">
            <Content className="content" id="mapContent">
                <Row id="titelPage">
                    <div id="video-container">
                    <video id="zurichVideo" playsInline autoPlay loop muted preload="" 								onContextMenu={handleContextMenu}>
                        <source src={Zuerich} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                        <h1 id="contentTitel">Zürich</h1>
                    <h1 id="contentTitel">Zürich</h1>
                    <Link to="/" id="homeButton">
                        <img id="homeImg" src="https://cdn1.iconfinder.com/data/icons/duotone-essentials/24/chevron_backward-1024.png"/>
                        <h1>HOME</h1>
                    </Link>
                    </div>
                </Row>
                <Row id="popPage" className="page">
                    <PopulationHeatmap/>
                </Row>
                <Row id="text1">
                    <HeatMap_desc/>
                </Row>
                <Row id="transportPage" className="page">
                    <PtMap/>
                </Row>
                <Row id="text2">
                    <PtMap_desc/>
                </Row>
                <Row id="interactivePage"className="page">
                    <MapWrapper/>
                    <Legend/>
                    <CheckBoxes/>
                    <PointControlBox/>
                </Row>
            </Content>
            <Footer className="footer" id="mapFooter">
                <span id="footerWrapper">
                    <h5 id="credits">Elias Csuka, Joshua Durrant, Leander Hemmi, Cedric Koller, Mathias Schmid</h5>
                </span>
            </Footer>
        </Layout>
    );
}