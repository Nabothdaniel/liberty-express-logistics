import { useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useSetAtom } from 'jotai';
import { shipmentsAtom } from '../atoms/shipmentsAtom';
import { db } from '../firebase/firebase';
import { useAuth } from '../auth/useAuth';

export default function useShipments() {
  const setShipments = useSetAtom(shipmentsAtom);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(collection(db, 'shipments'), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const shipments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShipments(shipments);
    });

    return () => unsubscribe();
  }, [user?.uid, setShipments]);
}
