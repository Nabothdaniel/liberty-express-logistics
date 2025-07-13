// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useSetAtom } from 'jotai';
import { auth, db } from '../firebase/firebase';
import { userAtom } from '../atoms/authAtom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const setUser = useSetAtom(userAtom);
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
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
