import GraficoLinha from "../../components/graficos/GraficoLinha";
import GraficoSetor from "../../components/graficos/GraficoSetor";
import Card from "../../components/layout/Card";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { parseCurrency } from "../../utils/priceUtils";
import type { PatrimonioIndividual, ModeloPatrimonial } from "../../types/patrimonioTypes"
import { getInitialDataFirestore } from "../../services/modelosService";
import { getCategoriasComQuantidade } from "../../services/modelosService";
import { COLORS } from "../../constants/colors";



export default function Dashboard() {
  const [, setModelos] = useState<ModeloPatrimonial[]>([]);
  const [patrimonios, setPatrimonios] = useState<PatrimonioIndividual[]>([]);
  const [categoriasData, setCategoriasData] = useState<{ name: string; value: number }[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        const { initialModelos, initialPatrimonios } = await getInitialDataFirestore();
        setModelos(initialModelos);
        setPatrimonios(initialPatrimonios);

        const dataCategorias = await getCategoriasComQuantidade();
        setCategoriasData(dataCategorias);

      } catch (error) {
        console.error("Erro ao carregar dados do Firebase:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();

    const atualizar = () => carregarDados();
    window.addEventListener("storageUpdate", atualizar);
    return () => window.removeEventListener("storageUpdate", atualizar);
  }, []);

  const totalEntrada = patrimonios.filter(p => p.status === "entrada").length;
  const totalSaida = patrimonios.filter(p => p.status === "saida").length;

  const valorEntradaTotal = patrimonios.reduce((acc, p) => {
    return p.status === "entrada" ? acc + parseCurrency(p.preco) : acc;
  }, 0);

  const valorSaidaTotal = patrimonios.reduce((acc, p) => {
    return p.status === "saida" ? acc + parseCurrency(p.preco) : acc;
  }, 0);

  const totalPatrimonio = patrimonios.length;

  const totalValorAquisicao = patrimonios.reduce((acc, p) => {
    return acc + parseCurrency(p.preco);
  }, 0);


  return (
    <>
      {loading && (
        <LoadingOverlay>
          <Spinner />
          <p>Carregando dados...</p>
        </LoadingOverlay>
      )}

      <Container>
        <Cards>
          <Card
            value={`R$ ${totalValorAquisicao.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`}
            type="info"
          />
          <Card value={`+ R$ ${valorEntradaTotal.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`}
            type="success"
            secValue={`+${totalEntrada}`}
          />
          <Card value={`- R$ ${valorSaidaTotal.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`}
            type="danger"
            secValue={`-${totalSaida}`}
          />
          <Card value={`${totalPatrimonio}`} type="warning" />
        </Cards>

        <Graficos>
          <GraficoLinha patrimonios={patrimonios} />
          <GraficoSetor dataCategorias={categoriasData} />
        </Graficos>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 1em;
  gap: 1em;
  width: 100%;
  max-width: 1200px;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 20px;
  width: 100%;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  @media (max-width: 500px) {
  grid-template-columns: 1fr;
}

`;


const Graficos = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  gap: 20px;

  & > :first-child {
    flex: 0 0 65%;
    min-width: 500px;
  }

  & > :last-child { 
    flex: 0 0 33%;
    min-width: 350px;
    max-height: 600px; 
    overflow-y: hidden;
  }

  @media (max-width: 1000px) {
    flex-direction: column;
    gap: 16px;

    & > :first-child,
    & > :last-child {
      flex: none;
      width: 100%;   
      min-width: 0;   
      max-height: none; 
      margin: 0 auto;
    }
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgb(0 0 0 / 40%);
  backdrop-filter: blur(2px);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 16px;
  z-index: 9999;

  color: white;
  font-size: 1.2rem;
  font-weight: 700;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid ${COLORS.primary};
  border-top: 5px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;