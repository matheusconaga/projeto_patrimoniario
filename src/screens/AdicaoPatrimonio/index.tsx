import { useEffect, useMemo, useState } from "react";
import type { ModeloPatrimonial, PatrimonioIndividual } from "../../types/patrimonioTypes";
import styled from "styled-components";
import TextInput, { type Option } from "../../components/basics/TextInput";
import ImageInput from "../../components/basics/ImageInput";
import AppButton from "../../components/basics/AppButton";
import Titulo from "../../components/layout/Titulo";
import AdicaoIndividual from "../AdicaoIndividual";
import { addPatrimonioIndividualFirestore, editPatrimonioIndividualFirestore } from "../../services/patrimonioService";
import { addModeloFirestore, editModeloFirestore } from "../../services/modelosService";
import { COLORS } from "../../constants/colors";
import ActionButton from "../../components/basics/ActionButton";
import { deleteImagem, uploadImagem } from "../../services/imageService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


type AdicaoPatrimonioProps = {
    modelos: ModeloPatrimonial[];
    patrimonios: PatrimonioIndividual[];
    setModelos: React.Dispatch<React.SetStateAction<ModeloPatrimonial[]>>;
    setPatrimonios: React.Dispatch<React.SetStateAction<PatrimonioIndividual[]>>;
    patrimonioParaEdicao?: PatrimonioIndividual;
    onCloseSuccess: () => void;
};

