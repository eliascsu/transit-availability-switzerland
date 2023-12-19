import { Checkbox } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { LayerVisibility } from "../../types/data";
import { useLayerContext } from "../ctx/LayerContext";
import { Score } from "./Score";
import { useSwissTopoContext } from "../ctx/Swisstopo";

export function CheckBoxes() {
    const {
        visibleLayersState, setVisibleLayersState,
        checkboxValues, setCheckboxValues,
        linesFromFormState, setLinesFromFormState,
        drawingState, setDrawingState
    } = useLayerContext();

    const CheckboxGroup = Checkbox.Group;
    const options = ['PublicTransport', 'PopulationDensity', 'PopulationUnserved'];
    const layers: LayerVisibility = {popLayer:false, transportLayer:false, popUnservedLayer:false}

    const publicTransport = (element: CheckboxValueType) => element == 'PublicTransport';
    const populationDensity = (element: CheckboxValueType) => element == 'PopulationDensity';
    const populationUnserved = (element: CheckboxValueType) => element == 'PopulationUnserved';

    const onChange = (list: CheckboxValueType[]) => {
        setCheckboxValues(list);
        if (list.some(publicTransport)) {
            layers.transportLayer = true;
        } else {
            layers.transportLayer = false;
        }
        if (list.some(populationDensity)) {
            layers.popLayer = true;
        } else {
            layers.popLayer = false;
        }
        if (list.some(populationUnserved)) {
            layers.popUnservedLayer = true;
        } else {
            layers.popUnservedLayer = false;
        }
        setVisibleLayersState(layers);
        console.log(layers);
  };

    return (
        <div id="checkBoxes">
          <Score/>
          <p>Population Density Map: Highlights population hotspots.
                Public Transport Connection Quality Map: Shows public transport connectivity.
                Limited Public Transport Access Map: Marks areas with poor public transport access.
                Toggle these maps for targeted insights.
            </p>
          <CheckboxGroup options={options} value={checkboxValues} onChange={onChange}/>
        </div>
      );
}

export function SwisstopoCheckbox() {
    const {useSwissTopoMap, setSwissTopoMap} = useSwissTopoContext()
    return (
        <div id="swisstopoCheckbox">
            <Checkbox checked={useSwissTopoMap} onChange={() => setSwissTopoMap(!useSwissTopoMap)}>{useSwissTopoMap ? <p>Switch to heatmap</p> : <p>Switch to SwissTopo layer</p>}</Checkbox>

        </div>
    )
}