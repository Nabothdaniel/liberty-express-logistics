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
      bgColor: 'bg-[#C8C6FF]', // Soft purple
      iconBg: 'border-black/10 text-gray-800'
    },
    {
      title: 'In Flight',
      value: inFlightCount,
      icon: FiClock,
      bgColor: 'bg-[#E3E7ED]', // Soft gray
      iconBg: 'border-black/10 text-gray-800'
    },
    {
      title: 'Arrived',
      value: arrivedFlights,
      icon: FiCheckCircle,
      bgColor: 'bg-[#FADDE4]', // Soft pink
      iconBg: 'border-black/10 text-gray-800'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className={`${stat.bgColor} p-6 rounded-[2rem] flex flex-col justify-between h-48 shadow-sm transition-transform hover:-translate-y-1`}>
            <div className="flex items-center">
              <div className={`p-2 border border-black/10 rounded-full flex items-center justify-center ${stat.iconBg}`}>
                <IconComponent className="w-5 h-5 text-gray-900" />
              </div>
            </div>
            <div>
              <p className="text-gray-900 font-semibold mb-1">{stat.title}</p>
              <p className="text-gray-900/60 text-xs font-medium mb-3">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
              <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{stat.value.toLocaleString()}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
