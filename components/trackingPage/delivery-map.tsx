import { FaMapMarkerAlt, FaCompass } from "react-icons/fa";

const DeliveryMap = ({ from, to }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
      <div className="p-4 border-b border-border border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">From:</span>
            <span className="font-medium text-foreground">{from}</span>
          </div>
          <FaCompass className="w-4 h-4 text-primary" />
        </div>
        <div className="flex items-center space-x-2 text-sm mt-2">
          <span className="text-muted-foreground">To:</span>
          <span className="font-medium text-foreground">{to}</span>
        </div>
      </div>
      
      <div className="relative h-96 bg-gradient-to-br from-delivery-muted to-background">
        {/* Simplified map representation */}
        <div className="absolute inset-0 p-6">
          {/* Route path */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--delivery-primary))" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(var(--delivery-info))" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            
            {/* Delivery route */}
            <path
              d="M 50 250 Q 150 150 200 180 T 350 50"
              stroke="url(#routeGradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="animate-pulse"
            />
            
            {/* Road lines */}
            <path d="M 30 280 L 380 280" stroke="hsl(var(--border))" strokeWidth="2" />
            <path d="M 80 200 L 320 200" stroke="hsl(var(--border))" strokeWidth="2" />
            <path d="M 100 120 L 300 120" stroke="hsl(var(--border))" strokeWidth="2" />
          </svg>
          
          {/* Starting point */}
          <div className="absolute bottom-8 left-8 flex items-center space-x-2">
            <div className="w-4 h-4 bg-delivery-success rounded-full border-2 border-white shadow-lg"></div>
            <span className="text-xs font-medium bg-white px-2 py-1 rounded shadow-sm">Origin</span>
          </div>
          
          {/* Current location */}
          <div className="absolute top-12 right-16 flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded-full border-3 border-white shadow-lg animate-ping"></div>
            <div className="w-6 h-6 bg-primary rounded-full border-3 border-white shadow-lg absolute"></div>
            <span className="text-xs font-medium bg-white px-2 py-1 rounded shadow-sm ml-8">Current</span>
          </div>
          
          {/* Destination */}
          <div className="absolute top-4 right-8 flex items-center space-x-2">
            <FaMapMarkerAlt className="w-5 h-5 text-delivery-warning" />
            <span className="text-xs font-medium bg-white px-2 py-1 rounded shadow-sm">Destination</span>
          </div>
          
          {/* City labels */}
          <div className="absolute bottom-16 left-1/4 text-xs text-muted-foreground font-medium">Sampang</div>
          <div className="absolute top-1/3 right-1/4 text-xs text-muted-foreground font-medium">Surabaya</div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;