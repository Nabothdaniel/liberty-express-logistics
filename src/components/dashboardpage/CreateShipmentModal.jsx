"use client"

import { useRef, useState } from "react"
import { useAtom } from "jotai"
import { FiX, FiUser, FiCheck } from "react-icons/fi"
import { Plane, MapPin, Calendar } from "lucide-react"
import { shipmentDraftAtom, currentStepAtom, initialDraft } from "../../atoms/shipmentFormAtom"
import { db } from "../../firebase/firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { useAuth } from "../../auth/useAuth"
import { toast } from "react-toastify"

const STEPS = [
  { id: 1, title: "Traveller Info", icon: FiUser },
  { id: 2, title: "Flight Details", icon: Plane },
  { id: 3, title: "Preferences", icon: MapPin },
]

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
)

const inputClass =
  "w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all text-sm"
const selectClass =
  "w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all text-sm bg-white"

export default function CreateShipmentModal({ onClose }) {
  const overlayRef = useRef()
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const { user } = useAuth()

  const [formData, setFormData] = useAtom(shipmentDraftAtom)
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom)

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  // Per-step validation
  const validateStep = (step) => {
    const errs = {}
    if (step === 1) {
      if (!formData.firstName?.trim()) errs.firstName = "First name is required"
      if (!formData.lastName?.trim()) errs.lastName = "Last name is required"
      if (!formData.dateOfBirth) errs.dateOfBirth = "Date of birth is required"
      if (!formData.sex) errs.sex = "Please select sex"
      if (!formData.email?.trim()) errs.email = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        errs.email = "Enter a valid email address"
    }
    if (step === 2) {
      if (!formData.fromLocation?.trim()) errs.fromLocation = "Departure city is required"
      if (!formData.toLocation?.trim()) errs.toLocation = "Destination city is required"
      if (!formData.flightDate) errs.flightDate = "Date of flight is required"
      if (!formData.arrivalDate) errs.arrivalDate = "Arrival date is required"
    }
    if (step === 3) {
      if (!formData.flightType) errs.flightType = "Please select a flight class"
      if (!formData.priceRange) errs.priceRange = "Please select a price range"
    }
    return errs
  }

  const handleNext = () => {
    const errs = validateStep(currentStep)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast.error("Please fix the errors before continuing.")
      return
    }
    setCurrentStep((prev) => prev + 1)
  }

  const handlePrevious = () => setCurrentStep((prev) => prev - 1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateStep(3)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast.error("Please fix all errors before submitting.")
      return
    }

    setLoading(true)
    try {
      const trackingCode = `FL-${Date.now().toString().slice(-6)}`

      await addDoc(collection(db, "flights"), {
        ...formData,
        trackingCode,
        status: "booked",
        userId: user?.uid || "guest",
        createdBy: user?.email || "unknown",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        statusHistory: [
          {
            status: "booked",
            timestamp: new Date().toISOString(),
            updatedBy: user?.email || "system",
          },
        ],
      })

      setFormData(initialDraft)
      setCurrentStep(1)
      setIsSuccess(true)

      setTimeout(() => {
        toast.success(`Flight booked! Tracking code: ${trackingCode}`)
        onClose()
      }, 2000)
    } catch (err) {
      console.error("Error booking flight:", err)
      toast.error("Failed to book flight. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ─── Step indicator ───────────────────────────────────────────────────────
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
                className={`text-xs mt-2 text-center max-w-20 transition-colors duration-300 ${
                  isCompleted || isCurrent ? "text-gray-900 font-medium" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 mt-[-16px] transition-colors duration-300 ${
                  isCompleted ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )

  // ─── Step 1: Traveller Info ───────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Traveller Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="First Name *" error={errors.firstName}>
          <input
            name="firstName"
            placeholder="e.g. John"
            className={`${inputClass} ${errors.firstName ? "border-red-400" : ""}`}
            value={formData.firstName}
            onChange={handleChange}
          />
        </Field>
        <Field label="Last Name *" error={errors.lastName}>
          <input
            name="lastName"
            placeholder="e.g. Smith"
            className={`${inputClass} ${errors.lastName ? "border-red-400" : ""}`}
            value={formData.lastName}
            onChange={handleChange}
          />
        </Field>
        <Field label="Date of Birth *" error={errors.dateOfBirth}>
          <input
            name="dateOfBirth"
            type="date"
            className={`${inputClass} ${errors.dateOfBirth ? "border-red-400" : ""}`}
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </Field>
        <Field label="Sex *" error={errors.sex}>
          <select
            name="sex"
            className={`${selectClass} ${errors.sex ? "border-red-400" : ""}`}
            value={formData.sex}
            onChange={handleChange}
          >
            <option value="">Select sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Prefer not to say</option>
          </select>
        </Field>
        <Field label="Email of Traveller *" error={errors.email}>
          <input
            name="email"
            type="email"
            placeholder="e.g. john@example.com"
            className={`${inputClass} ${errors.email ? "border-red-400" : ""} md:col-span-2`}
            value={formData.email}
            onChange={handleChange}
          />
        </Field>
      </div>
    </div>
  )

  // ─── Step 2: Flight Details ───────────────────────────────────────────────
  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="From (Departure City / Airport) *" error={errors.fromLocation}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">FROM</span>
            <input
              name="fromLocation"
              placeholder="e.g. Lagos (LOS)"
              className={`${inputClass} pl-14 ${errors.fromLocation ? "border-red-400" : ""}`}
              value={formData.fromLocation}
              onChange={handleChange}
            />
          </div>
        </Field>
        <Field label="To (Destination City / Airport) *" error={errors.toLocation}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">TO</span>
            <input
              name="toLocation"
              placeholder="e.g. London (LHR)"
              className={`${inputClass} pl-10 ${errors.toLocation ? "border-red-400" : ""}`}
              value={formData.toLocation}
              onChange={handleChange}
            />
          </div>
        </Field>
        <Field label="Date of Flight (Departure) *" error={errors.flightDate}>
          <input
            name="flightDate"
            type="date"
            className={`${inputClass} ${errors.flightDate ? "border-red-400" : ""}`}
            value={formData.flightDate}
            onChange={handleChange}
          />
        </Field>
        <Field label="Arrival Date *" error={errors.arrivalDate}>
          <input
            name="arrivalDate"
            type="date"
            className={`${inputClass} ${errors.arrivalDate ? "border-red-400" : ""}`}
            value={formData.arrivalDate}
            onChange={handleChange}
          />
        </Field>
      </div>

      {/* Route preview */}
      {(formData.fromLocation || formData.toLocation) && (
        <div className="mt-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700">
          <span className="font-medium">{formData.fromLocation || "—"}</span>
          <Plane className="text-gray-400 flex-shrink-0" />
          <span className="font-medium">{formData.toLocation || "—"}</span>
        </div>
      )}
    </div>
  )

  // ─── Step 3: Preferences ─────────────────────────────────────────────────
  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Preferences</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Flight Type (Class) *" error={errors.flightType}>
          <select
            name="flightType"
            className={`${selectClass} ${errors.flightType ? "border-red-400" : ""}`}
            value={formData.flightType}
            onChange={handleChange}
          >
            <option value="">Select class</option>
            <option value="economy">Economy</option>
            <option value="business">Business</option>
            <option value="first_class">First Class</option>
          </select>
        </Field>
        <Field label="Price Range *" error={errors.priceRange}>
          <select
            name="priceRange"
            className={`${selectClass} ${errors.priceRange ? "border-red-400" : ""}`}
            value={formData.priceRange}
            onChange={handleChange}
          >
            <option value="">Select price range</option>
            <option value="budget">Budget (Under $300)</option>
            <option value="mid-range">Mid-Range ($300 – $800)</option>
            <option value="premium">Premium ($800 – $2,000)</option>
            <option value="luxury">Luxury ($2,000+)</option>
          </select>
        </Field>
      </div>

      {/* Summary */}
      {formData.firstName && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1 text-sm">
          <p className="font-semibold text-gray-800 mb-2">Booking Summary</p>
          <p className="text-gray-600">
            <span className="font-medium text-gray-800">Passenger:</span>{" "}
            {formData.firstName} {formData.lastName}
          </p>
          <p className="text-gray-600">
            <span className="font-medium text-gray-800">Route:</span>{" "}
            {formData.fromLocation} → {formData.toLocation}
          </p>
          <p className="text-gray-600">
            <span className="font-medium text-gray-800">Departure:</span> {formData.flightDate}
          </p>
          <p className="text-gray-600">
            <span className="font-medium text-gray-800">Class:</span>{" "}
            {formData.flightType === "first_class"
              ? "First Class"
              : formData.flightType
              ? formData.flightType.charAt(0).toUpperCase() + formData.flightType.slice(1)
              : "—"}
          </p>
        </div>
      )}
    </div>
  )

  // ─── Success state ────────────────────────────────────────────────────────
  const renderSuccess = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiCheck className="w-10 h-10 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Flight Booked Successfully!</h3>
      <p className="text-gray-600 mb-4">
        We've received your flight booking request. The traveller will be contacted at{" "}
        <span className="font-medium">{formData.email}</span>.
      </p>
      <p className="text-sm text-gray-500">Redirecting…</p>
    </div>
  )

  const renderContent = () => {
    if (isSuccess) return renderSuccess()
    switch (currentStep) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      default: return renderStep1()
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
            Continue
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
                <span>Booking…</span>
              </>
            ) : (
              <>
                <Plane className="w-4 h-4" />
                <span>Book Flight</span>
              </>
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
          <h2 className="text-2xl font-bold mb-2 text-gray-900 text-center">Book a Flight</h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            Fill in the traveller's details to create a flight booking
          </p>

          {renderStepIndicator()}

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderContent()}
            {renderButtons()}
          </form>
        </div>
      </div>
    </div>
  )
}
