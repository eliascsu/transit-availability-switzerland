import { Layout, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import backChevron from "../svg/back_chevron.svg"
import "./css/bundle.css";
import react_logo from "./react_logo.png"
import react_router_logo from "./react_router.svg"

const {Content, Footer} = Layout;

function AttributionsPage() {
    return (
        <Layout className="layout" id="attributionsPage">
            <Content className="content">
                <Link to="/" className="homeButton">
                    <img className="homeImg" src={backChevron}/>
                    <h2>HOME</h2>
                </Link>
                <div id='attributions'>
                    <h2 id='att_title'>Attributions</h2>
                    <hr className="solid" id='underline'/>
                    <Row id='att_general'>
                        <Col>
                            <img src={react_logo} alt="react_logo" id='react_logo' />
                            <a href='https://react.dev/' id='react_link'>React</a>
                            <img src={react_router_logo} alt="react_router_logo" id='react_router_logo' />
                            <a href='https://reactrouter.com/en/main' id='react_router_link'>React Router</a>
                        </Col>
                    </Row>
                    <Row id='att_grid'>
                        <Col id='att_frontend_title'>
                        <h3>Frontend</h3>
                        </Col>
                        <Col id='att_backend_title'>
                        <h3>Backend</h3>
                        </Col>
                        <Col id='att_frontend'>
                            <li>React framework: <a href='https://ant.design/'>Ant Design</a></li>
                            <li>Interactive Maps with <a href='https://leafletjs.com/'>Leaflet</a></li>
                            <li>Maps with <a href="https://www.thunderforest.com/">Thunderforest©</a></li>
                            <li>Railway overlay with <a href="https://www.openrailwaymap.org/">OpenRailwayMap©</a></li>
                            <li>Data from <a href="https://www.openstreetmap.org/copyright">OpenStreetMap©</a></li>
                        </Col>
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
            <Footer className="footer">
                <span id="footerText">
                    <h5 className="credits">Elias Csuka, Joshua Durrant, Leander Hemmi, Cedric Koller, Mathias Schmid</h5>
                </span>
            </Footer>
        </Layout>
    );
}

export default AttributionsPage;