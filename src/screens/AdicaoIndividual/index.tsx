import styled from "styled-components";
import ActionButton from "../../components/basics/ActionButton";
import TextInput, { type Option } from "../../components/basics/TextInput";
import StatusCard from "../../components/layout/StatusCard";
import Titulo from "../../components/layout/Titulo";
import type { PatrimonioIndividual, ModeloPatrimonial } from "../../types/patrimonioTypes";
import { useState, useEffect } from "react";
import { COLORS } from "../../constants/colors";
import { parseCurrency } from "../../utils/priceUtils";
import { toast } from "react-toastify";
import AppButton from "../../components/basics/AppButton";
import { Copy, X } from "lucide-react";
import { formatISODateForInput } from "../../utils/dataUtils";


type IndividuoForm = {
    tempId: number;
    localizacao: string;
    modeloId: string;
    preco?: string;
    observacoes?: string;
    modoAquisicao?: string;
    conservacao: "novo" | "bom" | "regular" | "ruim";
    status: "entrada" | "saida";
    dataAquisicao: string;
};

type AdicaoIndividualProps = {
    patrimonios: PatrimonioIndividual[];
    setPatrimonios: React.Dispatch<React.SetStateAction<PatrimonioIndividual[]>>;
    modelos: ModeloPatrimonial[];
    setModelos: React.Dispatch<React.SetStateAction<ModeloPatrimonial[]>>;
    onClose: () => void;
    isEdicao?: boolean;
    todasLocalizacoesOptions: Option[];
};

