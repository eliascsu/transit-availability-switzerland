import React from "react";
import { useTranslation } from "react-i18next";

import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";

import LayerContext from "../context/LayerContext";

const CheckBoxes: React.FC = () => {
  const { t } = useTranslation();
  const {
    visibleLayersState, setVisibleLayersState, score,
  } = React.useContext(LayerContext);

  return (
    <>
      <Typography variant="h6"><b>{score} {t("new-people-served")}</b></Typography>
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
};

export default CheckBoxes;
