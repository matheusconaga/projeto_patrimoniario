import { Timestamp, FieldValue, serverTimestamp } from "firebase/firestore";
import type { PatrimonioIndividual } from "../../types/patrimonioTypes";
import type { DocumentData } from "firebase/firestore";

export function mapPatrimonioFromFirestore(
  id: string,
  data: DocumentData
): PatrimonioIndividual {

  const toIso = (value: Timestamp | FieldValue | string | undefined): string => {
    if (typeof value === "string") {
      return value;
    }

    if (value instanceof Timestamp) {
      return value.toDate().toISOString();
    }

    if (value === serverTimestamp()) {
      return new Date().toISOString();
    }

    return new Date().toISOString();
  };

  return {
    id,
    modeloId: data.modeloId ?? "",
    localizacao: data.localizacao ?? "",
    conservacao: data.conservacao ?? "novo",
    status: data.status ?? "entrada",
    inventariante: data.inventariante ?? "",
    modoAquisicao: data.modoAquisicao ?? "",
    preco: data.preco ?? 0,
    observacoes: data.observacoes ?? "",
    dataAquisicao: toIso(data.dataAquisicao),
    ultimaAtualizacao: toIso(data.ultimaAtualizacao),
  };
}
