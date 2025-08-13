"use client"

import { useRef, useState } from "react"
import { useAtom } from "jotai"
import { FiX, FiMapPin, FiPackage, FiUser, FiCheck } from "react-icons/fi"
import { shipmentDraftAtom, currentStepAtom, initialDraft } from "../../atoms/shipmentFormAtom"

const STEPS = [
  { id: 1, title: "Sender info", icon: FiUser },
  { id: 2, title: "Receiver info", icon: FiMapPin },
  { id: 3, title: "Parcel info", icon: FiPackage },
]

export default function CreateShipmentModal({ onClose }) {
  const overlayRef = useRef()
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useAtom(shipmentDraftAtom)
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom)

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const updated = {
      ...formData,
      [name]: value,
    }
    setFormData(updated)
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.senderName && formData.senderEmail && formData.senderPhone && formData.senderAddress
      case 2:
        return formData.receiverName && formData.receiverEmail && formData.receiverPhone && formData.receiverAddress
      case 3:
        return formData.cargoType && formData.weight && formData.length && formData.width && formData.height
      default:
        return false
    }
  }

  const showToast = (message, type = "success") => {
    // Simple toast notification replacement
    const toast = document.createElement("div")
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`
    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => {
      document.body.removeChild(toast)
    }, 3000)
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    } else {
      showToast("Please fill in all required fields", "error")
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep(3)) return

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate tracking code
      const trackingCode = `TRK-${Date.now().toString().slice(-4)}`

      console.log("Shipment created:", {
        ...formData,
        trackingCode,
        createdAt: new Date().toISOString(),
        status: "Pending",
      })

      setFormData(initialDraft)
      setCurrentStep(1)

      setIsSuccess(true)
      setTimeout(() => {
        showToast("Shipment created successfully!")
        onClose()
      }, 2000)
    } catch (err) {
      console.error("Error processing shipment:", err)
      showToast("Failed to create shipment", "error")
    } finally {
      setLoading(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, index) => {
        const Icon = step.icon
        const isCompleted = currentStep > step.id
        const isCurrent = currentStep === step.id

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? <FiCheck className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={`text-sm mt-2 transition-colors duration-300 ${
                  isCompleted || isCurrent ? "text-gray-900 font-medium" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 transition-colors duration-300 ${
                  isCompleted ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )

  const renderSenderInfo = () => (
    <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sender Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="senderName"
          placeholder="Full Name *"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          required
          value={formData.senderName}
          onChange={handleChange}
        />
        <input
          name="senderEmail"
          type="email"
          placeholder="Email Address *"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          required
          value={formData.senderEmail}
          onChange={handleChange}
        />
        <input
          name="senderPhone"
          placeholder="Phone Number *"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          required
          value={formData.senderPhone}
          onChange={handleChange}
        />
        <input
          name="senderPostalCode"
          placeholder="Postal Code"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          value={formData.senderPostalCode}
          onChange={handleChange}
        />
        <input
          name="senderAddress"
          placeholder="Street Address *"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all md:col-span-2"
          required
          value={formData.senderAddress}
          onChange={handleChange}
        />
        <input
          name="senderCity"
          placeholder="City"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          value={formData.senderCity}
          onChange={handleChange}
        />
      </div>
    </div>
  )

  const renderReceiverInfo = () => (
    <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Receiver Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="receiverName"
          placeholder="Full Name *"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          required
          value={formData.receiverName}
          onChange={handleChange}
        />
        <input
          name="receiverEmail"
          type="email"
          placeholder="Email Address *"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          required
          value={formData.receiverEmail}
          onChange={handleChange}
        />
        <input
          name="receiverPhone"
          placeholder="Phone Number *"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          required
          value={formData.receiverPhone}
          onChange={handleChange}
        />
        <input
          name="receiverPostalCode"
          placeholder="Postal Code"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          value={formData.receiverPostalCode}
          onChange={handleChange}
        />
        <input
          name="receiverAddress"
          placeholder="Street Address *"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all md:col-span-2"
          required
          value={formData.receiverAddress}
          onChange={handleChange}
        />
        <input
          name="receiverCity"
          placeholder="City"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          value={formData.receiverCity}
          onChange={handleChange}
        />
      </div>
    </div>
  )

  const renderParcelInfo = () => (
    <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Parcel Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="cargoType"
          placeholder="Package Type *"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          required
          value={formData.cargoType}
          onChange={handleChange}
        />
        <input
          name="weight"
          type="number"
          step="0.1"
          placeholder="Weight (kg) *"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          required
          value={formData.weight}
          onChange={handleChange}
        />
        <input
          name="length"
          type="number"
          step="0.1"
          placeholder="Length (cm) *"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          required
          value={formData.length}
          onChange={handleChange}
        />
        <input
          name="width"
          type="number"
          step="0.1"
          placeholder="Width (cm) *"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          required
          value={formData.width}
          onChange={handleChange}
        />
        <input
          name="height"
          type="number"
          step="0.1"
          placeholder="Height (cm) *"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          required
          value={formData.height}
          onChange={handleChange}
        />
        <input
          name="deliveryDate"
          type="date"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
          value={formData.deliveryDate}
          onChange={handleChange}
        />
        <textarea
          name="specialInstructions"
          placeholder="Special Instructions (optional)"
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all md:col-span-2 resize-none"
          value={formData.specialInstructions}
          onChange={handleChange}
        />
      </div>
    </div>
  )

  const renderSuccessState = () => (
    <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiCheck className="w-10 h-10 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Shipment Created Successfully!</h3>
      <p className="text-gray-600 mb-4">We've received your shipment request and will process it shortly.</p>
      <p className="text-sm text-gray-500">You will be redirected automatically...</p>
    </div>
  )

  const renderStepContent = () => {
    if (isSuccess) return renderSuccessState()

    switch (currentStep) {
      case 1:
        return renderSenderInfo()
      case 2:
        return renderReceiverInfo()
      case 3:
        return renderParcelInfo()
      default:
        return renderSenderInfo()
    }
  }

  const renderButtons = () => {
    if (isSuccess) return null

    return (
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handlePrevious}
          className={`px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors ${
            currentStep === 1 ? "invisible" : ""
          }`}
        >
          Previous
        </button>

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <span>Create Shipment</span>
            )}
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto flex items-start justify-center p-4 pt-8"
    >
      <div className="bg-white rounded-xl w-full max-w-3xl mx-auto shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 cursor-pointer text-gray-500 hover:text-gray-800 transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 text-center">Create New Shipment</h2>

          {renderStepIndicator()}

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}
            {renderButtons()}
          </form>
        </div>
      </div>
    </div>
  )
}
