import React from "react";
import { useTranslation } from "react-i18next";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";

import LayerContext from "../context/LayerContext";

import { Line } from "../models/data";

const FormComponent: React.FC = () => {
  const { t } = useTranslation();

  const {
    drawingState,
    setDrawingState,
    linesFromFormState,
    setLinesFromFormState,
  } = React.useContext(LayerContext);

  const [type, setType] = React.useState("Bus");
  const [interval, setInterval] = React.useState(7.5);

  const onSubmit = () => {
    const newLine: Line = {
      typ: type,
      intervall: interval,
    };
    setLinesFromFormState([...linesFromFormState, newLine]);
    setType("Bus");
    setInterval(7);
  };
  return (
    <Paper sx={{
      bgcolor: (theme) => theme.palette.background.default,
      padding: 1,
    }}
      variant="outlined"
    >
      <Typography variant="h6">
        <b>{t("create-your-own-line")}</b>
      </Typography>
      <Button onClick={() => { setDrawingState(!drawingState); }}>{drawingState ? "Stop drawing" : "Start drawing"}</Button>
      <Select value={t("bus")} onChange={(e) => { setType(e.target.value); }} style={{ width: 130 }}>
        <MenuItem value={"Bus"}>Bus</MenuItem>
        <MenuItem value={"Tram"}>Tram</MenuItem>
        <MenuItem value={"S_Bahn"}>S-Bahn</MenuItem>
      </Select>
      <Select value={7} onChange={(e) => { setInterval(parseFloat(e.target.value.toString())); }} style={{ width: 130 }}>
        <MenuItem value={3.5}>3.5min</MenuItem>
        <MenuItem value={7}>7min</MenuItem>
        <MenuItem value={15}>15min</MenuItem>
        <MenuItem value={30}>30min</MenuItem>
        <MenuItem value={60}>1h</MenuItem>
      </Select>
      <Button onClick={onSubmit}>Submit</Button>
    </Paper>
  );
};

export default FormComponent;
