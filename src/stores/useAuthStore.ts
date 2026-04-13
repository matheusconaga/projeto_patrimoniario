import { create } from "zustand";
import { auth, db } from "../api/firebase/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    useAuthStore.setState({ user: null, loading: false });
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));

    const isRegisterPage = window.location.pathname === "/register";

    if (!snap.exists() || snap.data().approved !== true) {
      if (!isRegisterPage) {
        await signOut(auth);
      }

      useAuthStore.setState({ user: null, loading: false });
      return;
    }

    const data = snap.data();

    useAuthStore.setState({
      user: {
        ...user,
        displayName: data.name,
      } as User,
      loading: false,
    });

  } catch (err) {
    console.error("Erro no onAuthStateChanged:", err);
    await signOut(auth).catch(() => {});
    useAuthStore.setState({ user: null, loading: false });
  }
});



