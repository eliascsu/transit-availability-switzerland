import React from "react";
import { useTranslation } from "react-i18next";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
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
    <Box style={{ flexBasis: "33.33%" }}>
      <Typography variant="h6" style={{ paddingTop: "2rem" }}>
        <b>{t("heatmap.population-density-in-switzerland")}</b>
      </Typography>
      {(
        infoStatePopulation === "" ? (
          <Typography style={{ textAlign: "center" }}>
            <InfoTwoToneIcon/> {t("heatmap.click-on-a-tile-to-display-info")}
          </Typography>
        ) : (
          <Typography
            dangerouslySetInnerHTML={{
              __html: infoStatePopulation.replace(
                /Population\scount/g,
                t("heatmap.population-count-ha"),
              ),
            }}
          />
        )
      )}
      <Typography variant="body1">
        {t("heatmap.checkbox-switch")}
      </Typography>
      <Button
        disabled={!populationDensityLoaded}
        onClick={() => setSwissTopoMap(!useSwissTopoMap)}
      >
        {useSwissTopoMap ? (
          <p>{t("heatmap.switch-to-heatmap-layer")}</p>
        ) : (
          <p>{t("heatmap.switch-to-swisstopo-layer")}</p>
        )}
      </Button>
    </Box>
  );
};

export default HeatmapDescription;
