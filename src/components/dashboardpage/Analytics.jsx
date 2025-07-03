import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  Area,
  XAxis,
} from 'recharts';
import { FiTrendingUp } from 'react-icons/fi';
import { useState } from 'react';

const dataByPeriod = {
  Day: [
    { time: '8 AM', value: 40 },
    { time: '10 AM', value: 60 },
    { time: '12 PM', value: 45 },
    { time: '2 PM', value: 70 },
    { time: '4 PM', value: 65 },
    { time: '6 PM', value: 90 },
  ],
  Week: [
    { time: 'Mon', value: 97 },
    { time: 'Tue', value: 105 },
    { time: 'Wed', value: 120 },
    { time: 'Thu', value: 130 },
    { time: 'Fri', value: 110 },
    { time: 'Sat', value: 150 },
    { time: 'Sun', value: 145 },
  ],
  Month: [
    { time: 'Week 1', value: 380 },
    { time: 'Week 2', value: 420 },
    { time: 'Week 3', value: 500 },
    { time: 'Week 4', value: 470 },
  ],
};

const AnalyticsSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const data = dataByPeriod[selectedPeriod];

  const periods = ['Day', 'Week', 'Month'];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Analytic View</h3>
        <div className="flex flex-wrap items-center gap-2">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-sm rounded-full transition ${
                selectedPeriod === period
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period}
            </button>
          ))}
          <FiTrendingUp className="w-4 h-4 text-gray-600" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-6">
        <div>
          <div className="flex items-center text-gray-600 text-sm mb-1">
            Minimal number <FiTrendingUp className="w-4 h-4 ml-1" />
          </div>
          <div className="text-2xl font-bold text-gray-900">97</div>
        </div>
        <div>
          <div className="flex items-center text-gray-600 text-sm mb-1">
            Average number <FiTrendingUp className="w-4 h-4 ml-1" />
          </div>
          <div className="text-2xl font-bold text-gray-900">120</div>
        </div>
        <div>
          <div className="flex items-center text-gray-600 text-sm mb-1">
            Maximum number <FiTrendingUp className="w-4 h-4 ml-1" />
          </div>
          <div className="text-2xl font-bold text-gray-900">150</div>
        </div>
      </div>

      {/* Line Chart with Area Shadow */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorShadow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#111827" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#111827" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <Tooltip
              contentStyle={{ backgroundColor: '#f9fafb', border: 'none' }}
              labelStyle={{ color: '#6b7280' }}
              cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
              formatter={(value) => [`${value}`, 'Shipments']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#111827"
              strokeWidth={2.5}
              fill="url(#colorShadow)"
              dot={false}
              isAnimationActive
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#111827"
              strokeWidth={3}
              dot={false}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsSection;
