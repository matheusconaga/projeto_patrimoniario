import { auth, db } from "../api/firebase/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import type { FirebaseError } from "firebase/app";


function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(trimmed);
}


function normalizeName(name: string) {
  return name
    .trim()
    .split(/\s+/) 
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function registerUser(name: string, email: string, password: string) {
  if (!isValidEmail(email)) {
    throw new Error("Email inválido.");
  }

  try {
    const normalizedEmail = normalizeEmail(email);
    const normalizedName = normalizeName(name);

    const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name: normalizedName,
      email: normalizedEmail,
      uid: user.uid,
      approved: false,
      createdAt: serverTimestamp(),
    });

    return user;
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err) {
      const fbErr = err as FirebaseError;
      throw fbErr;
    }
    throw err;
  }
}

export async function loginUser(email: string, senha: string) {
  if (!isValidEmail(email)) {
    throw new Error("Email inválido.");
  }

  const normalizedEmail = normalizeEmail(email);
  const res = await signInWithEmailAndPassword(auth, normalizedEmail, senha);

  const userDoc = await getDoc(doc(db, "users", res.user.uid));

  if (!userDoc.exists()) {
    throw new Error("Conta não encontrada no banco.");
  }

  const data = userDoc.data();

  if (!data.approved) {
    await signOut(auth);
    throw new Error("Sua conta ainda não foi aprovada pelo administrador.");
  }

  return res.user;
}


export async function getLoggedUserName(): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) return "Usuário";

  const userDoc = await getDoc(doc(db, "users", uid));
  const name = userDoc.data()?.name;

  return name ? normalizeName(name) : "Usuário";
}
