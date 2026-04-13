import styled from "styled-components";
import StatusCard from "../../components/layout/StatusCard";
import ListaDetalhes from "../../components/basics/ListaDetalhes";
import type { PatrimonioIndividual, ModeloPatrimonial } from "../../types/patrimonioTypes";
import { formatarData } from "../../utils/dataUtils";
import image_defaultUrl from "../../assets/image_default.png?url";
import { formatCurrency } from "../../utils/formatCurrency";

type Props = {
    patrimonio: PatrimonioIndividual;
    modelo?: ModeloPatrimonial;
};

export default function DetalhesPatrimonio({ patrimonio, modelo }: Props) {
    const patrimonioData = [
        { label: "ID Patrimônio", value: patrimonio.id },
        { label: "Patrimônio", value: modelo?.nome },
        { label: "Categoria", value: modelo?.categoria },
        { label: "Marca", value: modelo?.marca },
        { label: "Modelo", value: modelo?.modelo },
        { label: "Localização", value: patrimonio.localizacao },
        { label: "Conservação", value: <StatusCard type={patrimonio.conservacao} /> },
        { label: "Status", value: <StatusCard type={patrimonio.status} /> },
        { label: "Modo de aquisição", value: patrimonio.modoAquisicao || "-" },
        { label: "Preço", value: formatCurrency(patrimonio.preco || 0) },
        { label: "Inventariante", value: patrimonio.inventariante},
        { label: "Data de aquisição", value: formatarData(patrimonio.dataAquisicao) },
        { label: "Observações", value: patrimonio.observacoes || "-" },
        { label: "Última atualização", value: formatarData(patrimonio.ultimaAtualizacao) },
    ];


    const currentImage =
        modelo?.imagem && modelo.imagem.trim() !== "-"
            ? modelo.imagem
            : image_defaultUrl;

    return (
        <Wrapper>
            <Itens>
                <Imagem src={currentImage} alt={modelo?.nome} />
                <InfoContainer>
                    <ListaDetalhes data={patrimonioData} />
                </InfoContainer>
            </Itens>
        </Wrapper>
    );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Itens = styled.div`
  display: flex;
  width: 100%;
  max-width: 700px;
  gap: 1em;
  align-items: flex-start;
`;

const Imagem = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.1);
`;

const InfoContainer = styled.div`
  flex: 1;
  min-width: 0; 
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
`;
