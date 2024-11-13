import { useTranslation } from "react-i18next";
import { MathJax } from "better-react-mathjax";

const HeatMapDescription: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div id ="heatmap-description" className="reveal">
      <h2 id="title1">{t("heatmap.populations-density")}</h2>
      <p id="info1">{t("heatmap.heatmap-description")}
      </p>
      <h2 id="title2">{t("heatmap.heatmap-calculations")}</h2>
      <p id="info2">{t("heatmap.heatmap-calculations-description")}
      </p>
    </div>
  );
};

export default HeatMapDescription;
