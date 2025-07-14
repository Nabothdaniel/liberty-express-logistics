import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { FiMapPin, FiClock, FiNavigation } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const TrackingSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentTracking, setRecentTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTracking = async () => {
      if (!user?.uid) return;

      const q = query(
        collection(db, 'shipments'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setRecentTracking({ id: doc.id, ...doc.data() });
      }

      setLoading(false);
    };

    fetchRecentTracking();
  }, [user]);

  if (loading) {
    return <div className="text-sm text-center text-gray-500">Loading recent tracking...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Tracking</h3>
        </div>

        {!recentTracking ? (
          <div className="text-center text-gray-600 text-sm py-8">
            <p>No recent tracking found</p>
            <button
              onClick={() => navigate('/track-shipment')}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
            >
              Track Shipment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Tracking ID<br />
              <span className="font-mono text-gray-900">{recentTracking.trackingId}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {recentTracking.status || 'In transit'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Current Location</div>
                  <div className="text-sm text-gray-600">{recentTracking.currentLocation || 'Unknown'}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Origin</div>
                  <div className="text-sm text-gray-600">{recentTracking.origin}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Destination</div>
                  <div className="text-sm text-gray-600">{recentTracking.destination}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <FiNavigation className="w-4 h-4" />
                <span>Route</span>
              </div>
              <div className="text-sm text-gray-900">
                {recentTracking.origin} → {recentTracking.destination}
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FiClock className="w-4 h-4" />
              <span>Estimated delivery</span>
            </div>
            <div className="text-sm text-gray-900">
              {recentTracking.estimatedDelivery
                ? dayjs(recentTracking.estimatedDelivery.toDate()).format('D MMM, YYYY')
                : 'Not available'}
            </div>

            <button
              onClick={() => navigate(`/track/${recentTracking.trackingCode}`)}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
            >
              Continue Tracking
            </button>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <FiMapPin className="w-8 h-8 mx-auto mb-2" />
            <div className="text-sm">Interactive Map View</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingSection;
