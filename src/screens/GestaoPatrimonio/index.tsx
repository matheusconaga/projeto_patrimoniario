import styled from "styled-components";
import { toast } from "react-toastify";
import Container from "../../components/layout/Container";
import AppButton from "../../components/basics/AppButton";
import { COLORS } from "../../constants/colors";
import { CircleCheck, Delete, Funnel, Plus, Printer, Square, SquareCheckBig, Tag, Upload, X } from "lucide-react";
import Titulo from "../../components/layout/Titulo";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import StatusCard from "../../components/layout/StatusCard";
import Tabela from "../../components/basics/Tabela";
import type { JSX } from "react";

import type { ModeloPatrimonial, PatrimonioIndividual } from "../../types/patrimonioTypes";
import { formatarData } from "../../utils/dataUtils";
import ActionButton from "../../components/basics/ActionButton";

import { addPatrimonioIndividualFirestore, getInitialDataFirestore } from "../../services/patrimonioService";
import Modal from "../../components/layout/Modal";
import { AdicaoPatrimonio } from "../AdicaoPatrimonio";
import DetalhesPatrimonio from "../Detalhes";
import EtiquetasPage from "../EtiquetasPage";
import Filter from "../../components/layout/Filter";
import ExcelJS from 'exceljs';
import { addModeloFirestore, buscarModeloExistente } from "../../services/modelosService";
import { normalizeModelKey } from "../../api/helper/helpersFirestore";


type ExcelCellValue = string | number | Date | null;


interface Filtros {
    id: string;
    nome: string;
    categoria: string;
    conservacao: string;
    localizacao: string;
    status: string;
    dataAquisicaoInicio: string;
    dataAquisicaoFim: string;
}


interface Row {
    id: string;
    cells: (string | number | JSX.Element)[];
}

interface PatrimonioSelecionado {
    tipo: "patrimonio" | "edicao";
    data: PatrimonioIndividual;
}

