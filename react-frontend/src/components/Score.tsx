import React from "react";

import LayerContext from "../context/LayerContext";

export default function Score() {
  const { score } = React.useContext(LayerContext);
  return (
    <div id="info_text">
      <h2>{score} new people served</h2>
    </div>
  );
}
