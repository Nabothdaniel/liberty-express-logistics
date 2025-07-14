import { FiMoreHorizontal } from 'react-icons/fi';
import { useAtomValue } from 'jotai';
import { shipmentsAtom } from '../../atoms/shipmentsAtom';
import useShipments from '../../hooks/use-shipments';

const Shipments = () => {
  const shipments = useAtomValue(shipmentsAtom);
  useShipments();

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
              <span className="hidden sm:block">1-10 of {shipments.length}</span>
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
              <th className="px-4 py-3 text-left font-medium text-gray-500">Tracking ID</th>
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
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-gray-50 whitespace-nowrap">
                <td className="px-4 py-3">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{shipment.trackingCode}</td>
                <td className="px-4 py-3 text-gray-700">{shipment.cargoType}</td>
                <td className="px-4 py-3 text-gray-700">{shipment.weight} kg</td>
                <td className="px-4 py-3 text-gray-700">{shipment.sender}</td>
                <td className="px-4 py-3 text-gray-700">{shipment.deliveryDate || 'N/A'}</td>
                <td className="px-4 py-3 text-gray-700">{shipment.origin} - {shipment.destination}</td>
                <td className="px-4 py-3 text-gray-700">{shipment.receiver}</td>
                <td className="px-4 py-3 font-medium text-gray-900">${shipment.price?.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {shipment.status}
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