export default function GestaoPatrimonio() {
    const [loading, setLoading] = useState(true);

    // PATRIMONIO
    const [modelos, setModelos] = useState<ModeloPatrimonial[]>([]);
    const [patrimonios, setPatrimonios] = useState<PatrimonioIndividual[]>([]);


    // CRUD
    const [openAddPatrimonio, setOpenAddPatrimonio] = useState(false);
    const [openEdicaoPatrimonio, setOpenEdicaoPatrimonio] = useState(false);
    const [openDetalhes, setOpenDetalhes] = useState(false);
    const [patrimonioSelecionado, setPatrimonioSelecionado] = useState<PatrimonioSelecionado | null>(null);


    // ETIQUETAS
    const [idsEtiqueta, setIdsEtiqueta] = useState<string[]>([]);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selecionados, setSelecionados] = useState<string[]>([]);
    const [openEtiqueta, setOpenEtiqueta] = useState(false);


    const [isToastOpen, setIsToastOpen] = useState(false);
    const [fechamentoPorSucesso, setFechamentoPorSucesso] = useState(false);
    const [loadingFiltro, setLoadingFiltro] = useState(false);


    //Filtragem
    const [filtrosTemp, setFiltrosTemp] = useState<Filtros>({
        id: "",
        nome: "",
        categoria: "",
        conservacao: "",
        localizacao: "",
        status: "",
        dataAquisicaoInicio: "",
        dataAquisicaoFim: "",
    });

    const [filtrosAtivos, setFiltrosAtivos] = useState<Filtros>(filtrosTemp);

    const patrimoniosFiltrados = useMemo(() => {
        return patrimonios.filter(p => {
            const modelo = modelos.find(m => m.id === p.modeloId);

            const inicio = filtrosAtivos.dataAquisicaoInicio
                ? new Date(filtrosAtivos.dataAquisicaoInicio).getTime()
                : null;

            const fim = filtrosAtivos.dataAquisicaoFim
                ? new Date(filtrosAtivos.dataAquisicaoFim).getTime()
                : null;

            const dataPat = p.dataAquisicao ? new Date(p.dataAquisicao).getTime() : null;

            if (filtrosAtivos.id && !p.id.includes(filtrosAtivos.id)) return false;
            if (filtrosAtivos.nome && !(modelo?.nome.toLowerCase().includes(filtrosAtivos.nome.toLowerCase()))) return false;
            if (filtrosAtivos.categoria && !(modelo?.categoria.toLowerCase().includes(filtrosAtivos.categoria.toLowerCase()))) return false;
            if (filtrosAtivos.conservacao && p.conservacao !== filtrosAtivos.conservacao) return false;
            if (filtrosAtivos.localizacao && !p.localizacao.toLowerCase().includes(filtrosAtivos.localizacao.toLowerCase())) return false;
            if (filtrosAtivos.status && p.status !== filtrosAtivos.status) return false;

            if (inicio && dataPat && dataPat < inicio) return false;
            if (fim && dataPat && dataPat > fim) return false;

            return true;
        });
    }, [patrimonios, modelos, filtrosAtivos]);

    function aplicarFiltro() {
        setLoadingFiltro(true);

        setTimeout(() => {
            setFiltrosAtivos(filtrosTemp);
            setLoadingFiltro(false);
        }, 500);
    }


    useEffect(() => {
        const fetchFirestoreData = async () => {
            try {
                setLoading(true);
                const { initialModelos, initialPatrimonios } = await getInitialDataFirestore();
                setModelos(initialModelos);
                setPatrimonios(initialPatrimonios);
            } catch (error) {
                console.error("Erro ao buscar dados do Firestore:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFirestoreData();
    }, []);

    useEffect(() => {
        const atualizar = () => {
            setLoading(true);
            getInitialDataFirestore().then(({ initialModelos, initialPatrimonios }) => {
                setModelos(initialModelos);
                setPatrimonios(initialPatrimonios);
                setLoading(false);
            });
        };

        window.addEventListener("storageUpdate", atualizar);
        return () => window.removeEventListener("storageUpdate", atualizar);
    }, []);


    //READ
    const visualizar = useCallback((id: string) => {
        const patrimonio = patrimonios.find(i => i.id === id);
        if (patrimonio) {
            setPatrimonioSelecionado({ tipo: "patrimonio", data: patrimonio });
            setOpenDetalhes(true);
        }
    }, [patrimonios]);

    // UPDATE
    const editar = useCallback((id: string) => {
        const patrimonio = patrimonios.find(i => i.id === id);
        if (patrimonio) {
            setPatrimonioSelecionado({ tipo: "edicao", data: patrimonio });
            setOpenEdicaoPatrimonio(true);
        }
    }, [patrimonios]);

    // ETIQUETA
    const gerarEtiqueta = useCallback(
        (ids?: string | string[]) => {
            let etiquetas: string[] = [];
            if (typeof ids === "string") etiquetas = [ids];
            else if (Array.isArray(ids) && ids.length > 0) etiquetas = ids;

            if (etiquetas.length > 0) {
                setIdsEtiqueta(etiquetas);
                setOpenEtiqueta(true);
                setSelectionMode(false);
            } else {
                alert("Nenhum patrimônio selecionado para gerar etiquetas.");
            }
        },
        []
    );

    function normalizeConservacao(
        valor: string
    ): "novo" | "bom" | "regular" | "ruim" {
        const v = valor.trim().toLowerCase();
        const valid = ["novo", "bom", "regular", "ruim"] as const;

        return (valid as ReadonlyArray<string>).includes(v)
            ? (v as "novo" | "bom" | "regular" | "ruim")
            : "bom";
    }


    function normalizeStatus(valor: string): "entrada" | "saida" {
        const v = valor.trim().toLowerCase();
        return v === "saida" ? "saida" : "entrada";
    }

    const fileInputRef = useRef<HTMLInputElement>(null);

    function excelSerialToJSDate(serial: number): Date {
        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
        return new Date(excelEpoch.getTime() + serial * 86400000);
    }

    function parseExcelDate(value: ExcelCellValue): string | null {
        if (value == null) return null;

        const toLocal8amIso = (y: number, mZeroBased: number, d: number) => {
            const local = new Date(y, mZeroBased, d, 8, 0, 0, 0);
            return local.toISOString();
        };

        if (typeof value === "number") {
            const dt = excelSerialToJSDate(value);
            const y = dt.getUTCFullYear();
            const m = dt.getUTCMonth();
            const d = dt.getUTCDate();
            return toLocal8amIso(y, m, d);
        }

        if (value instanceof Date) {
            const y = value.getFullYear();
            const m = value.getMonth();
            const d = value.getDate();
            return toLocal8amIso(y, m, d);
        }

        if (typeof value === "string") {
            const parts = value.split("/");
            if (parts.length !== 3) return null;
            const day = Number(parts[0]);
            const month = Number(parts[1]) - 1;
            const year = Number(parts[2]);
            if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null;
            return toLocal8amIso(year, month, day);
        }

        return null;
    }

    const importExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const toastId = toast.loading("Preparando importação...");

            const workbook = new ExcelJS.Workbook();
            const buffer = await file.arrayBuffer();
            await workbook.xlsx.load(buffer);

            const sheet = workbook.getWorksheet(1);
            if (!sheet) {
                toast.error("Planilha não encontrada!");
                return;
            }

            const { initialModelos, initialPatrimonios } = await getInitialDataFirestore();

            const modelosCache = new Map<string, Promise<ModeloPatrimonial>>();

            for (const m of initialModelos) {
                const key = normalizeModelKey({
                    nome: m.nome,
                    marca: m.marca ?? "",
                    modelo: m.modelo ?? "",
                    categoria: m.categoria,
                    unidade: m.unidade,
                });

                modelosCache.set(key, Promise.resolve(m));
            }

            const patrimoniosExistentes = initialPatrimonios;

            let totalValidas = 0;

            for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
                const row = sheet.getRow(rowNumber);
                const rawValues = Array.isArray(row.values)
                    ? row.values
                    : Object.values(row.values);

                const clean = rawValues.slice(1);
                const isEmpty = clean.every(
                    v =>
                        v === null ||
                        v === undefined ||
                        v === "" ||
                        (typeof v === "number" && isNaN(v))
                );
                if (!isEmpty) totalValidas++;
            }

            let atual = 0;

            for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
                const row = sheet.getRow(rowNumber);

                const rawValues = Array.isArray(row.values)
                    ? row.values
                    : Object.values(row.values);

                const cleanValues = rawValues.slice(1) as ExcelCellValue[];
                const isEmpty = cleanValues.every(
                    v =>
                        v === null ||
                        v === undefined ||
                        v === "" ||
                        (typeof v === "number" && isNaN(v))
                );
                if (isEmpty) continue;

                atual++;

                toast.update(toastId, {
                    render: `Enviando ${atual} de ${totalValidas}...`,
                    isLoading: true,
                });

                const linha = {
                    imagem: String(row.getCell(1).value ?? ""),
                    nome: String(row.getCell(2).value ?? ""),
                    categoria: String(row.getCell(3).value ?? ""),
                    unidade: String(row.getCell(4).value ?? ""),
                    marca: String(row.getCell(5).value ?? ""),
                    modelo: String(row.getCell(6).value ?? ""),

                    localizacao: String(row.getCell(7).value ?? ""),
                    conservacao: String(row.getCell(8).value ?? ""),
                    dataaquisicao: parseExcelDate(row.getCell(9).value as ExcelCellValue),
                    modoaquisicao: String(row.getCell(10).value ?? ""),
                    preco: Number(row.getCell(11).value ?? 0),
                    obs: String(row.getCell(12).value ?? ""),
                    status: String(row.getCell(13).value ?? "entrada"),
                };

                linha.nome = linha.nome.trim();
                linha.marca = linha.marca.trim();
                linha.modelo = linha.modelo.trim();
                linha.categoria = linha.categoria.trim();
                linha.unidade = linha.unidade.trim();

                if (linha.marca === "undefined") linha.marca = "";
                if (linha.modelo === "undefined") linha.modelo = "";
                if (linha.unidade === "undefined") linha.unidade = "";

                const modeloKey = normalizeModelKey({
                    nome: linha.nome,
                    marca: linha.marca,
                    modelo: linha.modelo,
                    categoria: linha.categoria,
                    unidade: linha.unidade
                });

                if (!modelosCache.has(modeloKey)) {
                    const promessaModelo = (async () => {
                        const existente = await buscarModeloExistente({
                            nome: linha.nome,
                            marca: linha.marca,
                            modelo: linha.modelo,
                            categoria: linha.categoria,
                            unidade: linha.unidade,
                        });

                        if (existente) return existente;

                        const criado = await addModeloFirestore({
                            nome: linha.nome,
                            marca: linha.marca,
                            modelo: linha.modelo,
                            categoria: linha.categoria,
                            unidade: linha.unidade,
                            imagem: linha.imagem || "-",
                            createdAt: new Date().toISOString(),
                            ultimaAtualizacao: new Date().toISOString(),
                        });

                        modelosCache.set(modeloKey, Promise.resolve(criado));
                        return criado;
                    })();

                    modelosCache.set(modeloKey, promessaModelo);
                }

                const modeloFinal = await modelosCache.get(modeloKey)!;

                const novo = await addPatrimonioIndividualFirestore(
                    modeloFinal,
                    {
                        localizacao: linha.localizacao,
                        conservacao: normalizeConservacao(linha.conservacao),
                        status: normalizeStatus(linha.status),
                        modoAquisicao: linha.modoaquisicao,
                        preco: linha.preco,
                        observacoes: linha.obs,
                        dataAquisicao: linha.dataaquisicao ?? new Date().toISOString(),
                    },
                    patrimoniosExistentes
                );

                patrimoniosExistentes.push(novo);
            }

            toast.update(toastId, {
                render: "Importação concluída 🎉",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });

            window.dispatchEvent(new Event("storageUpdate"));

        } catch (err) {
            console.error("Erro ao importar Excel:", err);
            toast.error("Erro ao importar o arquivo!");
        }
    };



    const exportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Patrimonios');

        worksheet.columns = [
            // === DADOS DO MODELO ===
            { header: 'Imagem do Patrimonio', key: 'imagem', width: 25 },
            { header: 'Patrimônio', key: 'nome', width: 20 },
            { header: 'Categoria', key: 'categoria', width: 15 },
            { header: 'Unidade de Medida', key: 'unidade', width: 20 },
            { header: 'Marca', key: 'marca', width: 15 },
            { header: 'Modelo', key: 'modelo', width: 15 },

            // === DADOS DO PATRIMÔNIO INDIVIDUAL ===
            { header: 'Localização', key: 'localizacao', width: 15 },
            { header: 'Conservação', key: 'conservacao', width: 12 },
            { header: 'Data de Aquisição', key: 'data', width: 15 },
            { header: 'Modo de Aquisição', key: 'modo', width: 18 },
            { header: 'Preço', key: 'preco', width: 12 },
            { header: 'Observações', key: 'obs', width: 30 },
            { header: 'Status', key: 'status', width: 12 },
        ];

        const headerRow = worksheet.getRow(1);
        headerRow.height = 20;
        headerRow.eachCell(cell => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0090D7' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        worksheet.views = [{ state: 'frozen', ySplit: 1 }];

        patrimoniosFiltrados.forEach((patrimonio) => {
            const modelo = modelos.find(m => m.id === patrimonio.modeloId);
            const row = worksheet.addRow({
                // === MODELO ===
                imagem: modelo?.imagem || '',
                nome: modelo?.nome || '',
                categoria: modelo?.categoria || '',
                unidade: modelo?.unidade || '',
                marca: modelo?.marca || '',
                modelo: modelo?.modelo || '',

                // === PATRIMÔNIO ===
                localizacao: patrimonio.localizacao || '',
                conservacao: patrimonio.conservacao || '',
                data: patrimonio.dataAquisicao
                    ? new Date(patrimonio.dataAquisicao).toLocaleDateString()
                    : '',
                modo: patrimonio.modoAquisicao || '',
                preco: patrimonio.preco || 0,
                obs: patrimonio.observacoes || '',
                status: patrimonio.status || '',
            });

            const color = patrimonio.status?.toLowerCase() === 'entrada' ? 'FFCCFFCC'
                : patrimonio.status?.toLowerCase() === 'saida' ? 'FFFFCCCC'
                    : undefined;

            if (color) {
                row.eachCell(cell => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
                });
            }
        });

        const uint8Array = await workbook.xlsx.writeBuffer();

        const excelBlob = new Blob([uint8Array], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        if (typeof window.showSaveFilePicker === 'function') {
            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName: 'patrimonios.xlsx',
                    types: [
                        { description: 'Planilha Excel', accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] } }
                    ]
                });
                const writable = await handle.createWritable();
                await writable.write(excelBlob);
                await writable.close();
                return;
            } catch (error) {
                console.error('Erro ao salvar o arquivo:', error);
                return;
            }
        }

        const link = document.createElement('a');
        link.href = URL.createObjectURL(excelBlob);
        link.download = 'patrimonios.xlsx';
        link.click();
        URL.revokeObjectURL(link.href);
    };



    const columns = [
        { title: "ID Patrimônio" },
        { title: "Patrimônio" },
        { title: "Categoria" },
        { title: "Localização" },
        { title: "Conservação" },
        { title: "Status" },
        { title: "Data Aquisição" },
        { title: "Ações" },
    ];

    const rows: Row[] = useMemo(() => {
        return patrimoniosFiltrados
            .slice()
            .sort((a, b) => {
                const [, numA] = a.id.split("-").map(Number);
                const [, numB] = b.id.split("-").map(Number);
                return numA - numB;
            })
            .map(p => {
                const modelo = modelos.find(m => m.id === p.modeloId);
                return {
                    id: p.id,
                    cells: [
                        p.id,
                        modelo?.nome || "-",
                        modelo?.categoria || "-",
                        p.localizacao,
                        <StatusCard key={`${p.id}-cond`} type={p.conservacao} />,
                        <StatusCard key={`${p.id}-status`} type={p.status} />,
                        formatarData(p.dataAquisicao),
                        <Actions key={`${p.id}-acoes`}>
                            <ActionButton type="visualizar" func={() => visualizar(p.id)} />
                            <ActionButton type="editar" func={() => editar(p.id)} />
                            <ActionButton type="etiqueta" func={() => gerarEtiqueta(p.id)} />
                        </Actions>,
                    ],
                };
            });
    }, [patrimoniosFiltrados, modelos, visualizar, editar, gerarEtiqueta]);


    const handleCloseCRUD = () => {
        setOpenAddPatrimonio(false);
        setOpenEdicaoPatrimonio(false);
        setFechamentoPorSucesso(false);
        setOpenDetalhes(false);
    };

    const handleCloseSuccess = () => {
        setFechamentoPorSucesso(true);
        handleCloseCRUD();
    };

    const allIds = useMemo(() => rows.map((r) => r.id), [rows]);
    const allSelected = selecionados.length === allIds.length && allIds.length > 0;


    const cancelarSelecao = () => {
        setSelectionMode(false);
        setSelecionados([]);
    };

    const getModalType = () => {
        if (openAddPatrimonio) return "Adição";
        if (openEdicaoPatrimonio) return "Edição";
        return "Modal";
    };

    const tipoModal = getModalType();

    const handleRequestClose = () => {
        if (fechamentoPorSucesso) {
            handleCloseCRUD();
            return;
        }

        if (isToastOpen) return;

        setIsToastOpen(true);

        const mensagem = tipoModal === "Adição"
            ? "Deseja realmente fechar o modal de Adição?"
            : `Deseja realmente fechar o modal de Edição?`;


        const id = toast.warning(
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    paddingRight: "16px",
                    textAlign: "center",
                    alignItems: "center",
                }}
            >
                <Titulo title="Você possui alterações não salvas." align="center" marginBottom="0" />
                <span>{mensagem}</span>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        width: "100%",
                    }}
                >

                    <AppButton
                        text="Fechar"
                        color={COLORS.danger_card}
                        icon={<X size={20} />}
                        func={() => {
                            toast.dismiss(id);
                            handleCloseCRUD();
                        }}
                    />

                    <AppButton
                        text="Ficar"
                        icon={<CircleCheck size={20} />}
                        func={() => {
                            toast.dismiss(id);
                        }}
                    />

                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                style: {
                    textAlign: "center",
                },
                onClose: () => setIsToastOpen(false),
            }
        );
    };

    const [abrirFiltros, setAbrirFiltros] = useState(false);


    return (
        <>
            {loading && (
                <LoadingOverlay>
                    <Spinner />
                    <p>Carregando dados...</p>
                </LoadingOverlay>
            )}
            <FilterWrapper visible={abrirFiltros}>
                <Container>
                    <Filter
                        patrimonios={patrimonios}
                        modelos={modelos}
                        filtros={filtrosTemp}
                        setFiltros={setFiltrosTemp}
                        onLimpar={() => {
                            const filtrosZerados: Filtros = {
                                id: "",
                                nome: "",
                                categoria: "",
                                conservacao: "",
                                localizacao: "",
                                status: "",
                                dataAquisicaoInicio: "",
                                dataAquisicaoFim: "",
                            };
                            setFiltrosTemp(filtrosZerados);
                            setFiltrosAtivos(filtrosZerados);
                        }}
                        onFechar={() => {
                            const filtrosZerados: Filtros = {
                                id: "",
                                nome: "",
                                categoria: "",
                                conservacao: "",
                                localizacao: "",
                                status: "",
                                dataAquisicaoInicio: "",
                                dataAquisicaoFim: "",
                            };
                            setFiltrosTemp(filtrosZerados);
                            setFiltrosAtivos(filtrosZerados);
                            setAbrirFiltros(false);
                        }}
                        onFiltrar={aplicarFiltro}
                        loading={loadingFiltro}
                    />
                </Container>
            </FilterWrapper>



            <Container>
                <TopItens>
                    <Titulo title="Gestão do Patrimônio" />
                    {!selectionMode ? (
                        <Botoes>
                            {!abrirFiltros && (
                                <AppButton
                                    icon={<Funnel size={20} />}
                                    text="Filtros"
                                    func={() => setAbrirFiltros(true)}
                                />
                            )}

                            <AppButton
                                text="Gerar várias etiquetas"
                                func={() => setSelectionMode(true)}
                                icon={<Tag size={20} />}
                                color={COLORS.new_card}
                            />
                            <input
                                type="file"
                                accept=".xlsx"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={importExcel}
                            />

                            <AppButton
                                text="Upload de arquivo"
                                func={() => fileInputRef.current?.click()}
                                icon={<Upload size={20} />}
                                color={COLORS.seccundary}
                            />
                            <AppButton
                                text="Adicionar Patrimônio"
                                func={() => setOpenAddPatrimonio(true)}
                                icon={<Plus size={20} />}
                            />
                        </Botoes>
                    ) : (
                        <SelectionControls>
                            <span>{selecionados.length} selecionado(s)</span>
                            <AppButton text="Cancelar" func={cancelarSelecao} color={COLORS.cancel_card} icon={<Delete size={20} />} />
                            <AppButton
                                text={allSelected ? "Desmarcar tudo" : "Selecionar tudo"}
                                func={() => (allSelected ? setSelecionados([]) : setSelecionados(allIds))}
                                icon={allSelected ? <SquareCheckBig size={20} /> : <Square size={20} />}
                                color={COLORS.seccundary}
                            />
                            <AppButton
                                text="Gerar Etiquetas Selecionadas"
                                icon={<Tag size={20} />}
                                func={() => {
                                    if (!selecionados.length) alert("Nenhum patrimônio selecionado para gerar etiquetas.");
                                    else gerarEtiqueta(selecionados);
                                }}
                                color={COLORS.primary}
                            />
                        </SelectionControls>
                    )}
                </TopItens>

                <WrapperTabela>
                    {loading ? (
                        <LoadingOverlay>
                            <Spinner />
                            <span>Carregando dados...</span>
                        </LoadingOverlay>
                    ) : (
                        <Tabela
                            columns={columns}
                            rows={rows}
                            showCheckboxes={selectionMode}
                            selecionados={selecionados}
                            onSelecionar={setSelecionados}
                        />

                    )}

                    {!selectionMode && !loading && (
                        <BottomButtons>
                            <AppButton
                                text="Imprimir"
                                func={exportExcel}
                                icon={<Printer size={20} />}
                                color={COLORS.seccundary}
                            />
                        </BottomButtons>
                    )}
                </WrapperTabela>
            </Container>

            <Modal
                isOpen={!!openAddPatrimonio}
                onClose={handleCloseCRUD}
                onRequestClose={handleRequestClose}
                title="Adicionar Patrimônio"
                width="80%"
            >
                <AdicaoPatrimonio
                    modelos={modelos}
                    patrimonios={patrimonios}
                    setModelos={setModelos}
                    setPatrimonios={setPatrimonios}
                    onCloseSuccess={handleCloseSuccess}
                />
            </Modal>

            <Modal
                isOpen={openEdicaoPatrimonio}
                onRequestClose={handleRequestClose}
                onClose={handleCloseCRUD}
                title={`Editar Patrimônio ${patrimonioSelecionado?.data?.id}`}
                width="80%"
            >

                {patrimonioSelecionado?.tipo === "edicao" && patrimonioSelecionado.data && (
                    <AdicaoPatrimonio
                        modelos={modelos}
                        patrimonios={patrimonios}
                        setModelos={setModelos}
                        setPatrimonios={setPatrimonios}
                        onCloseSuccess={handleCloseSuccess}
                        patrimonioParaEdicao={patrimonioSelecionado.data}
                    />
                )}
            </Modal>

            <Modal
                isOpen={openDetalhes}
                onClose={() => setOpenDetalhes(false)}
                title="Detalhes do Patrimônio"
                width="60%"
            >
                {patrimonioSelecionado?.tipo === "patrimonio" && patrimonioSelecionado.data && (
                    <DetalhesPatrimonio
                        patrimonio={patrimonioSelecionado.data}
                        modelo={modelos.find(m => m.id === patrimonioSelecionado.data.modeloId)}
                    />
                )}
            </Modal>

            <Modal
                isOpen={openEtiqueta}
                onClose={() => { setOpenEtiqueta(false); setIdsEtiqueta([]); setSelecionados([]); }}
                title="Pré-visualização de etiquetas"
            >
                {idsEtiqueta.length ? <EtiquetasPage ids={idsEtiqueta} patrimonios={patrimonios} /> : <p style={{ textAlign: "center", color: COLORS.gray }}>Nenhum item selecionado.</p>}
            </Modal>
        </>
    );
}

