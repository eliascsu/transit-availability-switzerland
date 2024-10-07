import React from "react";

import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import LayerContext from "../context/LayerContext";
import Score from "./Score";

export function CheckBoxes() {
  const {
    visibleLayersState, setVisibleLayersState,
  } = React.useContext(LayerContext);

  return (
        <div id="checkBoxes">
          <Score/>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => { setVisibleLayersState(
                    {
                      ...visibleLayersState,
                      transportLayer: e.target.checked,
                    });
                  }}
                  checked={visibleLayersState.transportLayer}
                />}
              label="Public Transport map"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(event) => {
                    setVisibleLayersState({
                      ...visibleLayersState,
                      popLayer: event.target.checked,
                    });
                  }}
                  checked={visibleLayersState.popLayer}
                />
              }
              label="Population Density map"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => { setVisibleLayersState(
                    {
                      ...visibleLayersState,
                      popUnservedLayer: e.target.checked,
                    });
                  }}
              checked={visibleLayersState.popUnservedLayer}
               />}
              label="Unserved Population map"
            />
          </FormGroup>
          {/* <div id="interactive_text">
            <p>Shows public transport connectivity.</p>
            <p>Highlights population hotspots.</p>
            <p>Marks areas with poor public transport access.</p>
            </div> */}
        </div>
  );
}

export default CheckBoxes;
