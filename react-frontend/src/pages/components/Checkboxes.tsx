import { Checkbox } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { LayerVisibility } from "../../types/data";
import { useLayerContext } from "../ctx/LayerContext";
import { Score } from "./Score";

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
          <CheckboxGroup options={options} value={checkboxValues} onChange={onChange}/>
        </div>
      );
}