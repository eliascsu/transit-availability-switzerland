import React from "react";
import styled from "@emotion/styled";

import Box, { BoxProps } from "@mui/material/Box";

const Page: React.FC<BoxProps> = styled(Box)(() => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "antiquewhite",
}));

export default Page;
