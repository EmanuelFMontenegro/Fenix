// LayoutContainer.jsx
import React from "react";
import { styled } from "@mui/system";

const Container = styled("div")`
  display: flex;
  height: 100vh;
`;

const layoutContainer = ({ sidebar, content }) => {
  return (
    <Container>
      {sidebar}
      {content}
    </Container>
  );
};

export default layoutContainer;
