import { atomWithStorage } from "jotai/utils"


export const initialDraft = {
  // Sender info
  senderName: "",
  senderEmail: "",
  senderPhone: "",
  senderAddress: "",
  senderCity: "",
  senderPostalCode: "",

  // Receiver info
  receiverName: "",
  receiverEmail: "",
  receiverPhone: "",
  receiverAddress: "",
  receiverCity: "",
  receiverPostalCode: "",

  // Parcel info
  cargoType: "",
  weight: "",
  length: "",
  width: "",
  height: "",
  deliveryDate: "",
  specialInstructions: "",
}

// Persistent draft storage using Jotai
export const shipmentDraftAtom = atomWithStorage("shipment-draft", initialDraft)
export const currentStepAtom = atomWithStorage("shipment-step", 1)
