"use client";

// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { useAuthStore } from '../store/authStore';
import { Plane } from 'lucide-react';

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUserState] = useState(null);

  useEffect(() => {
    // Ensure auth uses local persistence
    setPersistence(auth, browserLocalPersistence).then(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const idToken = await firebaseUser.getIdToken();
            const userDoc = doc(db, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userDoc);

            if (userSnap.exists()) {
              const userData = userSnap.data();
              const fullUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                ...userData,
              };

              setUser(fullUser);        
              setUserState(fullUser);   
              setToken(idToken);
            } else {
              console.warn("No user document found in Firestore.");
              setUser(null);
              setUserState(null);
              setToken(null);
            }
          } catch (error) {
            console.error("Failed to get user document:", error);
            setUser(null);
            setUserState(null);
            setToken(null);
          }
        } else {
          // No user signed in
          setUser(null);
          setUserState(null);
          setToken(null);
        }

        setLoading(false);
      });

      return () => unsubscribe();
    });
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, token, loading }}>
      {loading ? (
        <div className="flex items-center justify-center h-screen w-screen bg-[#F7F6F2] flex-col gap-4">
          <div className="relative flex items-center justify-center w-16 h-16">
            <div className="absolute w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute w-16 h-16 border-4 border-[#8A5A44] rounded-full border-t-transparent animate-spin"></div>
            <Plane className="w-6 h-6 text-[#8A5A44] absolute animate-pulse" />
          </div>
          <span className="text-gray-500 font-bold text-xs uppercase tracking-widest animate-pulse">Authenticating</span>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
