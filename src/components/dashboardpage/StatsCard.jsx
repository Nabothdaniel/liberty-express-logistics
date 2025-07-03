
import { FiPackage, FiMapPin, FiTruck } from 'react-icons/fi';

const StatsCards = () => {
  const stats = [
    {
      title: 'Total Shipments',
      value: '789',
      change: '+5.45%',
      positive: true,
      icon: FiPackage,
    },
    {
      title: 'Active Tracking',
      value: '120',
      change: '-0.45%',
      positive: false,
      icon: FiMapPin,
    },
    {
      title: 'Delivered Shipments',
      value: '98',
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
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.positive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
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
