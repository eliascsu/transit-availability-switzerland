import { Control } from "leaflet";

function Legend() {

    const legend = new Control({ position: 'bottomright' });
    return (
        <div className="legend" id="legend-zurich">
            <img src={"https://api3.geo.admin.ch/static/images/legends/ch.bfs.volkszaehlung-bevoelkerungsstatistik_einwohner_en.png"} alt="Legend"/>
        </div>
    )
}

export {Legend}