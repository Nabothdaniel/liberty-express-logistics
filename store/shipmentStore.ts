import { create } from 'zustand';

interface ShipmentState {
  shipments: any[];
  setShipments: (shipments: any[]) => void;
}

export const useShipmentStore = create<ShipmentState>((set) => ({
  shipments: [],
  setShipments: (shipments) => set({ shipments }),
}));
