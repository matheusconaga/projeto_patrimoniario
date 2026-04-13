import styled from "styled-components";
import { QRCodeCanvas } from "qrcode.react";
import logo from "../../assets/logo.png";
import { COLORS } from "../../constants/colors";

type EtiquetaProps = {
  codigo: string;
  id: string | number;
};

export default function Etiqueta({ codigo, id }: EtiquetaProps) {

  const detalhesUrl = `${window.location.origin}/detalhes/${id}`;

  return (
    <EtiquetaContainer>
      <Logo src={logo} alt="Logo da empresa" />
      <InfoArea>
        <Titulo>Patrimônio</Titulo>
        <QRCodeContainer>
          <QRCodeCanvas value={detalhesUrl} size={90} />
        </QRCodeContainer>
        <Codigo>{codigo}</Codigo>
      </InfoArea>

    </EtiquetaContainer>
  );
}

const EtiquetaContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  border: 2px solid ${COLORS.dark};
  border-radius: 8px;
  padding: 10px 16px;
  width: 320px;
  height: 160px;
 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
`;

const Logo = styled.img`
  width: 150px;
  height: auto;
`;

const InfoArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Titulo = styled.h3`
  font-size: 0.9rem;
  color: ${COLORS.dark};
  margin-bottom: 4px;
`;

const QRCodeContainer = styled.div`
  margin-bottom: 4px;
`;

const Codigo = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
  color: ${COLORS.dark};
`;
