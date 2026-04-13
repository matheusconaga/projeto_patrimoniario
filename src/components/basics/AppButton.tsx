import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import type { ReactNode } from "react";

type AppButtonProps = {
  text: string;
  func: () => void;
  icon?: ReactNode;
  color?: string;
  disabled?: boolean;
};

export default function AppButton({
  text,
  func,
  icon,
  color = COLORS.primary,
  disabled = false,
}: AppButtonProps) {
  return (
    <Botao onClick={func} $color={color} disabled={disabled}>
      {icon && icon}
      <span>{text}</span>
    </Botao>
  );
}

const Botao = styled.button<{ $color: string }>`
  background-color: ${({ $color }) => $color};
  padding: 8px 15px;
  min-height: 30px;
  border-radius: 10px;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;

  &:hover:enabled {
    filter: brightness(0.85);
  }

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    background-color: ${COLORS.light};
    color: ${COLORS.dark};
    cursor: auto;
    opacity: 0.8;
  }

  svg {
    stroke-width: 2.3;
    width: 20px;
    height: 20px;
    transition: all 0.2s ease;
  }

  @media (max-width: 1024px) {
    font-size: 13px;
    padding: 7px 12px;
    gap: 6px;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 10px;
    border-radius: 8px;
    gap: 5px;

    svg {
      width: 17px;
      height: 17px;
    }
  }

  @media (max-width: 480px) {
  font-size: 11px;
  padding: 6px 8px;
  gap: 4px;

  svg {
    width: 15px;
    height: 15px;
    height: 15px;
  }

  span {
    display: inline; 
  }
}
`;
