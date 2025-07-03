
import { FiMapPin, FiClock, FiNavigation } from 'react-icons/fi';

const TrackingSection = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tracking History</h3>
          <button className="text-gray-400">•••</button>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Tracking ID<br />
            <span className="font-mono text-gray-900">#17986-1779fg</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">In transit</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Current Location</div>
                <div className="text-sm text-gray-600">Poznan, Poland</div>
                <div className="text-xs text-gray-500">7th July, 2023, 08:00</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Departure Waypoint</div>
                <div className="text-sm text-gray-600">Berlin, Germany</div>
                <div className="text-xs text-gray-500">4th July, 2023, 15:00</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Arrival Waypoint</div>
                <div className="text-sm text-gray-600">Hannover, Germany</div>
                <div className="text-xs text-gray-500">4th July, 2023, 10:00</div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <FiNavigation className="w-4 h-4" />
              <span>Route</span>
            </div>
            <div className="text-sm text-gray-900">Hannover - Warsaw</div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FiClock className="w-4 h-4" />
            <span>Estimated delivery date</span>
          </div>
          <div className="text-sm text-gray-900">8th July, 2023</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <FiMapPin className="w-8 h-8 mx-auto mb-2" />
            <div className="text-sm">Interactive Map View</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
            alt="Courier"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">Courier</div>
            <div className="text-sm text-gray-600">Mark Melody</div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 bg-gray-100 rounded-lg">
              <span>💬</span>
            </button>
            <button className="p-2 bg-gray-100 rounded-lg">
              <span>📞</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingSection;
