import styled from "styled-components";
import type { ReactNode } from "react";
import { COLORS } from "../../constants/colors";

type Item = {
  label: string;
  value: ReactNode;
};

type Props = {
  data: Item[];
};

export default function ListaDetalhes({ data }: Props) {
  return (
    <ListContainer>
      {data.map((item, index) => (
        <ListItem key={index}>
          <Label>{item.label}</Label>
          <Value>{item.value}</Value>
        </ListItem>
      ))}
    </ListContainer>
  );
}

const ListContainer = styled.div`
  width: 100%;
  border: 2px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;

  box-sizing: border-box;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  gap: 4px;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.div`
  font-weight: 600;
  color: ${COLORS.dark};
  flex-shrink: 0;

  display: inline;   
  text-align: start;
  width: 120px;

  &::after {
    content: ":";          
    margin-left: 2px;
    white-space: nowrap; 
  }

  word-break: break-word; 

  @media (max-width: 480px) {
    width: 100px;
    font-size: 0.9rem;
  }

  @media (max-width: 360px) {
    width: 85px;
    font-size: 0.85rem;
  }
`;



const Value = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  color: ${COLORS.dark};
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;

  font-size: 0.95rem;

  @media (max-width: 360px) {
    font-size: 0.85rem;
  }
`;
