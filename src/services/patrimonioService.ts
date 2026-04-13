import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "../api/firebase/firebase";
import { getLoggedUserName } from "./authService";
import { Timestamp } from "firebase/firestore";

import type {
  PatrimonioIndividual,
  PatrimonioFirestore,
  ModeloPatrimonial,
} from "../types/patrimonioTypes";

import { mapPatrimonioFromFirestore } from "./mappers/patrimonioMapper";

export async function getInitialDataFirestore() {
  const modelosSnap = await getDocs(collection(db, "modelos"));
  const patrimonioSnap = await getDocs(collection(db, "patrimonioIndividual"));

  const modelos: ModeloPatrimonial[] = modelosSnap.docs.map(d => ({
    id: d.id,
    ...(d.data() as Omit<ModeloPatrimonial, "id">)
  }));

  const patrimonios: PatrimonioIndividual[] = patrimonioSnap.docs.map(d =>
    mapPatrimonioFromFirestore(d.id, d.data() as PatrimonioFirestore)
  );

  return { initialModelos: modelos, initialPatrimonios: patrimonios };
}

export function gerarProximoPatrimonioId(
  existentes: PatrimonioIndividual[] | undefined
): string {
  const existentesArray = existentes || [];
  
  const idsNumericos = existentesArray
    .map((p) => Number(p.id))
    .filter((n) => !isNaN(n));

  const proximo = idsNumericos.length > 0 ? Math.max(...idsNumericos) + 1 : 1;

  return String(proximo).padStart(5, "0"); 
}

function parsePreco(preco: string | number | undefined | null): number {
  if (preco == null) return 0;

  if (typeof preco === "number") return preco;

  const clean = preco.replace(/\D/g, "");
  if (clean.trim() === "") return 0;

  return Number(clean) / 100;
}


export async function addPatrimonioIndividualFirestore(
  modelo: ModeloPatrimonial,
  data: Partial<PatrimonioIndividual>,
  existentes: PatrimonioIndividual[]
): Promise<PatrimonioIndividual> {
  const usuarioNome = await getLoggedUserName();

  const novoId = gerarProximoPatrimonioId(existentes);

  const precoItem = parsePreco(data.preco ?? 0);

  const payload: PatrimonioFirestore = {
    id: novoId,
    modeloId: modelo.id,
    localizacao: data.localizacao || "Depósito",
    conservacao: data.conservacao || "novo",
    status: data.status || "entrada",
    inventariante: usuarioNome || "Automático",
    modoAquisicao: data.modoAquisicao || "Não informado",
    preco: precoItem || 0,
    observacoes: data.observacoes || "-",
    dataAquisicao: data.dataAquisicao
    ? Timestamp.fromDate(new Date(data.dataAquisicao))
    : serverTimestamp(),
    ultimaAtualizacao: serverTimestamp(),
  };

  const ref = doc(db, "patrimonioIndividual", novoId);
  await setDoc(ref, payload);

  const modeloRef = doc(db, "modelos", modelo.id);

  await updateDoc(modeloRef, {
    ultimaAtualizacao: serverTimestamp(),
  });
  
  const snap = await getDoc(ref);
  return mapPatrimonioFromFirestore(novoId, snap.data() as PatrimonioFirestore);
}

export async function editPatrimonioIndividualFirestore(
  id: string,
  updates: Partial<PatrimonioIndividual>
): Promise<PatrimonioIndividual> {
  const usuarioNome = await getLoggedUserName();
  const ref = doc(db, "patrimonioIndividual", id);

  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Patrimônio não encontrado.");

  const existingData = snap.data() as PatrimonioFirestore;

  const payload: Partial<PatrimonioFirestore> = {
    ...updates,
   dataAquisicao: updates.dataAquisicao
      ? Timestamp.fromDate(new Date(updates.dataAquisicao))
      : existingData.dataAquisicao,
    ultimaAtualizacao: serverTimestamp(),
    inventariante: usuarioNome,
  };

  await updateDoc(ref, payload);

  const newSnap = await getDoc(ref);
  return mapPatrimonioFromFirestore(id, newSnap.data() as PatrimonioFirestore);
}


export async function deletePatrimonioIndividualFirestore(
  id: string,
  modeloId: string
): Promise<void> {
  const ref = doc(db, "patrimonioIndividual", id);
  const modeloRef = doc(db, "modelos", modeloId);

  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Patrimônio não encontrado.");

  await deleteDoc(ref);

  await updateDoc(modeloRef, {
    ultimaAtualizacao: serverTimestamp(),
  });
}