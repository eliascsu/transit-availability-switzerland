import { Control } from "leaflet";
import { useLayerContext } from '../ctx/LayerContext';

function Legend() {

    const {
        visibleLayersState, linesFromFormState,
        drawingState, userLinesRef, setScore
    } = useLayerContext();
    return (
        <ol className="LineLegendList" id="lineLegend" style={{maxHeight: 200, overflow: 'auto'}}>
            {linesFromFormState.map((listitem, i) => (
                <li className="list-group-item list-group-item-primary" id={i.toString()}>
                Line type: {listitem.typ}, Intervall: {listitem.intervall}min
                </li>
            ))}
        </ol>
    )
}

export {Legend}