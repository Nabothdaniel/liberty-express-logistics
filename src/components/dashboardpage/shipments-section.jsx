import { FiMoreHorizontal } from 'react-icons/fi';

const Shipments = () => {
  const activities = [
    {
      id: '#10986-08-776sg',
      category: 'Electronic',
      weight: '2.600 t',
      company: 'Generic SO.',
      arrivalTime: '6th July, 2023',
      route: 'London - Prague',
      shipper: 'DHL',
      price: '$5,678.00',
      status: 'Delivered',
    },
    {
      id: '#10568-12-873fwg',
      category: 'Building materials',
      weight: '6.568 t',
      company: 'Abuilding CO.',
      arrivalTime: '2nd July, 2023',
      route: 'Berlin - Poznan',
      shipper: 'Amazon',
      price: '$12,500.00',
      status: 'Delivered',
    },
  ];

  const statusFilters = ['All', 'Delivered', 'In transit', 'Pending', 'Processing'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Shipments</h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filter === 'All'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900 border border-transparent hover:border-gray-300'
                  }`}
                >
                  {filter === 'All' && <span className="inline-block w-2 h-2 bg-white rounded-full mr-2" />}
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between sm:justify-normal space-x-2 text-sm text-gray-600">
              <span className="hidden sm:block">Customize</span>
              <span className="hidden sm:block">1-10 of 40</span>
              <div className="flex space-x-1">
                <button className="p-1">←</button>
                <button className="p-1">→</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Order ID</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Weight</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Company</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Arrival</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Route</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Shipper</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Price</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-gray-50 whitespace-nowrap">
                <td className="px-4 py-3">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{activity.id}</td>
                <td className="px-4 py-3 text-gray-700">{activity.category}</td>
                <td className="px-4 py-3 text-gray-700">{activity.weight}</td>
                <td className="px-4 py-3 text-gray-700">{activity.company}</td>
                <td className="px-4 py-3 text-gray-700">{activity.arrivalTime}</td>
                <td className="px-4 py-3 text-gray-700">{activity.route}</td>
                <td className="px-4 py-3 text-gray-700">{activity.shipper}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{activity.price}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {activity.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-gray-400 hover:text-gray-600">
                    <FiMoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shipments;
