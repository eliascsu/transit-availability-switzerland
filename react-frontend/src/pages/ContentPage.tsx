import React, { useEffect, useRef } from "react";
import { Layout, Row, Button } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import { Legend } from "./components/legend";
import { MapWrapper } from "./components/MapWrapper";
import { CheckBoxes } from "./components/Checkboxes";
import PointControlBox from "./components/PointControlBox";
import PopulationHeatmap from "./components/maps/Heatmap";
import PtMap from "./components/maps/PtMap";
import PtMap_desc from "./components/descriptions/PtMap_desc";
import Zuerich from "./zuerich.mp4";
import HeatMap_desc from "./components/descriptions/HeatMap_desc";
import back_chevron from "../svg/back_chevron.svg";
import CustomDesc from "./components/descriptions/CustomDesc";
import {ScrollToBottom, ScrollToTop} from "./components/ScrollToButton";

const handleContextMenu: React.MouseEventHandler<HTMLVideoElement> = (event) => {
    event.preventDefault();
  };

export default function ContentPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Start or pause the video depending on whether it's in the viewport
                if (entry.isIntersecting) {
                    videoRef.current?.play();
                } else {
                    videoRef.current?.pause();
                }
            },
            {
                // Trigger the callback when the video is 50% in view
                threshold: 0.5,
            }
        );

        // Start observing the video
        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        // Clean up on unmount
        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);
    return (
        <Layout className="layout" id="contentPage">
            <Content className="content" id="mapContent">
                <Row id="titelPage">
                    <div id="video-container">
                    <video ref={videoRef} id="zurichVideo" playsInline autoPlay loop muted preload="" 								onContextMenu={handleContextMenu}>
                        <source src={Zuerich} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <h1 id="contentTitel">Switzerland</h1>
                    <Link to="/" id="homeButton">
                        <img id="homeImg" src={back_chevron}/>
                        <h1>HOME</h1>
                    </Link>
                    <a id="skipButton">
                        <ScrollToBottom/>
                    </a>
                    <Link id="attributionLink2" to="/attributions">
                        <img id="homeImg" src={back_chevron}/>
                        <h1>ATTRIBUTIONS</h1>
                    </Link>
                    </div>
                </Row>
                <Row id="textPage1">
                    <HeatMap_desc/>
                </Row>
                <Row id="popPage" className="page">
                    <PopulationHeatmap/>
                </Row>
                <Row id="textPage2">
                    <PtMap_desc/>
                </Row>
                <Row id="transportPage" className="page ">
                    <PtMap/>
                </Row>
                <Row id="textPage3">
                    <CustomDesc/>
                </Row>
                <Row id="interactivePage"className="page">
                    <MapWrapper/>
                    <Legend/>
                    <CheckBoxes/>
                    <PointControlBox/>
                    <a>
                        <ScrollToTop/>
                    </a>
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