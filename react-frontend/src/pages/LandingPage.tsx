import { Layout, Col, Row, Button } from 'antd';
import { Link } from 'react-router-dom';
import "./pages.css";

const {Content, Footer} = Layout;

function LandingPage() {
    return (
        <Layout className="layout" id="landingPage">
            <div className="layer background">
                <img src="metro_map.svg" alt='Custom metro map used in the background'/>
            </div>
            <div id='leftGreen'/>
            <div className='layer front'>
                <Content className="content">
                    <Row>
                        <Col span={6}>
                            <div>
                                <span id="topic">
                                    <h5>FWE 2023</h5>
                                </span>
                            </div>
                        </Col>
                        <Col span={18}>
                            <div id="titelDiv">
                                <h1 id="title">Open Data Map</h1>
                                <Link id="contentLink" to="/content">
                                    <Button id="startButton">Start</Button>
                                </Link>
                                <Link id="contentLink" to="/attributions">
                                    <Button id="attributionsButton" type="text">Attributions</Button>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Content>
            </div>
            <Footer className="footer" id="footerLanding">
                <span id="footerText">
                    <h5 id="credits">Elias Csuka, Joshua Durrant, Leander Hemmi, Cedric Koller, Mathias Schmid</h5>
                </span>
            </Footer>

        </Layout>
    );
}

export default LandingPage;