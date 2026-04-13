import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import saldo_atual from "../../assets/cifrao.png";
import entrada from "../../assets/entrada.png";
import saida from "../../assets/saida.png";
import estoque from "../../assets/estoque.png";

type CardType = "info" | "success" | "danger" | "warning";

type CardProps = {
  type: CardType;
  value: string;
  secValue?: string;
};

export default function Card({ type, value, secValue }: CardProps) {
  const config = {
    info: {
      title: "Saldo Total",
      img: saldo_atual,
      bg: COLORS.info_card,
      textColor: COLORS.info_text,
    },
    success: {
      title: "Entradas",
      img: entrada,
      bg: COLORS.success_card,
      textColor: COLORS.success_text,
    },
    danger: {
      title: "Saídas",
      img: saida,
      bg: COLORS.danger_card,
      textColor: COLORS.danger_text,
    },
    warning: {
      title: "Itens no Patrimônio",
      img: estoque,
      bg: COLORS.warning_card,
      textColor: COLORS.warning_text,
    },
  }[type];

  const hasSecValue = !!secValue;

  return (
    <Container $bg={config.bg}>
      <Img src={config.img} />
      <Content>
        <Titulo>{config.title}</Titulo>

        {hasSecValue ? (
          <>
            <ValorSec $color={config.textColor}>{secValue}</ValorSec>
            <Valor $color={config.textColor} $small>
              {value}
            </Valor>
          </>
        ) : (
          <Valor $color={config.textColor}>{value}</Valor>
        )}
      </Content>
    </Container>
  );
}

const Container = styled.div<{ $bg: string }>`
  background-color: ${({ $bg }) => $bg};
  min-width: 0;
  max-width: 100%;
  height: 120px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 2px rgba(0, 0, 0, 0.1);

  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;

  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 600px) {
    min-width: 100%;
    height: 90px; 
    padding: 14px;
    gap: 12px;
    border-radius: 6px;
  }
`;


const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;

  word-break: break-word;

  @media (max-width: 600px) {
    gap: 4px;
  }
`;


const Valor = styled.h2<{ $color: string; $small?: boolean }>`
  color: ${({ $color }) => $color};
  font-weight: bold;
  margin: 0;
  font-size: ${({ $small }) => ($small ? "16px" : "22px")};
  font-family: "Poppins", sans-serif;

  @media (max-width: 600px) {
    font-size: ${({ $small }) => ($small ? "13px" : "14px")};
  }
`;


const ValorSec = styled.h2<{ $color: string }>`
  color: ${({ $color }) => $color};
  font-weight: bold;
  margin: 0;
  font-size: 22px;
  font-family: "Poppins", sans-serif;

  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const Titulo = styled.h3`
  font-weight: bolder;
  font-size: 18px;
  margin: 0;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Img = styled.img`
  width: 45px;
  height: 45px;

  @media (max-width: 600px) {
    width: 32px;
    height: 32px;
  }
`;
