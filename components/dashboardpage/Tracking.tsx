import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Plane } from 'lucide-react';
import { FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { StatusManager } from '../../utils/status-manager';

const statusColors = {
  booked: 'bg-blue-100 text-blue-700',
  check_in: 'bg-indigo-100 text-indigo-700',
  boarding: 'bg-yellow-100 text-yellow-800',
  in_flight: 'bg-orange-100 text-orange-800',
  landed: 'bg-teal-100 text-teal-800',
  arrived: 'bg-green-100 text-green-800',
  delayed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-600',
}

const TrackingSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentFlights, setRecentFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const q = user.role === 'admin'
      ? query(collection(db, 'flights'), orderBy('createdAt', 'desc'), limit(5))
      : query(
          collection(db, 'flights'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecentFlights(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, user?.role]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="text-sm text-center text-gray-500 py-8">Loading flights…</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Plane className="text-gray-600" />
            Recent Flights
          </h3>
          <button
            onClick={() => navigate('/track')}
            className="text-xs text-blue-600 hover:underline"
          >
            View all
          </button>
        </div>

        {recentFlights.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            <Plane className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No flights yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentFlights.map((flight) => {
              const statusConfig = StatusManager.getStatus(flight.status);
              const colorClass = statusColors[flight.status] || 'bg-gray-100 text-gray-600';
              return (
                <div
                  key={flight.id}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate('/track')}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-medium text-gray-900">
                      {flight.trackingCode || flight.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${colorClass}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                    {flight.fromLocation}
                    <Plane className="w-3 h-3 text-gray-400" />
                    {flight.toLocation}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <span>{flight.firstName} {flight.lastName}</span>
                    {flight.flightDate && (
                      <>
                        <span>•</span>
                        <FiClock className="w-3 h-3" />
                        <span>{flight.flightDate}</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingSection;
