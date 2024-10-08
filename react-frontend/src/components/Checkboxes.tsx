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
    <>
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
          title="Shows public transport connectivity."
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
          title="Highlights population hotspots."
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
          title="Marks areas with poor public transport access"
        />
      </FormGroup>
    </>
  );
}

export default CheckBoxes;
