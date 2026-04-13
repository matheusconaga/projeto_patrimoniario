import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { buscarModeloExistente } from "../../services/modelosService";
import type { ModeloPatrimonial, PatrimonioIndividual } from "../../types/patrimonioTypes";

export function normalizeModelKey(data: {
    nome: string;
    marca: string;
    modelo: string;
    categoria: string;
    unidade: string;
}) {
    const clean = (s: string) =>
        s
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") 
            .replace(/[\u200B-\u200D\uFEFF]/g, "") 
            .replace(/\s+/g, " ")
            .trim();

    return `${clean(data.nome)}-${clean(data.marca)}-${clean(data.modelo)}-${clean(data.categoria)}-${clean(data.unidade)}`;
}


export async function criarOuBuscarModelo(modelo: {
    nome: string;
    marca: string;
    modelo: string;
    categoria: string;
    unidade: string;
}): Promise<ModeloPatrimonial> {

    const existente = await buscarModeloExistente(modelo);
    if (existente) return existente;

    const now = Timestamp.now();

    const ref = await addDoc(collection(db, "modelos"), {
        ...modelo,
        criador: "Gerado automaticamente",
        createdAt: now,
        ultimaAtualizacao: now,
    });

    return {
        id: ref.id,
        ...modelo,
        criador: "Gerado automaticamente",
        createdAt: now.toDate().toISOString(),
        ultimaAtualizacao: now.toDate().toISOString(),
    };
}

export async function criarModeloFirestore(
    modeloData: Omit<ModeloPatrimonial, "id" | "criador">
): Promise<ModeloPatrimonial> {

    const now = Timestamp.now();

    const ref = await addDoc(collection(db, "modelos"), {
        ...modeloData,
        createdAt: now,
        ultimaAtualizacao: now,
        criador: "Gerado automaticamente",
    });

    return {
        id: ref.id,
        ...modeloData,
        criador: "Gerado automaticamente",
        createdAt: now.toDate().toISOString(),
        ultimaAtualizacao: now.toDate().toISOString(),
    };
}

export async function criarPatrimonioFirestore(
    p: Omit<PatrimonioIndividual, "id">
): Promise<PatrimonioIndividual> {

    const now = Timestamp.now();

    const ref = await addDoc(collection(db, "patrimonios"), {
        ...p,
        ultimaAtualizacao: now,
    });

    return {
        id: ref.id,
        ...p,
        ultimaAtualizacao: now.toDate().toISOString(),
    };
}