export function AdicaoPatrimonio({
    modelos,
    patrimonios,
    setModelos,
    setPatrimonios,
    onCloseSuccess,
    patrimonioParaEdicao,
}: AdicaoPatrimonioProps) {

    const modeloPatrimonioEdicao = useMemo(() => {
        if (!patrimonioParaEdicao) return null;
        const encontrado = modelos.find(m => m.id === patrimonioParaEdicao.modeloId);
        return encontrado ?? null;
    }, [patrimonioParaEdicao, modelos]);

    const [selectedModelo, setSelectedModelo] = useState<ModeloPatrimonial | null>(modeloPatrimonioEdicao);
    const [nome, setNome] = useState(modeloPatrimonioEdicao?.nome || "");
    const [categoria, setCategoria] = useState(modeloPatrimonioEdicao?.categoria || "");
    const [unidade, setUnidade] = useState(modeloPatrimonioEdicao?.unidade || "");
    const [marca, setMarca] = useState(modeloPatrimonioEdicao?.marca || "");
    const [modelo, setModelo] = useState(modeloPatrimonioEdicao?.modelo || "");
    const [imagem, setImagem] = useState<File | string | null | undefined>(
        modeloPatrimonioEdicao?.imagem ?? null
    );

    const [editandoModelo, setEditandoModelo] = useState(false);


    const modeloExiste = !!selectedModelo;
    const isEdicao = !!patrimonioParaEdicao;
    const [loading, setLoading] = useState(false);


    const [individuos, setIndividuos] = useState<PatrimonioIndividual[]>(
        patrimonioParaEdicao ? [patrimonioParaEdicao] : []
    );

    const [originalModelo, setOriginalModelo] = useState<ModeloPatrimonial | null>(modeloPatrimonioEdicao);
    const [originalImagem, setOriginalImagem] = useState<string | undefined>(modeloPatrimonioEdicao?.imagem);

    useEffect(() => {
        if (nome.trim() === "") {
            setSelectedModelo(null);
            setCategoria("");
            setUnidade("");
            setMarca("");
            setModelo("");
            setImagem(undefined);
            setEditandoModelo(false);
        }
    }, [nome]);

    useEffect(() => {
        setOriginalModelo(selectedModelo);
        setOriginalImagem(selectedModelo?.imagem);
    }, [selectedModelo]);



    const handleIniciarEdicaoModelo = () => {
        if (selectedModelo) {
            setOriginalModelo(selectedModelo);
            setOriginalImagem(typeof imagem === "string" ? imagem : undefined);
        }

        setEditandoModelo(true);

        toast.warning(
            "Ao editar este modelo, todas as alterações irão refletir automaticamente em todos os patrimônios associados.",
            {
                position: "top-center",
                autoClose: 5000,
                pauseOnHover: true,
            }
        );
    };


    const handleCancelarEdicaoModelo = () => {
        setEditandoModelo(false);

        const modeloParaRestaurar = originalModelo;

        if (modeloParaRestaurar) {
            setSelectedModelo(modeloParaRestaurar);
            setNome(modeloParaRestaurar.nome || "");
            setCategoria(modeloParaRestaurar.categoria || "");
            setUnidade(modeloParaRestaurar.unidade || "");
            setMarca(modeloParaRestaurar.marca || "");
            setModelo(modeloParaRestaurar.modelo || "");
            setImagem(originalImagem);
        } else {
            setSelectedModelo(null);
            setNome("");
            setCategoria("");
            setUnidade("");
            setMarca("");
            setModelo("");
            setImagem(undefined);
        }
    };

    const handleSalvarModelo = async () => {
        if (!selectedModelo) return;
        setLoading(true);

        try {
            let imagemFinal = "-";

            if (originalImagem && originalImagem !== "-" && originalImagem !== imagem) {
                await deleteImagem(originalImagem);
            }

            if (imagem && typeof imagem !== "string") {
                imagemFinal = await uploadImagem(imagem);
            } else if (typeof imagem === "string") {
                imagemFinal = imagem;
            } else {
                imagemFinal = "-";
            }

            const updates: Partial<ModeloPatrimonial> = {
                nome,
                categoria,
                unidade,
                marca,
                modelo,
                imagem: imagemFinal,
                ultimaAtualizacao: new Date().toISOString(),
            };

            const modeloAtualizado = await editModeloFirestore(selectedModelo.id, updates);

            setModelos(prev => prev.map(m => (m.id === selectedModelo.id ? modeloAtualizado : m)));

            setOriginalModelo(modeloAtualizado);
            setOriginalImagem(modeloAtualizado.imagem);
            setImagem(modeloAtualizado.imagem);

            setEditandoModelo(false);
            toast.success("Modelo atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar modelo:", error);
            toast.error("Erro ao salvar o modelo. Verifique o console.");
        } finally {
            setLoading(false);
        }
    };


    const handleSaveOrCadastrar = async () => {
        if (individuos.length === 0) {
            alert("Adicione pelo menos um item individual.");
            return;
        }

        setLoading(true);

        try {
            let novaImagem = "-";

            if (originalImagem && originalImagem !== "-" && originalImagem !== imagem) {
                await deleteImagem(originalImagem);
            }

            if (imagem && typeof imagem !== "string") {
                novaImagem = await uploadImagem(imagem);
            } else if (typeof imagem === "string") {
                novaImagem = imagem;
            } else {
                novaImagem = "-";
            }

            const individuoForm = individuos[0];

            let modeloFinal: ModeloPatrimonial | null = selectedModelo;
            let toastModeloMensagem = "";

            const criandoNovoModelo = !selectedModelo && nome.trim() && categoria.trim() && unidade.trim();

            if (criandoNovoModelo) {
                const modeloData: Omit<ModeloPatrimonial, "id" | "criador"> = {
                    nome: nome || "",
                    categoria: categoria || "",
                    unidade: unidade || "",
                    marca: marca || "",
                    modelo: modelo || "",
                    imagem: novaImagem,
                    createdAt: new Date().toISOString(),
                    ultimaAtualizacao: new Date().toISOString(),
                };

                const novoModelo = await addModeloFirestore(modeloData);
                modeloFinal = novoModelo;
                setModelos(prev => [...(prev || []), novoModelo]);
                toastModeloMensagem = "Novo modelo cadastrado! ";
            } else if (selectedModelo) {
                modeloFinal = { ...selectedModelo, imagem: novaImagem };
            }

            if (!modeloFinal) {
                throw new Error("Dados de modelo incompletos. Verifique Nome, Categoria e Unidade.");
            }

            if (isEdicao && patrimonioParaEdicao) {

                const updates: Partial<PatrimonioIndividual> = {
                    ...individuoForm,
                    modeloId: modeloFinal.id,
                };

                delete updates.id;

                const atualizado = await editPatrimonioIndividualFirestore(
                    patrimonioParaEdicao.id,
                    updates
                );

                setPatrimonios(prev =>
                    prev.map(p => (p.id === atualizado.id ? atualizado : p))
                );

                toast.success("Patrimônio editado com sucesso!");
                window.dispatchEvent(new Event("storageUpdate"));
                setTimeout(() => {
                    onCloseSuccess();
                }, 1000);
                return;
            }

            const patrimonioBase: Partial<PatrimonioIndividual> = {
                localizacao: "Depósito",
                status: "entrada",
                conservacao: "novo",
                modoAquisicao: "Cadastro manual",
            };

            const novosIndividuos: PatrimonioIndividual[] = [];
            const patrimoniosExistentes = [...(patrimonios || [])];

            for (const indiv of individuos) {
                const criado = await addPatrimonioIndividualFirestore(
                    modeloFinal,
                    {
                        ...patrimonioBase,
                        ...indiv,
                        modeloId: modeloFinal.id,
                    },
                    patrimoniosExistentes
                );

                patrimoniosExistentes.push(criado);
                novosIndividuos.push(criado);
            }

            const totalCadastrados = novosIndividuos.length;
            const plural = totalCadastrados > 1 ? "s" : "";
            const mensagem = `${toastModeloMensagem} ${totalCadastrados} patrimônio${plural} cadastrado${plural} com sucesso!`;

            toast.success(mensagem);
            window.dispatchEvent(new Event("storageUpdate"));
            setTimeout(() => {
                onCloseSuccess();
            }, 1000);
            return;

        } catch (err) {
            console.error("Erro ao salvar:", err);
            toast.error("Erro ao salvar. Verifique o console.");
        } finally {
            setLoading(false);
        }
    };

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


    const nomeModelosOptions: Option[] = limitarOptions(
        Array.from(new Set(modelos.map(m => m.nome))).map(c => ({
            label: c,
            value: c
        })),
        nome
    );

    const categoriasOptions: Option[] = limitarOptions(
        Array.from(new Set(modelos.map(m => m.categoria))).map(c => ({
            label: c,
            value: c
        })),
        categoria
    );

    const unidadeOptions: Option[] = limitarOptions(
        Array.from(new Set(modelos.map(m => m.unidade))).map(u => ({
            label: u,
            value: u
        })),
        unidade
    );


    const marcasOptions: Option[] = limitarOptions(
        Array.from(new Set(
            modelos.filter(m => m.categoria === categoria).map(m => m.marca)
        ))
            .filter(Boolean)
            .map(m => ({ label: m!, value: m! })),
        marca
    );

    const modelosOptions: Option[] = limitarOptions(
        Array.from(new Set(
            modelos
                .filter(m => m.categoria === categoria && m.marca === marca)
                .map(m => m.modelo)
        ))
            .filter(Boolean)
            .map(m => ({ label: m!, value: m! })),
        modelo
    );

    const todasLocalizacoesOptions: Option[] = useMemo(() => {
        return Array.from(new Set(patrimonios.map(p => p.localizacao).filter(Boolean)))
            .map(loc => ({
                label: loc,
                value: loc
            }));
    }, [patrimonios]);

    const handleSelectModelo = (val: string) => {
        setNome(val);

        const encontrado = modelos.find(m => m.nome.toLowerCase() === val.toLowerCase());

        if (encontrado) {
            setSelectedModelo(encontrado);
            setCategoria(encontrado.categoria);
            setUnidade(encontrado.unidade);
            setMarca(encontrado.marca || "");
            setModelo(encontrado.modelo || "");
            setImagem(encontrado.imagem || undefined);
        } else {
            setSelectedModelo(null);
            setCategoria("");
            setUnidade("");
            setMarca("");
            setModelo("");
            setImagem(undefined);
        }
    };



    function getBotaoTexto() {
        if (loading) return "Salvando...";

        const modeloSendoCriadoNaEdicao = isEdicao && !selectedModelo && nome.trim() && categoria.trim() && unidade.trim();

        if (editandoModelo) return "Salvar Edição do Modelo";

        if (modeloSendoCriadoNaEdicao) {
            return `Cadastrar novo modelo + Salvar Edição do Patrimônio`;
        }

        if (isEdicao) return "Salvar Edição do Patrimônio";

        if (modeloExiste) return `Cadastrar ${individuos.length} patrimônio(s)`;

        return `Cadastrar modelo + ${individuos.length} patrimônio(s)`;
    }
    const camposDesabilitados = !!selectedModelo && !editandoModelo;


    const isModeloCompletoParaCadastro = nome.trim() && categoria.trim() && unidade.trim();
    const temLocalizacaoInvalida = individuos.some(i => !i.localizacao?.trim());

    const isBotaoPrincipalDisabled = loading || temLocalizacaoInvalida || (!selectedModelo && !isModeloCompletoParaCadastro);


    return (
        <>

            {
                loading && (
                    <LoadingOverlay>
                        <Spinner />
                        <p>
                            {isEdicao && !editandoModelo
                                ? "Salvando edição do patrimônio..."
                                : editandoModelo
                                    ? "Salvando modelo..."
                                    : modeloExiste
                                        ? `Cadastrando ${individuos.length} patrimônio(s)...`
                                        : `Cadastrando modelo e ${individuos.length} patrimônio(s)...`
                            }
                        </p>
                    </LoadingOverlay>
                )
            }
            <Content>
                <FieldsWrapper>
                    <FormImagem>
                        <ImageInput
                            titulo="Imagem"
                            onChange={setImagem}
                            valorInicial={typeof imagem === "string" ? imagem : undefined}
                            disabled={camposDesabilitados}
                        />
                    </FormImagem>

                    <FormContent>

                        <Titulo title="Dados do Modelo do Patrimônio" align="center" />

                        <FormWrapper>

                            <TopBar>
                                {selectedModelo && !editandoModelo && (
                                    <ActionButton
                                        type="editar"
                                        func={handleIniciarEdicaoModelo}
                                    />
                                )}

                                {editandoModelo && (
                                    <div>
                                        <ActionButton
                                            type="cancelar"
                                            func={handleCancelarEdicaoModelo}
                                        />
                                    </div>
                                )}
                            </TopBar>

                            <Form>
                                <TextInput
                                    title="Nome do modelo"
                                    type="select-creatable"
                                    options={nomeModelosOptions}
                                    placeholder="Digite o nome..."
                                    value={nome}
                                    disabled={camposDesabilitados}
                                    onChange={setNome}
                                    onSelectOption={(val) => handleSelectModelo(val)}
                                    required
                                />

                                <TextInput title="Categoria" type="select-creatable" options={categoriasOptions} value={categoria} onChange={setCategoria} required disabled={camposDesabilitados} />
                                <TextInput title="Unidade de Medida" type="select-creatable" required options={unidadeOptions} value={unidade} onChange={setUnidade} disabled={camposDesabilitados} />
                                <TextInput title="Marca" type="select-creatable" options={marcasOptions} value={marca} onChange={setMarca} disabled={camposDesabilitados} />
                                <TextInput title="Modelo" type="select-creatable" options={modelosOptions} value={modelo} onChange={setModelo} disabled={camposDesabilitados} />
                            </Form>
                            {
                                editandoModelo && (
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "1em" }}>
                                        <AppButton
                                            text={loading ? "Salvando modelo..." : "Salvar modelo"}
                                            func={handleSalvarModelo}
                                            disabled={loading || !isModeloCompletoParaCadastro}
                                        />
                                    </div>
                                )
                            }
                        </FormWrapper>

                    </FormContent>

                </FieldsWrapper>

                {
                    !editandoModelo && (
                        <BottomButtom>
                            <AppButton
                                func={handleSaveOrCadastrar}
                                disabled={isBotaoPrincipalDisabled}
                                text={getBotaoTexto()}
                            />


                        </BottomButtom>
                    )
                }

                <AdicaoIndividual
                    patrimonios={individuos}
                    setPatrimonios={setIndividuos}
                    modelos={modelos}
                    setModelos={setModelos}
                    onClose={() => { }}
                    isEdicao={isEdicao}
                    todasLocalizacoesOptions={todasLocalizacoesOptions}
                />
            </Content>

        </>
    );
}

