import { createGlobalStyle } from "styled-components";
import { COLORS } from "../constants/colors";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
  }

  body {
    background-color: ${COLORS.white};
    font-family: sans-serif;
  }
`;

export default GlobalStyle;
