import { Checkbox, Button } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { LayerVisibility } from "../../types/data";
import { useLayerContext } from "../ctx/LayerContext";
import { Score } from "./Score";
import { useSwissTopoContext } from "../ctx/Swisstopo";
import { useEffect, useState } from "react";
import { useLoadingContext } from "../ctx/LoadingContext";

export function CheckBoxes() {
  const {
    visibleLayersState, setVisibleLayersState,
    checkboxValues, setCheckboxValues,
    linesFromFormState, setLinesFromFormState,
    drawingState, setDrawingState,
  } = useLayerContext();

  const { allLoaded } = useLoadingContext();

  const CheckboxGroup = Checkbox.Group;
  const options = ["Public Transport map", "Population Density map", "Limited public transport access map"];
  const layers: LayerVisibility = { popLayer:false, transportLayer:false, popUnservedLayer:false };

  const publicTransport = (element: CheckboxValueType) => element == "Public Transport map";
  const populationDensity = (element: CheckboxValueType) => element == "Population Density map";
  const populationUnserved = (element: CheckboxValueType) => element == "Limited public transport access map";

  const onChange = (list: CheckboxValueType[]) => {
    if (allLoaded) {
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
    }
  };

  return (
        <div id="checkBoxes">
          <Score/>
          <CheckboxGroup className="interactive_checkbox" options={options} value={checkboxValues} onChange={onChange}/>
          <div id="interactive_text">
            <p>Shows public transport connectivity.</p>
            <p>Highlights population hotspots.</p>
            <p>Marks areas with poor public transport access.</p>
            </div>
        </div>
  );
}

export function SwisstopoButton() {
  const { useSwissTopoMap, setSwissTopoMap } = useSwissTopoContext();
  const { loadHeatmap } = useLoadingContext();

  return (
    <div id="swisstopButton">
      <Button disabled={!loadHeatmap} onClick={() => setSwissTopoMap(!useSwissTopoMap)}>
        {useSwissTopoMap ? <p>Switch to heatmap</p> : <p>Switch to SwissTopo layer</p>}
      </Button>
    </div>
  );
}
