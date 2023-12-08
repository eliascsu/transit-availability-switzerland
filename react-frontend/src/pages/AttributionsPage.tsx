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
                                <li><a href='https://reactrouter.com/en/main'>React Router</a></li>
                            </ul>
                            <h3>Frontend</h3>
                            <ul>
                                <li><a href='https://ant.design/'>Ant Design</a></li>
                                <li><a href='https://leafletjs.com/'>Leaflet</a></li>
                                <li>Railway overlay © <a href="https://www.openrailwaymap.org/">OpenRailwayMap contributors</a></li>
                                <li>Maps © <a href="https://www.thunderforest.com/">Thunderforest</a>, Data  © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a></li>
                            </ul>
                            <h3>Backend</h3>
                            <ul>
                                <li><p>Statistik der Bevölkerung und Haushalte STATPOP</p>
                                    <a href="https://www.bfs.admin.ch/bfs/de/home/dienstleistungen/geostat/geodaten-bundesstatistik/gebaeude-wohnungen-haushalte-personen/bevoelkerung-haushalte-ab-2010.assetdetail.27065723.html">Bundesamt für Statistik (BFS Nr: be-d-00.03-10-STATPOP-v122)</a>
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    <p>Verkehrserschliessung in der Schweiz</p>
                                    <a href="https://www.are.admin.ch/verkehrserschliessung">Bundesamt für Raumentwicklung ARE</a>
                                </li>
                            </ul>
                            <Link to="/">
                                <Button>Back to Home</Button>
                            </Link>
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