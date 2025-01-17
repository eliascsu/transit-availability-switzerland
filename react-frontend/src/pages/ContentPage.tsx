import React, { useContext, useEffect, useRef} from "react";
import { Layout, Row, Switch } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import Zuerich from "./zuerich.mp4";
import back_chevron from "../svg/back_chevron_white.svg";
import { Legend, MapWrapper, CheckBoxes, PointControlBox, PopulationHeatmap, PtMap, PtMap_desc, HeatMap_desc, CustomDesc, ScrollToBottom, ScrollToTop } from "./components";
import "./css/bundle.css";
import { BeatLoader } from "react-spinners";
import { useLoadingContext } from "./ctx/LoadingContext";
import { ThemeContext } from "../App";
import DarkLightButton from "./components/DarkLightButton";


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

    const { allLoaded } = useLoadingContext();

    const context = useContext(ThemeContext);

    return (
        <Layout className="layout" id="contentPage">
            <Content className="content" id="mapContent">
                <div id="loading">
                    <BeatLoader size={35} loading={!allLoaded} color="white"/>
                </div>
                <Row id="titlePage">
                    <div id="video-container">
                    <video ref={videoRef} id="zurichVideo" playsInline autoPlay loop muted preload="" 								onContextMenu={handleContextMenu}>
                        <source src={Zuerich} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div id="title_div">
                    <h1 className="contentTitle" id="first_title">Transit</h1>
                    <h1 className="contentTitle" id="second_title">Availability</h1>
                    <h1 className="contentTitle" id="third_title">Switzerland</h1>
                    </div>
                    <a id="skipButton">
                        <ScrollToBottom/>
                    </a>
                    <DarkLightButton/>
                    <Link id="attributionLink2" to="/attributions">
                        <img className="homeImg" src={back_chevron}/>
                        <h1>ATTRIBUTIONS</h1>
                    </Link>
                    </div>
                </Row>
                <Row className="textPage">
                    <HeatMap_desc/>
                </Row>
                <Row id="popPage" className="page">
                    <PopulationHeatmap/>
                </Row>
                <Row className="textPage">
                    <PtMap_desc/>
                </Row>
                <Row id="transportPage" className="page ">
                    <PtMap/>
                </Row>
                <Row className="textPage">
                    <CustomDesc/>
                </Row>
                <Row id="interactivePage"className="page">
                    <MapWrapper/>
                    <Legend/>
                    <CheckBoxes/>
                    <PointControlBox/>
                    <a id="skip_up_button">
                        <ScrollToTop/>
                    </a>
                </Row>
            </Content>
            <Footer className="footer">
                <span id="footerWrapper">
                    <h5 className="credits">Elias Csuka, Joshua Durrant, Leander Hemmi, Cedric Koller, Mathias Schmid | <a href="https://github.com/neonfighter28/transit-availability-switzerland">Source Code</a></h5>
                </span>
            </Footer>
        </Layout>
    );
}