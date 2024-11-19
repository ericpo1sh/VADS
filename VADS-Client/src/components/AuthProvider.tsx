import { createContext, ReactNode } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebaseConfig'

const AuthContext = createContext({});

function register(email: string, password: string) {
  createUserWithEmailAndPassword(auth, email, password)
}

export function AuthProvider({children}: {children: ReactNode}) {
  return <AuthContext.Provider value={{register}}>
    {children}
  </AuthContext.Provider>
}
