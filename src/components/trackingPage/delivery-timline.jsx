import { FaTruck,FaCheckCircle,FaMapMarkerAlt,FaBox,FaClock } from "react-icons/fa";
const DeliveryTimeline = ({ events, currentStatus }) => {
  const getIcon = (iconType) => {
    switch (iconType) {
      case 'delivered': return FaCheckCircle;
      case 'in-transit': return FaTruck;
      case 'handed-over': return FaMapMarkerAlt;
      case 'packed': return FaBox;
      default: return FaClock;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'ON GOING': return 'bg-delivery-warning text-white';
      case 'DELIVERED': return 'bg-delivery-success text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FaTruck className="w-5 h-5" />
          Delivery Information
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(currentStatus)}`}>
          {currentStatus}
        </span>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => {
          const Icon = getIcon(event.icon);
          const isLast = index === events.length - 1;
          
          return (
            <div key={event.id} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  event.completed 
                    ? 'bg-delivery-success text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                {!isLast && (
                  <div className={`w-0.5 h-8 mt-2 ${
                    event.completed ? 'bg-delivery-success' : 'bg-muted'
                  }`} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${
                    event.completed ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {event.status}
                  </p>
                  <span className="text-xs text-muted-foreground">{event.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryTimeline;