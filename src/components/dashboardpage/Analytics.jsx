import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useEffect, useState } from 'react';
import { FiPackage } from 'react-icons/fi';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../auth/useAuth';

const periods = ['Day', 'Week', 'Month'];

const getStartTimestamp = (period) => {
  const now = new Date();
  switch (period) {
    case 'Day':
      return Timestamp.fromDate(new Date(now.getFullYear(), now.getMonth(), now.getDate())); // today
    case 'Week': {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return Timestamp.fromDate(startOfWeek);
    }
    case 'Month':
      return Timestamp.fromDate(new Date(now.getFullYear(), now.getMonth(), 1)); // 1st of month
    default:
      return Timestamp.fromDate(now);
  }
};

const AnalyticsSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [statusCounts, setStatusCounts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) return;

    const startTimestamp = getStartTimestamp(selectedPeriod);

    const q = query(
      collection(db, 'shipments'),
      where('userId', '==', user.uid),
      where('createdAt', '>=', startTimestamp)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const statusMap = {};
      snapshot.forEach((doc) => {
        const status = doc.data().status || 'Unknown';
        statusMap[status] = (statusMap[status] || 0) + 1;
      });

      const formatted = Object.entries(statusMap).map(([label, count]) => ({
        label,
        count,
      }));

      setStatusCounts(formatted);
    });

    return () => unsubscribe();
  }, [selectedPeriod, user?.uid]);

  const total = statusCounts.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FiPackage className="text-gray-600" />
          Shipment Analytics
        </h3>
        <div className="flex gap-2">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-sm rounded-full ${selectedPeriod === period
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-center">
        {statusCounts.map((d) => (
          <div key={d.label}>
            <div className="text-sm text-gray-600">{d.label}</div>
            <div className="text-xl font-bold text-gray-800">{d.count}</div>
          </div>
        ))}
        <div>
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-xl font-bold text-gray-800">{total}</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={statusCounts}
            margin={{
              top: 10,
              right: 10,
              left:-40,
              bottom: 20,
            }}
          >
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: 'none',
                boxShadow: '0 0 0 1px #e5e7eb',
                fontSize: '12px',
              }}
              cursor={{ fill: '#f3f4f6' }}
              labelStyle={{ display: 'none' }}
              formatter={(value) => [`${value}`, 'Shipments']}
            />
            <Bar
              dataKey="count"
              fill="#111827"
              radius={[8, 8, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default AnalyticsSection;
