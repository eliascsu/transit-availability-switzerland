import React from "react";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import LayerContext from "../context/LayerContext";

import { Line } from "../models/data";

function FormComponent() {
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
    <div id='lineForm'>
      <Typography variant="body1">
        Create your own line
      </Typography>
      <Button onClick={() => { setDrawingState(!drawingState); }}>{drawingState ? "Stop drawing" : "Start drawing"}</Button>
      <Select value={"Bus"} onChange={(e) => { setType(e.target.value); }} style={{ width: 130 }}>
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
    </div>
  );
}

export default FormComponent;
