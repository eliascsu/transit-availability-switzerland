import React from "react";
import { useTranslation } from "react-i18next";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import Typography from "@mui/material/Typography";

import MapContext from "../../context/mapContext";

type HeatmapDescriptionProps = {
  useSwissTopoMap: boolean;
  setSwissTopoMap: (value: boolean) => void;
  infoStatePopulation: string;
};

const HeatmapDescription: React.FC<HeatmapDescriptionProps> = ({ useSwissTopoMap, setSwissTopoMap, infoStatePopulation }) => {
  const { t } = useTranslation();
  const { populationDensityLoaded } = React.useContext(MapContext);
  return (
    <Box style={{
      flexBasis: "33.33%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "90%",
      gap: "1rem",
    }}>
      <Typography variant="h6" style={{ paddingTop: "2rem" }}>
        <b>{t("heatmap.population-density-in-switzerland")}</b>
      </Typography>
      <Divider style={{ margin: 1, color: "black" }}/>
      <Box style={{ padding: "8px", gap: "8px" }} >
        <Typography variant="body1">
          {t("heatmap.checkbox-switch")}
        </Typography>
        <Button
          variant="outlined"
          disabled={!populationDensityLoaded}
          onClick={() => setSwissTopoMap(!useSwissTopoMap)}
          style={{ width: "100%" }}
        >
          {useSwissTopoMap ? (
            <p>{t("heatmap.switch-to-heatmap-layer")}</p>
          ) : (
            <p>{t("heatmap.switch-to-swisstopo-layer")}</p>
          )}
        </Button>
      </Box>
      <Card variant="outlined" style={{ padding: "8px", gap: "8px" }} sx={{
        bgcolor: "antiquewhite",
        width: "100%",
        padding: "8px",
      }}>
        <Typography style={{
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          justifyContent: "center",
        }}>
          <InfoTwoToneIcon/> {t("heatmap.click-on-a-tile-to-display-info")}
        </Typography>
        {
          infoStatePopulation && (
          <>
            <Divider style={{
              margin: "8px",
              color: "black",
            }}/>
            <Typography
              dangerouslySetInnerHTML={{
                __html: infoStatePopulation.replace(
                  /Population\scount/g,
                  t("heatmap.population-count-ha"),
                ),
              }}
            />
          </>
          )
        }
      </Card>

    </Box>
  );
};

export default HeatmapDescription;
