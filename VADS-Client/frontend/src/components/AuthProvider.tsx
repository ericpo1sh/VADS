import { auth } from '../../firebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User, UserCredential } from "firebase/auth"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"

const AuthContext = createContext<AuthContextType>({ register, logout, login })

type AuthContextType = {
  register: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<UserCredential>;
  user?: User | null; 
};

export const useAuth = () => useContext(AuthContext);

function register(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
};

function logout() {
  return auth.signOut();
};

function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    })
    return () => unsubscribe();
  }, [])

  return <AuthContext.Provider value={{ user, register, logout, login }}>{children}</AuthContext.Provider>
};
