import { useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { useSetAtom } from 'jotai';
import { shipmentsAtom } from '../atoms/shipmentsAtom';
import { db } from '../firebase/firebase';
import { useAuth } from '../auth/useAuth';

export default function useShipments() {
  const setShipments = useSetAtom(shipmentsAtom);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) return;

    // Admin sees all flights; regular users see only their own
    const q = user.role === 'admin'
      ? query(collection(db, 'flights'), orderBy('createdAt', 'desc'))
      : query(
          collection(db, 'flights'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const flights = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShipments(flights);
    });

    return () => unsubscribe();
  }, [user?.uid, user?.role, setShipments]);
}
