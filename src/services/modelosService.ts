import {
 collection,
 serverTimestamp,
 getDocs,
 getDoc,
 doc,
 setDoc,
 query,
 where,
 deleteDoc
} from "firebase/firestore";

import { db } from "../api/firebase/firebase";
import { getLoggedUserName } from "./authService";

import type {
 ModeloPatrimonial,
 PatrimonioIndividual
} from "../../src/types/patrimonioTypes";

import { mapPatrimonioFromFirestore } from "./mappers/patrimonioMapper";
import { normalizeModelKey } from "../api/helper/helpersFirestore";


export interface MovimentacaoMes {
    name: string;
    saldo: number; 
    patrimonio: number;
}

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function getMovimentacaoMensal(
  patrimonios: PatrimonioIndividual[],
  ano: number = new Date().getFullYear()
): MovimentacaoMes[] {

  const saldoMensal: number[] = Array(12).fill(0);
  const patrimonioMensal: number[] = Array(12).fill(0);

  const patrimoniosOrdenados = [...patrimonios].sort(
    (a, b) => new Date(a.dataAquisicao).getTime() - new Date(b.dataAquisicao).getTime()
  );

  let saldoAcumulado = 0;
  let patrimonioAcumulado = 0;

  const mesesPorAno: Record<number, { saldo: number[]; patrimonio: number[] }> = {};

  patrimoniosOrdenados.forEach(p => {
    const data = new Date(p.dataAquisicao);
    const mes = data.getMonth();
    const anoMov = data.getFullYear();
    const valor = Number(p.preco) || 0;
    const operacao = p.status === "entrada" ? 1 : -1;

    saldoAcumulado += valor * operacao;
    patrimonioAcumulado += 1 * operacao;

    if (!mesesPorAno[anoMov]) {
      mesesPorAno[anoMov] = { saldo: Array(12).fill(0), patrimonio: Array(12).fill(0) };
    }

    mesesPorAno[anoMov].saldo[mes] = saldoAcumulado;
    mesesPorAno[anoMov].patrimonio[mes] = patrimonioAcumulado;
  });

  const anosAnteriores = Object.keys(mesesPorAno)
    .map(Number)
    .filter(a => a < ano)
    .sort((a, b) => a - b);

  let saldoInicial = 0;
  let patrimonioInicial = 0;

  if (anosAnteriores.length) {
    const ultimoAno = anosAnteriores[anosAnteriores.length - 1];
    saldoInicial = mesesPorAno[ultimoAno].saldo[11];
    patrimonioInicial = mesesPorAno[ultimoAno].patrimonio[11];
  }

  if (!mesesPorAno[ano]) {
    mesesPorAno[ano] = { saldo: Array(12).fill(0), patrimonio: Array(12).fill(0) };
  }

  for (let i = 0; i < 12; i++) {
    saldoMensal[i] = mesesPorAno[ano].saldo[i] || (i > 0 ? saldoMensal[i - 1] : saldoInicial);
    patrimonioMensal[i] = mesesPorAno[ano].patrimonio[i] || (i > 0 ? patrimonioMensal[i - 1] : patrimonioInicial);
  }

  return MESES.map((m, i) => ({
    name: m,
    saldo: saldoMensal[i],
    patrimonio: patrimonioMensal[i],
  }));
}


export interface CategoriaQuantidade {
  name: string;
  value: number;
}

export async function getCategoriasComQuantidade(): Promise<CategoriaQuantidade[]> {
  const modelosSnap = await getDocs(collection(db, "modelos"));
  const patrimoniosSnap = await getDocs(collection(db, "patrimonioIndividual"));

  const modeloPorId: Record<string, string> = {};

  modelosSnap.forEach(doc => {
    const d = doc.data() as ModeloPatrimonial;
    if (d.id) modeloPorId[doc.id] = d.categoria || "Sem Categoria";
  });

  const contagem: Record<string, number> = {};

  patrimoniosSnap.forEach(doc => {
    const d = doc.data() as PatrimonioIndividual;

    const categoria = modeloPorId[d.modeloId] || "Sem Categoria";

    contagem[categoria] = (contagem[categoria] || 0) + 1;
  });

  return Object.entries(contagem).map(([name, value]) => ({ name, value }));
}


export async function getModeloById(id: string): Promise<ModeloPatrimonial> {
 const snap = await getDoc(doc(db, "modelos", id));
 if (!snap.exists()) throw new Error("Modelo patrimonial não encontrado.");

 const data = snap.data();
 if (!data) throw new Error("Dados do modelo inválidos.");

 return { id: snap.id, ...(data as Omit<ModeloPatrimonial, "id">) };
}

