import { FaBox, FaCopy, FaChevronDown, FaChevronUp} from "react-icons/fa";
import { useState } from "react";



const ShipmentDetails = ({ totalPackages, shipments }) => {
  const [expandedShipment, setExpandedShipment] = useState(shipments[0]?.id);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-delivery-success';
      case 'in-transit': return 'text-delivery-warning';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card p-4 rounded-lg shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total packages:</span>
          <span className="text-2xl font-bold text-foreground">{totalPackages}</span>
        </div>
      </div>

      {shipments.map((shipment) => {
        const isExpanded = expandedShipment === shipment.id;
        
        return (
          <div key={shipment.id} className="bg-card rounded-lg shadow-[var(--shadow-card)] overflow-hidden">
            <div 
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setExpandedShipment(isExpanded ? null : shipment.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FaBox className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Shipment ID</span>
                      <button className="h-6 w-6 p-0 hover:bg-muted rounded transition-colors flex items-center justify-center">
                        <FaCopy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="font-mono text-sm font-medium text-foreground">
                      {shipment.id}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`text-sm font-medium ${getStatusColor(shipment.status)}`}>
                    {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                  </div>
                  {isExpanded ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {isExpanded && shipment.arrivalDate && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Your package arrived on:</span>
                  <span className="text-sm font-medium">{shipment.arrivalDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">You will receive it on:</span>
                  <span className="text-sm font-medium">{shipment.arrivalTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total items:</span>
                  <span className="text-sm font-medium">{shipment.items}x</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ShipmentDetails;