const TopItens = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.4em;
    width: 100%;
    
    @media (max-width: 800px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1em;
        margin-bottom: 1.5em;
    }
`;

const Botoes = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    @media (max-width: 800px) {
        width: 100%;
        justify-content: space-between;
        
        button {
            flex: 1;
        }
    }

    @media (max-width: 500px) {
        flex-direction: column;

        button {
            width: 100%;
        }
    }
`;

const WrapperTabela = styled.div`
    width: 100%;
    position: relative; 
    min-height: 200px;
`;

const BottomButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 1em;
`;

const Actions = styled.div`
    display: flex;
    gap: 8px;
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

const SelectionControls = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;

    span {
        font-weight: bold;
    }

    @media (max-width: 800px) {
        width: 100%;
        justify-content: space-between;
        flex-wrap: wrap;

        span {
            flex-basis: 100%; 
            text-align: center;
        }

        button {
            flex: 1;
        }
    }

    @media (max-width: 500px) {
        flex-direction: column;

        button {
            width: 100%;
        }
    }
`;
const FilterWrapper = styled.div<{ visible: boolean }>`
  width: 100%;
  transition: all 0.3s ease;
  
  max-height: ${({ visible }) => (visible ? "1000px" : "0px")};
  overflow: ${({ visible }) => (visible ? "visible" : "hidden")};

  @media (max-width: 768px) {
    margin-bottom: ${({ visible }) => (visible ? "20px" : "0px")};
  }
`;


