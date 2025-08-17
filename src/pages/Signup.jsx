import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, User, Mail, Phone, Lock, Check, Truck, Package, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormImg from '../assets/images/forms/form.jpg';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';


const InputField = ({ id, type, placeholder, value, onChange, onBlur, icon: Icon, error, label, showToggle, toggleValue, onToggle }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full h-12 pl-10 ${showToggle ? 'pr-10' : 'pr-4'} border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors`}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {toggleValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessType: '',
    shipmentVolume: '',
    address: '',
    serviceType: '',
    specialRequirements: ''
  });

  const validateField = (field, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{7,15}$/;

    switch (field) {
      case 'contactPerson':
        return !value?.trim() ? "Contact person is required." : '';
      case 'email':
        if (!value) return "Email is required.";
        if (!emailRegex.test(value)) return "Enter a valid email address.";
        return '';
      case 'phone':
        if (!value) return "Phone number is required.";
        if (!phoneRegex.test(value)) return "Enter a valid phone number (7-15 digits).";
        return '';
      case 'password':
        if (!value) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters.";
        return '';
      case 'confirmPassword':
        if (!value) return "Please confirm your password.";
        if (value !== formData.password) return "Passwords do not match.";
        return '';
      case 'address':
        return !value?.trim() ? "Business address is required." : '';
      case 'businessType':
        return !value ? "Please select your business type." : '';
      case 'shipmentVolume':
        return !value ? "Please select your monthly shipment volume." : '';
      case 'serviceType':
        return !value ? "Please select your primary service need." : '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ['contactPerson', 'email', 'phone', 'password', 'confirmPassword', 'address', 'businessType', 'shipmentVolume', 'serviceType'];

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });

    return errors;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Validate field if it's been touched
    if (touchedFields[field]) {
      const error = validateField(field, value);
      setFormErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setFormErrors(prev => ({ ...prev, [field]: error }));
  };

  const steps = [
    { id: 1, title: 'Company Details', description: 'Basic company information' },
    { id: 2, title: 'Business Info', description: 'Shipping requirements' },
    { id: 3, title: 'Service Setup', description: 'Preferences & verification' }
  ];

  const nextStep = () => {
    // Validate current step fields
    const currentStepFields = getCurrentStepFields();
    const stepErrors = {};
    let hasErrors = false;

    currentStepFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        stepErrors[field] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setFormErrors(prev => ({ ...prev, ...stepErrors }));
      toast.error("Please fix the errors before continuing.");
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      toast.success("Step completed successfully!");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getCurrentStepFields = () => {
    switch (currentStep) {
      case 1:
        return ['contactPerson', 'email', 'phone', 'password'];
      case 2:
        return ['confirmPassword', 'address', 'businessType', 'shipmentVolume'];
      case 3:
        return ['serviceType'];
      default:
        return [];
    }
  };



  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      toast.error("Please fix all errors before submitting.");
      return;
    }

    setFormErrors({});
    setLoading(true);

    try {
      const {
        email,
        password,
        contactPerson,
        phone,
        businessType,
        shipmentVolume,
        address,
        serviceType,
        specialRequirements
      } = formData;

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential)
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: contactPerson });

      // Store in users collection
      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        email,
        role:'admin',
        username: contactPerson,
        createdAt: new Date().toISOString()
      });

      // Store in profiles collection
      await setDoc(doc(db, "profiles", user.uid), {
        userId: user.uid,
        phone,
        businessType,
        shipmentVolume,
        address,
        serviceType,
        specialRequirements,
        createdAt: new Date().toISOString()
      });

      // Send verification email
      await sendEmailVerification(user);

      toast.success("Account created! Please check your email to verify your account.");

      // Reset form
      setFormData({
        contactPerson: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        businessType: '',
        shipmentVolume: '',
        address: '',
        serviceType: '',
        specialRequirements: ''
      });
      setCurrentStep(1);

      // Redirect to login page after short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const SelectField = ({ id, value, onChange, onBlur, options, error, label, placeholder, icon: Icon }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />}
        <select
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full h-12 ${Icon ? 'pl-10' : 'pl-4'} pr-4 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white transition-colors`}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${FormImg})`
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Liberty Express</h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold mb-4">Streamline Your Logistics Today!</h2>
            <p className="text-lg leading-relaxed text-gray-100">
              Join thousands of businesses that trust Liberty Express for their shipping
              and logistics needs. Our platform makes it easy to manage your
              supply chain from start to finish.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-300" />
                <span>Real-time tracking & updates</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-300" />
                <span>Competitive shipping rates</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-300" />
                <span>24/7 customer support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Header with Back Button and Progress */}
        <div className="p-6 border-b bg-white">
          <div className="flex items-center justify-between mb-6">
            {currentStep > 1 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={prevStep}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
            )}
            <div className="lg:hidden flex items-center gap-2">
              <Truck className="w-6 h-6 text-gray-600" />
              <h1 className="text-2xl font-bold text-gray-800">Liberty Express</h1>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: currentStep >= step.id ? '#2563eb' : '#e5e7eb',
                      scale: currentStep === step.id ? 1.1 : 1
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  >
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </motion.div>
                  <span className="text-xs mt-2 text-center max-w-20 text-gray-600">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: currentStep > step.id ? '#2563eb' : '#e5e7eb'
                    }}
                    className="h-0.5 w-16 mx-4 mt-4"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-8 bg-white overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto"
            >
              <h2 className="text-2xl font-bold mb-2 text-gray-800">{steps[currentStep - 1].title}</h2>
              <p className="text-gray-600 mb-8">{steps[currentStep - 1].description}</p>

              {/* Step 1: Company Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <InputField
                    id="contactPerson"
                    type="text"
                    placeholder="e.g. John Smith"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    onBlur={() => handleBlur('contactPerson')}
                    icon={User}
                    error={formErrors.contactPerson}
                    label="Contact Person"
                  />

                  <InputField
                    id="email"
                    type="email"
                    placeholder="e.g. john@abclogistics.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    icon={Mail}
                    error={formErrors.email}
                    label="Business Email"
                  />

                  <InputField
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    icon={Phone}
                    error={formErrors.phone}
                    label="Phone Number"
                  />

                  <InputField
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    icon={Lock}
                    error={formErrors.password}
                    label="Password"
                    showToggle={true}
                    toggleValue={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />
                </div>
              )}

              {/* Step 2: Business Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <InputField
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    icon={Lock}
                    error={formErrors.confirmPassword}
                    label="Confirm Password"
                    showToggle={true}
                    toggleValue={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  />

                  <InputField
                    id="address"
                    type="text"
                    placeholder="Enter your complete business address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                    icon={MapPin}
                    error={formErrors.address}
                    label="Business Address"
                  />

                  <SelectField
                    id="businessType"
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    onBlur={() => handleBlur('businessType')}
                    error={formErrors.businessType}
                    label="Business Type"
                    placeholder="Select your business type"
                    options={[
                      { value: 'manufacturer', label: 'Manufacturer' },
                      { value: 'retailer', label: 'Retailer' },
                      { value: 'distributor', label: 'Distributor' },
                      { value: 'ecommerce', label: 'E-commerce' },
                      { value: 'other', label: 'Other' }
                    ]}
                  />

                  <SelectField
                    id="shipmentVolume"
                    value={formData.shipmentVolume}
                    onChange={(e) => handleInputChange('shipmentVolume', e.target.value)}
                    onBlur={() => handleBlur('shipmentVolume')}
                    error={formErrors.shipmentVolume}
                    label="Monthly Shipment Volume"
                    placeholder="Select shipment volume"
                    options={[
                      { value: '1-50', label: '1-50 packages' },
                      { value: '51-200', label: '51-200 packages' },
                      { value: '201-500', label: '201-500 packages' },
                      { value: '500+', label: '500+ packages' }
                    ]}
                  />
                </div>
              )}

              {/* Step 3: Service Setup */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <SelectField
                    id="serviceType"
                    value={formData.serviceType}
                    onChange={(e) => handleInputChange('serviceType', e.target.value)}
                    onBlur={() => handleBlur('serviceType')}
                    error={formErrors.serviceType}
                    label="Primary Service Needed"
                    placeholder="Select service type"
                    icon={Package}
                    options={[
                      { value: 'domestic', label: 'Domestic Shipping' },
                      { value: 'international', label: 'International Shipping' },
                      { value: 'warehousing', label: 'Warehousing & Fulfillment' },
                      { value: 'freight', label: 'Freight & LTL' },
                      { value: 'express', label: 'Express Delivery' }
                    ]}
                  />

                  <div>
                    <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requirements (Optional)
                    </label>
                    <textarea
                      id="specialRequirements"
                      placeholder="Any special handling, insurance, or delivery requirements..."
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-800">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Ready to get started!</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Your logistics partner account will be created and you'll receive a welcome email with next steps.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-12">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={currentStep === 3 ? handleSubmit : nextStep}
                  disabled={loading}
                  className="w-full h-12 bg-gray-900 cursor-pointer hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : currentStep === 3 ? (
                    <>
                      <Truck className="w-4 h-4" />
                      Create Account
                    </>
                  ) : (
                    'Continue'
                  )}
                </motion.button>

                {currentStep === 1 && (
                  <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-gray-600 font-medium hover:underline">
                      Sign In
                    </Link>
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Signup;
