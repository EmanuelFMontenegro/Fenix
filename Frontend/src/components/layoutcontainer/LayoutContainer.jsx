import React from "react";
import { styled } from "@mui/system";
import PanelDeControl from "../paneldecontrol/PanelDeControl";

const Container = styled("div")`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled("div");

const Content = styled("div")`
  flex: 1;
  padding: 20px;
`;

const LayoutContainer = () => {
  return (
    <Container>
      <Sidebar></Sidebar>
      <Content>
        <PanelDeControl />
      </Content>
    </Container>
  );
};

export default LayoutContainer;
