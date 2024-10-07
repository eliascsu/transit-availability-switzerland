import React from "react";
import L from "leaflet";

import { MapContainer, MapContainerProps } from "react-leaflet";

import styled from "@emotion/styled";

const StyledMapContainer: React.FC<MapContainerProps> = styled((props: MapContainerProps) => {
  return (
    <MapContainer
      center={[47.36, 8.53]}
      zoom={10}
      scrollWheelZoom={false}
      zoomSnap={0.5}
      minZoom={8}
      style={{ flexBasis: "66.66%" }}
      maxBounds={
        new L.LatLngBounds(
          [48.076, 5.397],
          [45.599, 11.416],
        )
      }
      {...props}
    />
  );
})(() => ({
  flexBasis: "66.66%",
}));

export default StyledMapContainer;
