import { Layout, Col, Row, Button } from 'antd';
import { Link } from 'react-router-dom';
import "./pages.css";

const {Content, Footer} = Layout;

function AttributionsPage() {
    return (
        <Layout className="layout" id="landingPage">

            <Content className="content">
                <Row>
                    <Col span={2}/>
                    <Col span={20}>
                        <div>
                            <h1>Attributions</h1>
                            <hr className="solid"/>
                            <h3>General</h3>
                            <ul>
                                <li><a href='https://react.dev/'>React</a></li>
                                <li>React Router - Link</li>
                            </ul>
                            <h3>Frontend</h3>
                            <ul>
                                <li>Ant Design - Link</li>
                                <li>Leaflet - Link</li>
                            </ul>
                            <h3>Backend</h3>
                            <ul>
                                <li>GeoJSON something - Link</li>
                            </ul>
                        </div>
                    </Col>
                    <Col span={2}/>
                </Row>
            </Content>
            <Footer className="footer" id="footerLanding">
                <span id="footerText">
                    <h5 id="credits">Elias Csuka, Joshua Durrant, Leander Hemmi, Cedric Koller, Mathias Schmid</h5>
                </span>
            </Footer>
        </Layout>
    );
}

export default AttributionsPage;