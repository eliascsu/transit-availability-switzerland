import React from "react";

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const Legend: React.FC = () => {
  return (
        <Card variant="outlined" sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: 1,
          bgcolor: (theme) => theme.palette.background.default,
        }}>
            <Typography id="legendTitle">Connection quality:</Typography>
            <Divider sx={{
              margin: 1,
              color: "black",
              width: "90%",
            }}/>
            <div style={{ listStyleType: "none" }} >
                <LegendRow color="#700038" text="Very good connection quality"/>
                <LegendRow color="#9966FF" text="Good connection quality"/>
                <LegendRow color="#00B000" text="Medium connection quality"/>
                <LegendRow color="#B3FF40" text="Bad connection quality"/>
            </div>
        </Card>
  );
};

const Rectangle: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div id="rectangle" style={{
      width: "20px",
      height: "15px",
      background: color,
    }}>
    </div>
  );
};

const LegendRow: React.FC<{ color: string, text: string }> = ({ color, text }) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      gap: "1rem",
      alignItems: "center",
      height: "30px",
    }}>
      <Rectangle color={color}/>
      <Typography>{text}</Typography>
    </div>
  );
};

export default Legend;
