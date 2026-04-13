import styled from "styled-components";
import { COLORS } from "../../constants/colors";

type ConservacaoType = "bom" | "regular" | "ruim" | "novo" | "entrada" | "saida";

type Prop = {
  type: ConservacaoType;
};

export default function StatusCard({ type }: Prop) {
  const config = {
    bom: { title: "Bom", bg: COLORS.success_card },
    regular: { title: "Regular", bg: COLORS.warning_card },
    ruim: { title: "Ruim", bg: COLORS.danger_card },
    novo: { title: "Novo!", bg: COLORS.new_card },
    entrada: { title: "Entrada", bg: COLORS.success_card },
    saida: { title: "Saída", bg: COLORS.danger_card },
  }[type];

  return (
    <Wrapper>
      <Back $bg={config.bg}>
        <Titulo>{config.title}</Titulo>
      </Back>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Back = styled.div<{ $bg: string }>`
  background-color: ${({ $bg }) => $bg};
  min-width: 100px;
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: 0px 4px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  @media (max-width: 480px) {
    min-width: 80px;
    padding: 4px 8px;
    border-radius: 6px;
  }

  @media (max-width: 360px) {
    min-width: 65px;
    padding: 3px 6px;
  }
`;

const Titulo = styled.h3`
  font-weight: 700;
  font-size: 0.9rem;
  color: ${COLORS.dark};
  margin: 0;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }

  @media (max-width: 360px) {
    font-size: 0.75rem;
  }
`;
