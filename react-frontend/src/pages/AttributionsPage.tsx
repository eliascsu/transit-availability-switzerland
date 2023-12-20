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
                            <li><a href='https://ant.design/'>Ant Design</a></li>
                            <li><a href='https://leafletjs.com/'>Leaflet</a></li>
                            <li>Railway overlay © <a href="https://www.openrailwaymap.org/">OpenRailwayMap contributors</a></li>
                            </div>
                            <div id="att_frontend_sec">
                            <li>Maps © <a href="https://www.thunderforest.com/">Thunderforest</a></li>
                            <li>Data  © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a></li>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <h3>Backend</h3>
                    </Row>
                    <Row>
                        <Col id='att_backend'>
                        <li> Statistik der Bevölkerung und Haushalte STATPOP <br/>
                            <a href="https://www.bfs.admin.ch/bfs/de/home/dienstleistungen/geostat/geodaten-bundesstatistik/gebaeude-wohnungen-haushalte-personen/bevoelkerung-haushalte-ab-2010.assetdetail.27065723.html">Bundesamt für Statistik (BFS Nr: be-d-00.03-10-STATPOP-v122)</a>
                        </li>
                        <li>
                            Verkehrserschliessung in der Schweiz <br/>
                            <a href="https://www.are.admin.ch/verkehrserschliessung">Bundesamt für Raumentwicklung ARE</a>
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