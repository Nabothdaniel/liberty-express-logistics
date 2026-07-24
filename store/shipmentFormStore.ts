import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const initialDraft = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  sex: "",
  email: "",
  fromLocation: "",
  toLocation: "",
  flightDate: "",
  arrivalDate: "",
  flightType: "",
  priceRange: "",
};

interface ShipmentFormState {
  formData: typeof initialDraft;
  setFormData: (val: typeof initialDraft | ((prev: typeof initialDraft) => typeof initialDraft)) => void;
  currentStep: number;
  setCurrentStep: (val: number | ((prev: number) => number)) => void;
}

export const useShipmentFormStore = create<ShipmentFormState>()(
  persist(
    (set) => ({
      formData: initialDraft,
      setFormData: (val) => set((state) => ({ 
        formData: typeof val === 'function' ? val(state.formData) as typeof initialDraft : val 
      })),
      currentStep: 1,
      setCurrentStep: (val) => set((state) => ({
        currentStep: typeof val === 'function' ? val(state.currentStep) as number : val
      })),
    }),
    {
      name: 'flight-draft-storage',
    }
  )
);
