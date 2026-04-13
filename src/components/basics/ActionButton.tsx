import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import { Trash, Edit, Eye, Tag, Copy, Delete, X } from "lucide-react";

type ActionType = "visualizar" | "etiqueta" | "editar" | "deletar" | "duplicar" | "cancelar" | "fechar";

type Props = {
  type: ActionType;
  func: () => void;
  loading?: boolean;
  customIcon?: React.ReactNode;
};


export default function ActionButton({ type, func, loading = false, customIcon }: Props) {
  const config = {
    visualizar: {
      label: "Visualizar",
      hoverColor: COLORS.info_card,
      icon: <Eye size={20} color={COLORS.dark} />,
    },
    etiqueta: {
      label: "Gerar Etiqueta",
      hoverColor: COLORS.success_card,
      icon: <Tag size={20} color={COLORS.dark} />,
    },
    editar: {
      label: "Editar",
      hoverColor: COLORS.warning_card,
      icon: <Edit size={20} color={COLORS.dark} />,
    },
    deletar: {
      label: "Excluir",
      hoverColor: COLORS.danger_card,
      icon: <Trash size={20} color={COLORS.dark} />,
    },
    duplicar: {
      label: "Duplicar",
      hoverColor: COLORS.info_card,
      icon: <Copy size={20} color={COLORS.dark} />,
    },
    cancelar: {
      label: "Cancelar",
      hoverColor: COLORS.danger_card,
      icon: <Delete size={22} color={COLORS.dark} />,
    },
    fechar: {
      label: "Fechar",
      hoverColor: COLORS.danger_card,
      icon: <X size={22} color={COLORS.dark} />,
    },
  }[type];

  return (
    <Wrapper>
      <Botao
        $hoverColor={config.hoverColor}
        onClick={() => !loading && func()}
      >
        {loading ? customIcon ?? <Spinner size={16} /> : customIcon ?? config.icon}
      </Botao>
      <Tooltip>{config.label}</Tooltip>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover span {
    opacity: 1;
    visibility: visible;
    transform: translateY(-6px);
  }
`;

const Botao = styled.button<{ $hoverColor: string }>`
display: flex;
  padding: 6px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:hover {
    background-color: ${({ $hoverColor }) => $hoverColor};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Tooltip = styled.span`
  position: absolute;
  bottom: 125%;
  background-color: ${COLORS.dark};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transform: translateY(0);
  transition: all 0.2s ease;
  pointer-events: none;
  z-index: 10;
`;

const Spinner = styled.div<{ size?: number }>`
  border: ${({ size = 16 }) => size / 6}px solid #f3f3f3;
  border-top: ${({ size = 16 }) => size / 6}px solid ${COLORS.primary};
  border-radius: 50%;
  width: ${({ size = 16 }) => size}px;
  height: ${({ size = 16 }) => size}px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
