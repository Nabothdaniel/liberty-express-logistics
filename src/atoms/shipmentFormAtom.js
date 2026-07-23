import { atomWithStorage } from "jotai/utils"

export const initialDraft = {
  // Traveller Info
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  sex: "",
  email: "",

  // Flight Details
  fromLocation: "",
  toLocation: "",
  flightDate: "",
  arrivalDate: "",

  // Preferences
  flightType: "", // economy | business | first_class
  priceRange: "", // budget | mid-range | premium | luxury
}

// Persistent draft storage using Jotai
export const shipmentDraftAtom = atomWithStorage("flight-draft", initialDraft)
export const currentStepAtom = atomWithStorage("flight-step", 1)
