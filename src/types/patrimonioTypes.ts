import { Timestamp, FieldValue } from "firebase/firestore";


export type Categoria = {
  id: string;
  nome: string;
};

export type ModeloPatrimonial = {
  id: string;
  nome: string;
  categoria: string;
  unidade: string;
  marca?: string;
  modelo?: string;
  criador: string;
  imagem?: string;
  createdAt: string;
  ultimaAtualizacao: string;
};

export type PatrimonioIndividual = {
  id: string;
  modeloId: string;
  localizacao: string;
  conservacao: "novo" | "bom" | "regular" | "ruim";
  status: "entrada" | "saida";
  preco?: number;
  modoAquisicao?: string;
  observacoes?: string;
  inventariante: string;
  dataAquisicao: string;
  ultimaAtualizacao: string;
};


export type PatrimonioFirestore = {
  id: string;
  modeloId: string;
  localizacao: string;
  conservacao: "novo" | "bom" | "regular" | "ruim";
  status: "entrada" | "saida";
  inventariante: string;
  modoAquisicao: string;
  preco: number;
  observacoes?: string;
  dataAquisicao: Timestamp | FieldValue;
  ultimaAtualizacao: Timestamp | FieldValue;
};