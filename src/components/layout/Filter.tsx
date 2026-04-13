import styled from "styled-components";
import Titulo from "./Titulo";
import AppButton from "../basics/AppButton";
import { COLORS } from "../../constants/colors";
import { BrushCleaning, Funnel } from "lucide-react";
import TextInput, { type Option } from "../basics/TextInput";
import ActionButton from "../basics/ActionButton";
import type { ModeloPatrimonial, PatrimonioIndividual } from "../../types/patrimonioTypes";
import { useMemo } from "react";
import StatusCard from "./StatusCard";

type Filtros = {
    id: string;
    nome: string;
    categoria: string;
    conservacao: string;
    localizacao: string;
    status: string;
    dataAquisicaoInicio: string;
    dataAquisicaoFim: string;
};


type FilterProps = {
    filtros: Filtros;
    setFiltros: React.Dispatch<React.SetStateAction<Filtros>>;
    patrimonios: PatrimonioIndividual[];
    modelos: ModeloPatrimonial[];
    onLimpar?: () => void;
    onFiltrar?: () => void;
    onFechar?: () => void;
    loading?: boolean;

};

export default function Filter({ filtros, setFiltros, patrimonios, modelos, onLimpar, onFiltrar, onFechar, loading = false }: FilterProps) {

    function limitarOptions(todas: Option[], texto: string, limite = 6): Option[] {
        const textoFiltrado = texto.trim().toLowerCase();

        if (!textoFiltrado) {
            return todas.slice(0, limite);
        }

        const filtradas = todas.filter(op =>
            op.value.toLowerCase().includes(textoFiltrado)
        );

        return filtradas.slice(0, limite);
    }


    const categoriasOptions = useMemo(() => {
        const todas = Array.from(new Set(modelos.map(m => m.categoria).filter(Boolean)))
            .map(c => ({ label: c, value: c }));
        return limitarOptions(todas, filtros.categoria);
    }, [modelos, filtros.categoria]);

    const nomesOptions = useMemo(() => {
        const todas = Array.from(new Set(modelos.map(m => m.nome).filter(Boolean)))
            .map(n => ({ label: n, value: n }));
        return limitarOptions(todas, filtros.nome);
    }, [modelos, filtros.nome]);

    const idPatrimonioOptions = useMemo(() => {
        const todas = Array.from(new Set(patrimonios.map(p => p.id).filter(Boolean)))
            .map(i => ({ label: i, value: i }));
        return limitarOptions(todas, filtros.id);
    }, [patrimonios, filtros.id]);

    const localizacoesOptions = useMemo(() => {
        const todas = Array.from(new Set(patrimonios.map(p => p.localizacao).filter(Boolean)))
            .map(l => ({ label: l, value: l }));
        return limitarOptions(todas, filtros.localizacao);
    }, [patrimonios, filtros.localizacao]);


    return (
        <>

        {loading && (
  <LoadingOverlay>
    <Spinner />
    <p>Filtrando...</p>
  </LoadingOverlay>
)}

            <Titulo title="Filtros de Busca" />


            <Content>
                <TopButton>
                    <ActionButton func={onFechar ?? (() => { })} type="fechar" />
                </TopButton>

                <FilterInputs>
                    <TextInput
                        title="ID"
                        allowCreate={false}
                        type="select-creatable"
                        options={idPatrimonioOptions}
                        value={filtros.id}
                        onChange={(val) => setFiltros(prev => ({ ...prev, id: val }))}
                    />
                    <TextInput
                        title="Nome patrimonio"
                        type="select-creatable"
                        allowCreate={false}
                        options={nomesOptions}
                        value={filtros.nome}
                        onChange={(val) => setFiltros(prev => ({ ...prev, nome: val }))}
                    />
                    <TextInput
                        title="Categoria"
                        value={filtros.categoria}
                        type="select-creatable"
                        allowCreate={false}
                        options={categoriasOptions}
                        onChange={(val) => setFiltros(prev => ({ ...prev, categoria: val }))}
                    />
                    <TextInput
                        title="Conservação"
                        type="select-cards"
                        value={filtros.conservacao}
                        options={[
                            { label: "Novo", value: "novo", element: <StatusCard type="novo" /> },
                            { label: "Bom", value: "bom", element: <StatusCard type="bom" /> },
                            { label: "Regular", value: "regular", element: <StatusCard type="regular" /> },
                            { label: "Ruim", value: "ruim", element: <StatusCard type="ruim" /> },
                        ]}
                        onChange={(val) => setFiltros(prev => ({ ...prev, conservacao: val }))}
                    />
                    <TextInput
                        title="Localização"
                        value={filtros.localizacao}
                        allowCreate={false}
                        type="select-creatable"
                        options={localizacoesOptions}
                        onChange={(val) => setFiltros(prev => ({ ...prev, localizacao: val }))}
                    />
                    <TextInput
                        title="Status"
                        value={filtros.status}
                        type="select-cards"
                        options={[
                            { label: "Entrada", value: "entrada", element: <StatusCard type="entrada" /> },
                            { label: "Saída", value: "saida", element: <StatusCard type="saida" /> },
                        ]}
                        onChange={(val) => setFiltros(prev => ({ ...prev, status: val }))}
                    />
                    <TextInput
                        title="Data Aquisição (De)"
                        type="datetime"
                        value={filtros.dataAquisicaoInicio}
                        onChange={(val) =>
                            setFiltros(prev => ({ ...prev, dataAquisicaoInicio: val }))
                        }
                    />

                    <TextInput
                        title="Data Aquisição (Até)"
                        type="datetime"
                        value={filtros.dataAquisicaoFim}
                        onChange={(val) =>
                            setFiltros(prev => ({ ...prev, dataAquisicaoFim: val }))
                        }
                    />
                </FilterInputs>

                <BottomButtons>
                    <AppButton
                        icon={<BrushCleaning size={20} />}
                        text="Limpar campos"
                        color={COLORS.seccundary}
                        func={onLimpar ?? (() => { })}
                    />
                    <AppButton
  icon={<Funnel size={20} />}
  text={loading ? "Carregando..." : "Filtrar"}
  func={loading ? (() => {}) : (onFiltrar ?? (() => {}))}
  disabled={loading}
/>

                </BottomButtons>
            </Content>
        </>
    )
}

const FilterInputs = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1em;
    margin-top: 0.6em;

`

const BottomButtons = styled.div`

    display: flex;
    flex-direction: row;
    gap: 1em;
    margin-top: 1.5em;
    justify-content: end;

`

const TopButton = styled.div`
position: absolute;
top: 1em;
right: 1em;
display: flex;
`;

const Content = styled.div`
    position: relative;
    background: #f9fafb;
    padding: 2.5em 1em 1em 1em; 
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    flex-grow: 1;

    @media (max-width: 800px) {
        width: 100%; 
        max-width: 100%; 
        margin: 0 auto;
        padding: 2em 1.2em;
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