export default function AdicaoIndividual({
    patrimonios,
    setPatrimonios,
    isEdicao = false,
    todasLocalizacoesOptions,
}: AdicaoIndividualProps) {

    function limitarOptions(todas: Option[], texto: string, limite = 6): Option[] {
        const textoFiltrado = texto.trim().toLowerCase();

        if (!textoFiltrado) {
            return todas.slice(-limite);
        }

        const filtradas = todas.filter(op =>
            op.value.toLowerCase().includes(textoFiltrado)
        );

        return filtradas.slice(0, limite);
    }

    function getLocalizacoesOptions(texto: string): Option[] {
        return limitarOptions(todasLocalizacoesOptions, texto, 6);
    }




    const [individuos, setIndividuos] = useState<IndividuoForm[]>(() => {
        if (isEdicao && patrimonios.length > 0) {
            const p = patrimonios[0];
            return [{
                tempId: Date.now(),
                localizacao: p.localizacao || "",
                modeloId: p.modeloId || "",
                conservacao: p.conservacao || "novo",
                status: p.status || "entrada",
                dataAquisicao: p.dataAquisicao
                    ? formatISODateForInput(p.dataAquisicao)
                    : formatISODateForInput(new Date().toISOString()),
                preco: p.preco
                    ? String(p.preco).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                    : undefined,
                observacoes: p.observacoes ?? "",
                modoAquisicao: p.modoAquisicao ?? "Cadastro Manual",
            }];
        }

        return patrimonios.length > 0
            ? patrimonios.map((p, index) => ({
                tempId: Date.now() + index,
                localizacao: p.localizacao || "",
                modeloId: p.modeloId || "",
                conservacao: p.conservacao || "novo",
                status: p.status || "entrada",
                dataAquisicao: p.dataAquisicao
                    ? formatISODateForInput(p.dataAquisicao)
                    : formatISODateForInput(new Date().toISOString()),
                preco: p.preco
                    ? String(p.preco).replace(/\./g, ',')
                    : undefined,
                observacoes: p.observacoes ?? "",
                modoAquisicao: p.modoAquisicao ?? "Cadastro Manual",
            }))
            : [{
                tempId: Date.now(),
                localizacao: "",
                modeloId: "",
                conservacao: "novo",
                status: "entrada",
                dataAquisicao: formatISODateForInput(new Date().toISOString()),
                preco: undefined,
                observacoes: "",
                modoAquisicao: "",
            }];
    });



    useEffect(() => {
        const dadosMapeados: PatrimonioIndividual[] = individuos.map(i => ({
            localizacao: i.localizacao,
            modeloId: i.modeloId,
            conservacao: i.conservacao,
            status: i.status,
            observacoes: i.observacoes,
            modoAquisicao: i.modoAquisicao,

            preco: i.preco ? parseCurrency(i.preco) : 0,

            id: "",
            inventariante: "Aguardando Cadastro",

            dataAquisicao: i.dataAquisicao || new Date().toISOString(),
            ultimaAtualizacao: new Date().toISOString(),
        }));

        setPatrimonios(dadosMapeados);
    }, [individuos, setPatrimonios]);


    const handleDuplicate = (tempId: number, quantidade = 1) => {
        if (isEdicao) {
            toast.warning("A duplicação não é permitida ao editar um patrimônio individual.", {
                position: "top-center",
            });
            return;
        }
        setIndividuos(prev => {
            const item = prev.find(i => i.tempId === tempId);
            if (!item) return prev;

            const baseTime = Date.now();

            const duplicados = Array.from({ length: quantidade }, (_, index) => ({
                ...item,
                tempId: baseTime + Math.random() * 100000 + index + Math.random(),
            }));

            return [...prev, ...duplicados];
        });
    };


    const handleChange = <K extends keyof IndividuoForm>(tempId: number, field: K, value: IndividuoForm[K]) => {
        setIndividuos(prev => prev.map(i => i.tempId === tempId ? { ...i, [field]: value } : i));
    };

    const handleRemove = (tempId: number) => {
        if (individuos.length <= 1) {
            toast.error("Deve existir pelo menos um patrimônio.", {
                position: "top-right",
            });
            return;
        }

        setIndividuos(prev => prev.filter(i => i.tempId !== tempId));
    };

    return (
        <Wrapper>
            {
                isEdicao ? null : (
                    <Header>
                        <Titulo title={`Patrimônios a cadastrar: ${individuos.length}`} />
                    </Header>
                )
            }

            <ItensGrid>
                {individuos.map((ind, index) => (
                    <ItemCard key={ind.tempId}>
                        <TopBar>
                            <Titulo title={isEdicao ? `Patrimônio ${patrimonios[0]?.id || "Individual"}` : `Dado do Patrimônio ${index + 1}`} />
                            {!isEdicao && (
                                <Actions>
                                    <ActionButton
                                        type="duplicar"
                                        func={() => {
                                            const id = toast.info(
                                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "center" }}>
                                                    <Titulo title="Quantos patrimônios deseja duplicar?" align="center" marginBottom="0" />

                                                    <input
                                                        id="dup-input"
                                                        type="number"
                                                        defaultValue={1}
                                                        min={1}
                                                        style={{
                                                            padding: "6px",
                                                            borderRadius: "6px",
                                                            border: "1px solid #ccc",
                                                            textAlign: "center"
                                                        }}
                                                    />

                                                    <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                                                        <AppButton
                                                            text="Cancelar"
                                                            color={COLORS.danger_card}
                                                            icon={<X size={20} />}
                                                            func={() => {
                                                                toast.dismiss(id)
                                                            }}
                                                        />

                                                        <AppButton
                                                            text="Duplicar"
                                                            func={() => {
                                                                const val = Number(
                                                                    (document.getElementById("dup-input") as HTMLInputElement).value
                                                                );
                                                                toast.dismiss(id);
                                                                handleDuplicate(ind.tempId, val || 1);
                                                            }}
                                                            icon={<Copy size={20} />}

                                                        />
                                                    </div>
                                                </div>,
                                                {
                                                    autoClose: false,
                                                    closeOnClick: false,
                                                    draggable: false,
                                                    position: "top-center"
                                                }
                                            );
                                        }}
                                    />

                                    <ActionButton type="deletar" func={() => handleRemove(ind.tempId)} />
                                </Actions>
                            )}
                        </TopBar>
                        <FormGroup>
                            <TextInput
                                title="Localização"
                                required
                                type="select-creatable"
                                options={getLocalizacoesOptions(ind.localizacao)}
                                value={ind.localizacao}
                                onChange={(v) => handleChange(ind.tempId, "localizacao", v)}
                            />
                            <TextInput
                                title="Conservação"
                                required
                                type="select-cards"
                                options={[
                                    { label: "Novo", value: "novo", element: <StatusCard type="novo" /> },
                                    { label: "Bom", value: "bom", element: <StatusCard type="bom" /> },
                                    { label: "Regular", value: "regular", element: <StatusCard type="regular" /> },
                                    { label: "Ruim", value: "ruim", element: <StatusCard type="ruim" /> },
                                ]}
                                value={ind.conservacao}
                                onChange={(val) =>
                                    handleChange(ind.tempId, "conservacao", val as IndividuoForm["conservacao"])
                                }
                            />

                            <TextInput
                                title="Data de Aquisição"
                                type="datetime"
                                value={ind.dataAquisicao}
                                onChange={(val) => handleChange(ind.tempId, "dataAquisicao", val)}
                                required
                                width="100%"
                            />

                            <TextInput
                                title="Status"
                                required
                                type="select-cards"
                                options={[
                                    { label: "Entrada", value: "entrada", element: <StatusCard type="entrada" /> },
                                    { label: "Saída", value: "saida", element: <StatusCard type="saida" /> },
                                ]}
                                value={ind.status}
                                onChange={(val) =>
                                    handleChange(ind.tempId, "status", val as IndividuoForm["status"])
                                }
                            />
                            <TextInput
                                title="Preço (opcional)"
                                type="number"
                                value={ind.preco || ""}
                                onChange={(val) => handleChange(ind.tempId, "preco", val)}
                            />

                            <TextInput
                                title="Modo de aquisição (opcional)"
                                placeholder="Ex: Doação, compra, transferência..."
                                type="text"
                                value={ind.modoAquisicao}
                                onChange={(val) => handleChange(ind.tempId, "modoAquisicao", val)}
                            />
                            <TextInput
                                title="Observações (opcional)"
                                type="textarea"
                                value={ind.observacoes}
                                onChange={(val) => handleChange(ind.tempId, "observacoes", val)}
                            />
                        </FormGroup>
                    </ItemCard>
                ))}
            </ItensGrid>
        </Wrapper>
    );
}


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1.5em;
  width: 100%;
  max-width: 820px;
  padding: 0 1em;
  box-sizing: border-box;

  @media (max-width: 500px) {
        padding: 0;
    }
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: end;
  gap: 8px;
`;

const ItensGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2em;
`;

const ItemCard = styled.div`
  background: ${COLORS.brigth};
  border-radius: 14px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  padding: 1.2em 1.4em;
  display: flex;
  flex-direction: column;
  gap: 0.8em;
  width: 100%;
  box-sizing: border-box;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-start; /* título à esquerda */
  align-items: center;
  gap: 8px; /* espaçamento entre título e botão se necessário */

  h3 {
    font-weight: 600;
    font-size: 1rem;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  margin-left: auto;
  flex-shrink: 0;
`;


const FormGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  textarea, 
  div[type="textarea"],
  .textarea-wrapper {
    grid-column: 1 / -1; /* textarea ocupa toda a largura */
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); /* tablet */
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* celular */
  }

  & > * {
    width: 100%;
    min-width: 0; /* garante que inputs não extrapolem o card */
  }
`;