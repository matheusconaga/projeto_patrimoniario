import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import Container from "../layout/Container";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Titulo from "../layout/Titulo";
import { useMemo } from "react";

function generateColor(index: number, total: number) {
  const hue = Math.round((360 / total) * index);
  const saturation = 65;
  const lightness = 55;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}


interface GraficoSetorProps {
  dataCategorias: { name: string; value: number }[];
}

export default function GraficoSetor({ dataCategorias }: GraficoSetorProps) {

  const total = useMemo(
    () => dataCategorias.reduce((acc, item) => acc + item.value, 0),
    [dataCategorias]
  );

  return (
    <Wrapper>
      <Container>
        <Titulo title="Distribuição por Categoria" />
        <ChartContainer>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dataCategorias}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                paddingAngle={2}
              >
                {dataCategorias.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={generateColor(index, dataCategorias.length)}
                    stroke="#fff"
                    strokeWidth={1.5}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} patrimonios`,
                  `${name}`,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          <LegendContainer>
            {dataCategorias.map((patrimonio, index) => (
              <LegendItem key={patrimonio.name}>
                <ColorDot color={generateColor(index, dataCategorias.length)} />
                <CategoryName>{patrimonio.name}</CategoryName>
                <BarContainer>
                  <BarFill
                    color={generateColor(index, dataCategorias.length)}
                    width={total === 0 ? 0 : (patrimonio.value / total) * 100}
                  />
                </BarContainer>
                <ValueText>{patrimonio.value}</ValueText>
              </LegendItem>
            ))}
          </LegendContainer>
        </ChartContainer>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    flex: 1;
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  height: 400px;
  width: 100%;
  position: relative;
  overflow: hidden;

  @media (max-width: 600px) {
    height: 350px;
    width: 95%;
  }
`;


const LegendContainer = styled.div`
 width: 100%;
 margin-top: 1.8rem;
 
 flex-grow: 1; 
 height: 0; 

 overflow-y: auto; 
 padding-right: 10px; 

 display: grid;
 grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
 gap: 1rem; 
  
  scrollbar-width: thin;
  scrollbar-color: ${COLORS.primary} #f0f0f0; 

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0; 
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: white;
    border-radius: 10px;
    border: 1px solid #ddd;
  }
  
   @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
    overflow-x: auto;        
    overflow-y: hidden;
    height: auto;
    -webkit-overflow-scrolling: touch;
  }
  

 @media (max-width: 768px) {
  height: auto;
  overflow-y: initial;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
 }

 @media (max-width: 480px) {
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
 }
 `;


const LegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;

    @media (max-width: 768px) {
      background: #fafafa;
      padding: 8px;
      border-radius: 8px;
      box-shadow: 0 0 4px rgba(0,0,0,0.05);
      gap: 8px;
    }
  `;


const ColorDot = styled.div<{ color: string }>`
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: ${({ color }) => color};
  `;

const CategoryName = styled.span`
  max-width: 120px;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.2;
    font-size: 14px;
    color: ${COLORS.dark};
  `;

const BarContainer = styled.div`
    flex: 1;
    height: 8px;
    background-color: #ebebeb;
    border-radius: 5px;
    overflow: hidden;
  `;

const BarFill = styled.div<{ color: string; width: number }>`
    width: ${({ width }) => width}%;
    height: 100%;
    background-color: ${({ color }) => color};
    transition: width 0.4s ease-in-out;
  `;

const ValueText = styled.span`
    font-size: 13px;
    font-weight: 600;
    color: ${COLORS.dark};
    margin-left: 8px;
  `;