import { Layout, Col, Row, Button } from 'antd';
import { Link } from 'react-router-dom';
import "./pages.css";

const {Content, Footer} = Layout;

function LandingPage() {
    return (
        <Layout className="layout" id="landingPage">
            <Content className="content">
                <Row>
                    <Col span={6}>
                        <div>
                            <span id="topic">
                                <h5>FWE 2023</h5>
                            </span>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div id="titelDiv">
                            <h1 id="title">Open Data Map</h1>
                            <Link id="contentLink" to="/content">
                                <Button id="startButton">Start</Button>
                            </Link>
                        </div>
                    </Col>
                    <Col span={6}/>
                </Row>
            </Content>
            <Footer className="footer" id="footerLanding">
                <span id="footerText">
                    <h5 id="fortnite">Elias Csuka, Joshua Durrant, Leander Hemmi, Cedric Koller, Mathias Schmid</h5>
                </span>
            </Footer>
        </Layout>
    );
}

export default LandingPage;