export async function getInitialDataFirestore() {
 const modelosSnap = await getDocs(collection(db, "modelos"));
 const patrimoniosSnap = await getDocs(collection(db, "patrimonioIndividual"));

 const modelos: ModeloPatrimonial[] = modelosSnap.docs.map(d => {
  const data = d.data();
  return {
   id: d.id,
   ...(data as Omit<ModeloPatrimonial, "id">)
  };
 });

 const patrimonios: PatrimonioIndividual[] = patrimoniosSnap.docs.map(d =>
  mapPatrimonioFromFirestore(d.id, d.data() ?? {})
 );

 return { initialModelos: modelos, initialPatrimonios: patrimonios };
}

export function gerarProximoPatrimonioId(
 patrimonios: PatrimonioIndividual[] = []
): string {
 if (!Array.isArray(patrimonios) || patrimonios.length === 0)
  return "00001";

 const maiores = patrimonios
  .map(p => Number(p.id))
  .filter(n => !isNaN(n));

 const maior = Math.max(...maiores);
 return (maior + 1).toString().padStart(5, "0");
}

export async function buscarModeloExistente(data: {
    nome: string;
    marca: string;
    modelo: string;
    categoria: string;
    unidade: string;
}): Promise<ModeloPatrimonial | null> {

    const keyAlvo = normalizeModelKey(data);
    const snap = await getDocs(collection(db, "modelos"));

    for (const doc of snap.docs) {
        const raw = doc.data() as Partial<ModeloPatrimonial>;

        const keyExistente = normalizeModelKey({
            nome: raw.nome ?? "",
            marca: raw.marca ?? "",
            modelo: raw.modelo ?? "",
            categoria: raw.categoria ?? "",
            unidade: raw.unidade ?? "",
        });

        if (keyExistente === keyAlvo) {
            return {
                id: doc.id,
                nome: raw.nome ?? "",
                categoria: raw.categoria ?? "",
                unidade: raw.unidade ?? "",
                marca: raw.marca ?? "",
                modelo: raw.modelo ?? "",
                imagem: raw.imagem ?? "",
                criador: raw.criador ?? "Desconhecido",
                createdAt: raw.createdAt ?? new Date().toISOString(),
                ultimaAtualizacao: raw.ultimaAtualizacao ?? new Date().toISOString(),
            };
        }
    }

    return null;
}



export async function addModeloFirestore(
    data: Omit<ModeloPatrimonial, "id" | "criador">
): Promise<ModeloPatrimonial> {

    const usuarioNome = await getLoggedUserName();

    const modeloRef = doc(collection(db, "modelos"));
    const novoModeloId = modeloRef.id;

    await setDoc(
        modeloRef,
        {
            ...data,
            id: novoModeloId,
            criador: usuarioNome,
            createdAt: serverTimestamp(),
            ultimaAtualizacao: serverTimestamp(),
        },
        { merge: true }
    );

    const snap = await getDoc(modeloRef);

    if (!snap.exists()) {
        throw new Error("Erro ao criar modelo no Firestore.");
    }

    return {
        ...(snap.data() as ModeloPatrimonial),
        id: novoModeloId
    };
}


export async function editModeloFirestore(
 modeloId: string,
 updates: Partial<ModeloPatrimonial>
): Promise<ModeloPatrimonial> {
 const usuarioNome = await getLoggedUserName();
 const ref = doc(db, "modelos", modeloId);

 const snap = await getDoc(ref);
 if (!snap.exists()) throw new Error("Modelo não encontrado.");

 await setDoc(
  ref,
  {
   ...updates,
   ultimaAtualizacao: serverTimestamp(),
   editor: usuarioNome
  },
  { merge: true }
 );

 const updated = await getDoc(ref);
 const updatedData = updated.data();
 if (!updatedData)
  throw new Error("Erro ao carregar modelo atualizado.");

 return { id: modeloId, ...(updatedData as Omit<ModeloPatrimonial, "id">) };
}

export async function deleteModeloFirestore(modeloId: string): Promise<void> {
 const ref = doc(db, "modelos", modeloId);
 const snap = await getDoc(ref);

 if (!snap.exists()) throw new Error("Modelo não encontrado.");

 const patrimoniosRef = collection(db, "patrimonios");
 const q = query(patrimoniosRef, where("modeloId", "==", modeloId));
 const patrimoniosSnap = await getDocs(q);

 const deletions = patrimoniosSnap.docs.map(d => deleteDoc(d.ref));
 await Promise.all(deletions);

 await deleteDoc(ref);
}