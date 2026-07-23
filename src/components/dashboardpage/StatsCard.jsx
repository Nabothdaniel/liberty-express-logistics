import { useEffect, useState } from 'react';
import { FiSend, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useAuth } from '../../auth/useAuth';
import { db } from '../../firebase/firebase';
import {
  collection,
  query,
  where,
  getCountFromServer,
} from 'firebase/firestore';

const StatsCards = () => {
  const { user } = useAuth();
  const [totalFlights, setTotalFlights] = useState(0);
  const [arrivedFlights, setArrivedFlights] = useState(0);
  const [inFlightCount, setInFlightCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.uid) return;

      try {
        // Base query — admin sees all, user sees own
        const baseFilter =
          user.role === 'admin'
            ? collection(db, 'flights')
            : null;

        const userFilter = (status) =>
          user.role === 'admin'
            ? query(collection(db, 'flights'), where('status', '==', status))
            : query(
                collection(db, 'flights'),
                where('userId', '==', user.uid),
                where('status', '==', status)
              );

        const totalQ =
          user.role === 'admin'
            ? query(collection(db, 'flights'))
            : query(collection(db, 'flights'), where('userId', '==', user.uid));

        const [totalSnap, arrivedSnap, inFlightSnap] = await Promise.all([
          getCountFromServer(totalQ),
          getCountFromServer(userFilter('arrived')),
          getCountFromServer(userFilter('in_flight')),
        ]);

        setTotalFlights(totalSnap.data().count);
        setArrivedFlights(arrivedSnap.data().count);
        setInFlightCount(inFlightSnap.data().count);
      } catch (error) {
        console.error('Error fetching flight stats:', error);
      }
    };

    fetchStats();
  }, [user?.uid, user?.role]);

  const stats = [
    {
      title: 'Total Bookings',
      value: totalFlights,
      icon: FiSend,
    },
    {
      title: 'In Flight',
      value: inFlightCount,
      icon: FiClock,
    },
    {
      title: 'Arrived',
      value: arrivedFlights,
      icon: FiCheckCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <IconComponent className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
