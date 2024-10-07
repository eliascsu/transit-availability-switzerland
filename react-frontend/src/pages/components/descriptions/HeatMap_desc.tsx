import { MathJax } from "better-react-mathjax";

export default function HeatMap_desc() {
  return (
    <div id ="heatmap-description" className="reveal">
      <h2 id="title1">Populations density</h2>
      <p id="info1">To understand how public transit can be improved, it is crucial to understand where
        people live and where they commute to. In a sense, Switzerland is a sprawling country,
        as 50% of the population lives in villages with less than 10'000 inhabitants. However,
        the majority of the population lives in the urban centers of Zurich, Geneva, Basel, Bern,
        and Lausanne. The population map shows the amount of people living per ha in Switzerland,
        essentially the housing density. More than 99% of housing units in Switzerland
        are geocoded and provided here. Households without an address in the province cannot be
        geocoded, but are included in the center-coordinate of the province. Therefore it might be
        possible for smaller provinces and city center coordinates to have a higher displayed population
        density than there actually is. The data is provided by the Swiss Federal Statistical Office.
      </p>
      <h2 id="title2">Heatmap calculations</h2>
      <p id="info2">The heatmap is blue where few people live and gradually changes to green, then yellow and finally red,
        proportional to the amount of people that live in any given square hectar of space.
        The intensity for each point of the dataset is calculated as follows:
        <MathJax id="HMformula">{"`\\text{Intesity}=((\\text{Population})/20)^{2}+1/2`"}</MathJax>
        and is capped at a maximum of 40.
        Why do we not use a linear intensity scale?
        Since a large amount of the population lives in a comparably small area in big
        cities, all suburban areas, even with a substantial amount of people living there,
        would be at the very bottom end of the intensity scale. With our formula, we allocate
        more of the dynamic range of the heatmap to slightly lower density areas, making it
        easier to identify problematic areas where people live but have poor access to
        public transportation.
        Why is the scale capped at 40? This has mainly to do with the fact that the datasets
        that we are using have the quirk that all people without a registered address,
        are put in the center of the nearest city in the data. This results in some points
        having an artificially overinflated intensity, which takes up a large chunk of the
        dynamic range of the heatmap. By capping the intensity value, we remove such outliers.
      </p>
    </div>
  );
}
