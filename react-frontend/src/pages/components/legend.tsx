import { Control } from "leaflet";
import { useLayerContext } from '../ctx/LayerContext';

function Legend() {

    const {
        visibleLayersState, linesFromFormState,
        drawingState, userLinesRef, setScore
    } = useLayerContext();
    return (
        <div className="legend" id="legend-zurich">
            <ol className="LineLegendList" style={{maxHeight: 200, overflow: 'auto'}}>
                {linesFromFormState.map((listitem, i) => (
                    <li className="list-group-item list-group-item-primary" id={i.toString()}>
                    Line type: {listitem.typ}, Interval: {listitem.intervall}
                    </li>
                ))}
            </ol>
        </div>
    )
}

export {Legend}