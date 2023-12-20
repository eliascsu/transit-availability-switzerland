import { Layout, Col, Row, Button } from 'antd';
import { Link } from 'react-router-dom';
import "./pages.css";
import backChevron from "../svg/back_chevron.svg"

const {Content, Footer} = Layout;

function AttributionsPage() {
    return (
        <Layout className="layout" id="attributionsPage">
            <Content className="content">
                <Link to="/" id="homeButton">
                    <img id="homeImg" src={backChevron}/>
                    <h2>HOME</h2>
                </Link>
                <div id='attributions'>
                    <h2 id='att_title'>Attributions</h2>
                    <hr className="solid" id='underline'/>
                    <Row>
                        <h3>General</h3>
                    </Row>
                    <Row>
                        <Col id='att_general'>
                            <li><a href='https://react.dev/'>React</a></li>
                            <li><a href='https://reactrouter.com/en/main'>React Router</a></li>
                        </Col>
                    </Row>
                    <Row>
                        <h3>Frontend</h3>
                    </Row>
                    <Row>
                        <Col id='att_frontend'>
                            <div id='att_frontend_first'>
                            <li>React framework: <a href='https://ant.design/'>Ant Design</a></li>
                            <li>Interactive Maps with <a href='https://leafletjs.com/'>Leaflet</a></li>
                            <li>Maps with <a href="https://www.thunderforest.com/">Thunderforest©</a></li>
                            </div>
                            <div id="att_frontend_sec">
                            <li>Railway overlay with <a href="https://www.openrailwaymap.org/">OpenRailwayMap©</a></li>
                            <li>Data from <a href="https://www.openstreetmap.org/copyright">OpenStreetMap©</a></li>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <h3>Backend</h3>
                    </Row>
                    <Row>
                        <Col id='att_backend'>
                        <li> Population and household statistics (STATPOP) from<br/>
                            <a href="https://www.bfs.admin.ch/bfs/de/home/dienstleistungen/geostat/geodaten-bundesstatistik/gebaeude-wohnungen-haushalte-personen/bevoelkerung-haushalte-ab-2010.assetdetail.27065723.html">federal office for statistics (BFS Nr: be-d-00.03-10-STATPOP-v122)</a>
                        </li>
                        <li>
                        Transport accessibility in Switzerland <br/>
                            <a href="https://www.are.admin.ch/verkehrserschliessung">Federal Office for Spatial Development (ARE)</a>
                        </li>
                        </Col>
                    </Row>
                </div>


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