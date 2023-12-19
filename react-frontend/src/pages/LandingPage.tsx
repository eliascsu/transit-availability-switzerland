import { Layout, Col, Row, Button } from 'antd';
import { Link } from 'react-router-dom';
import "./pages.css";

const {Content} = Layout;

function LandingPage() {
    return (
        <Layout className="layout">
                <Content>
                    <div className='img_wrapper'>
                        <img className="background_img" src="metro_map.svg" alt=""/>
                        <Row>
                            <Col span={8} id="col8">
                                <div className="label">
                                    <h5>FWE 2023</h5>
                                </div>
                            </Col>
                            <Col span={16}/>
                        </Row>
                        <Row>
                            <Col span={4} className='col4'/>
                            <Col span={16} className='col16'>
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
                            <Col span={4} className='col4'/>
                        </Row>
                    </div>
                </Content>
        </Layout>
    );
}

export default LandingPage;

/* 
<div className="layer background">
                <img src="metro_map.svg" alt='Custom metro map used in the background'/>
            </div>
            <div id='leftGreen'/>
*/