const FormContent = styled.div`
display: flex;
flex-direction: column;
flex-grow: 1; 
max-width: 600px;

    @media (max-width: 900px) {
        flex-direction: column;
        align-items: center; 
        max-width: 100%; 
        width: 100%; 
    }
`;

const Content = styled.div`
width: 90%;
padding: 1.5em;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
flex-wrap: wrap;

   @media (max-width: 500px) {
        padding: 0;
    }
`;

const FieldsWrapper = styled.div`
display: flex;
justify-content: space-between; 
align-items: flex-start;
max-width: 800px;
width: 100%;

@media (max-width: 800px) {
    flex-direction: column;
    align-items: center; 
    gap: 0.7em;
}
`;

const FormImagem = styled.div`
display: flex;
margin-bottom: 1em;
`;

const FormWrapper = styled.div`
    position: relative;
    background: #f9fafb;
    padding: 2.5em 1em 1em 1em; 
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    max-width: 600px; 
    flex-grow: 1;

    @media (max-width: 800px) {
        width: 100%; 
        max-width: 100%; 
        margin: 0 auto;
        padding: 2em 1.2em;
    }
`;


const Form = styled.div`
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 12px;
width: 100%;
max-width: 600px;
margin: 0 auto;

& > * {
 width: 100%;
 min-width: 0;
}

& > *:nth-last-child(1):nth-child(odd) {
 justify-self: center;
}

@media (max-width: 800px) {
 grid-template-columns: 1fr;
 max-width: 100%;
 padding: 0; 
}
`;

const BottomButtom = styled.div`
display: flex;
justify-content: center;
margin-top: 1em;
gap: 12px;
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

const TopBar = styled.div`
position: absolute;
top: 1em;
right: 1em;
display: flex;
gap: 6px;
`;