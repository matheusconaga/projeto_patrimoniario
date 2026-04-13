import styled from "styled-components";
import NavBar from "./components/layout/NavBar";
import Dashboard from "./screens/Dashboard";
import Footer from "./components/layout/Footer";
import GestaoPatrimonio from "./screens/GestaoPatrimonio";


export default function App() {
  return (
      <AppContainer>
        <NavBar />
        <MainContent>
          <Dashboard />
          <GestaoPatrimonio />
        </MainContent>
      <Footer />
      </AppContainer>
  );
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 0 auto;
  padding-top: 9em;
  gap: 0.5em;
  flex: 1;

  @media (max-width: 600px) {
    padding-top: 6em;
  }
`;



