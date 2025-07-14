import { useEffect, useState } from 'react';
import { FiPackage, FiDollarSign, FiTruck } from 'react-icons/fi';
import { useAuth } from '../../auth/useAuth';
import { db } from '../../firebase/firebase';
import {
  collection,
  query,
  where,
  getCountFromServer,
  doc,
  getDoc,
} from 'firebase/firestore';

const StatsCards = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [totalShipments, setTotalShipments] = useState(0);
  const [deliveredShipments, setDeliveredShipments] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.uid) return;

      try {
        // Fetch balance
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setBalance(userSnap.data().balance || 0);
        }

        // Count total shipments
        const totalQuery = query(
          collection(db, 'shipments'),
          where('userId', '==', user.uid)
        );
        const totalSnap = await getCountFromServer(totalQuery);
        setTotalShipments(totalSnap.data().count);

        // Count delivered shipments
        const deliveredQuery = query(
          collection(db, 'shipments'),
          where('userId', '==', user.uid),
          where('status', '==', 'Delivered')
        );
        const deliveredSnap = await getCountFromServer(deliveredQuery);
        setDeliveredShipments(deliveredSnap.data().count);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [user?.uid]);

  const stats = [
    {
      title: 'Balance',
      value: `$${balance.toLocaleString()}`,
      icon: FiDollarSign,
    },
    {
      title: 'Total Shipments',
      value: totalShipments,
      change: '+5.45%',
      positive: true,
      icon: FiPackage,
    },
    {
      title: 'Delivered Shipments',
      value: deliveredShipments,
      change: '+5.45%',
      positive: true,
      icon: FiTruck,
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
                {stat.change && (
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-sm font-medium ${
                        stat.positive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                )}
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
