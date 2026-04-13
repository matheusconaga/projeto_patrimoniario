import { useCallback, useEffect } from "react";
import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import type { ReactNode } from "react";
import ActionButton from "../basics/ActionButton";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRequestClose?: () => void;
  title?: string;
  children: ReactNode;
  width?: string;
  height?: string;
};

export default function Modal({
  isOpen,
  onClose,
  onRequestClose,
  title,
  children,
  width = "70%",
  height = "auto",
}: ModalProps) {

  const handleTryClose = useCallback(() => {
    if (onRequestClose) onRequestClose();
    else onClose();
  }, [onRequestClose, onClose]);


  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleTryClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [handleTryClose]);


  if (!isOpen) return null;

  return (
    <Overlay onClick={handleTryClose}>
      <ModalContent
        onClick={(e) => e.stopPropagation()}
        $width={width}
        $height={height}
      >
        <Header>
          {title && <Title>{title}</Title>}

          <ActionButton type="fechar" func={handleTryClose} />
        </Header>

        <Body>{children}</Body>
      </ModalContent>
    </Overlay>
  );
}

const HEADER_HEIGHT = "56px";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  @media (max-width: 768px) {
    align-items: flex-end;
  }
`;

const ModalContent = styled.div<{ $width: string; $height: string }>`
  position: relative;
  background: ${COLORS.light};
  border-radius: 16px;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    width: 100vw !important;
    height: 100vh !important;
    max-height: 100vh;
    border-radius: 0;
    animation: slideUp 0.25s ease;

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  }
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;

  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${HEADER_HEIGHT};

  background-color: ${COLORS.light};
  box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.034);

  padding: 0 24px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;

  @media (max-width: 768px) {
    border-radius: 0;
    padding: 0 16px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  }
`;

const Title = styled.h2`
  font-size: 1.1em;
  color: ${COLORS.dark};
  text-align: center;
  flex: 1;
  margin: 0;
`;

const Body = styled.div`
  padding: 1em 24px 24px 24px;
  overflow-y: auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
`;
