import { useState } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { Plane } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { shipmentsAtom } from '../../atoms/shipmentsAtom';
import useShipments from '../../hooks/use-shipments';
import { StatusManager } from '../../utils/status-manager';

const statusColors = {
  booked: 'bg-blue-100 text-blue-800',
  check_in: 'bg-indigo-100 text-indigo-800',
  boarding: 'bg-yellow-100 text-yellow-800',
  in_flight: 'bg-orange-100 text-orange-800',
  landed: 'bg-teal-100 text-teal-800',
  arrived: 'bg-green-100 text-green-800',
  delayed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-700',
}

const classLabels = {
  economy: 'Economy',
  business: 'Business',
  first_class: 'First Class',
}

const Shipments = () => {
  const flights = useAtomValue(shipmentsAtom);
  useShipments();

  const [activeFilter, setActiveFilter] = useState('All');

  const statusFilters = ['All', 'Booked', 'In Flight', 'Arrived', 'Delayed', 'Cancelled'];

  const filterMap = {
    All: null,
    Booked: 'booked',
    'In Flight': 'in_flight',
    Arrived: 'arrived',
    Delayed: 'delayed',
    Cancelled: 'cancelled',
  };

  const filtered = activeFilter === 'All'
    ? flights
    : flights.filter((f) => f.status === filterMap[activeFilter]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Plane className="w-5 h-5 text-gray-600" />
            Flight Bookings
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filter === activeFilter
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900 border border-transparent hover:border-gray-300'
                  }`}
                >
                  {filter === activeFilter && (
                    <span className="inline-block w-2 h-2 bg-white rounded-full mr-2" />
                  )}
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between sm:justify-normal space-x-2 text-sm text-gray-600">
              <span className="hidden sm:block">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Plane className="w-10 h-10 mb-3" />
            <p className="text-sm font-medium">No flight bookings found</p>
            <p className="text-xs mt-1">Book a flight to get started</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Booking Code</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Traveller</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Route</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Flight Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Class</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.map((flight) => {
                const statusConfig = StatusManager.getStatus(flight.status)
                const colorClass = statusColors[flight.status] || 'bg-gray-100 text-gray-700'
                return (
                  <tr key={flight.id} className="hover:bg-gray-50 whitespace-nowrap">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-gray-900 text-xs">
                      {flight.trackingCode || flight.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {flight.firstName} {flight.lastName}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{flight.email}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      <span className="inline-flex items-center gap-1">
                        {flight.fromLocation}
                        <Plane className="w-3 h-3 text-gray-400" />
                        {flight.toLocation}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{flight.flightDate || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {classLabels[flight.flightType] || flight.flightType || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        <FiMoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Shipments;
