
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiEye, FiEyeOff, FiUser, FiMail, FiPhone, FiLock, FiCheck, FiTruck, FiPackage, FiMapPin } from 'react-icons/fi';
import { BsBuilding } from 'react-icons/bs';



const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
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

  const steps = [
    { id: 1, title: 'Company Details', description: 'Basic company information' },
    { id: 2, title: 'Business Info', description: 'Shipping requirements' },
    { id: 3, title: 'Service Setup', description: 'Preferences & verification' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Logistics form submitted:', formData);
    alert('Welcome to LogiFlow! Your account has been created successfully.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('/lovable-uploads/45c4a90c-72e9-4b32-a9d4-2978ba1e6085.png')`
          }}
        />
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <FiTruck className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Liberty Express</h1>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold mb-4">Streamline Your Logistics Today!</h2>
            <p className="text-lg leading-relaxed text-blue-100">
              Join thousands of businesses that trust LogiFlow for their shipping 
              and logistics needs. Our platform makes it easy to manage your 
              supply chain from start to finish.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <FiCheck className="w-5 h-5 text-green-300" />
                <span>Real-time tracking & updates</span>
              </div>
              <div className="flex items-center gap-3">
                <FiCheck className="w-5 h-5 text-green-300" />
                <span>Competitive shipping rates</span>
              </div>
              <div className="flex items-center gap-3">
                <FiCheck className="w-5 h-5 text-green-300" />
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
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
            )}
            <div className="lg:hidden flex items-center gap-2">
              <FiTruck className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-blue-600">Liberty Express</h1>
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
                    {currentStep > step.id ? <FiCheck className="w-4 h-4" /> : step.id}
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
        <div className="flex-1 p-8 bg-white">
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
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <div className="relative">
                      <BsBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        id="companyName"
                        type="text"
                        placeholder="e.g. ABC Logistics Inc."
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        id="contactPerson"
                        type="text"
                        placeholder="e.g. John Smith"
                        value={formData.contactPerson}
                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                        className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Email
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        id="email"
                        type="email"
                        placeholder="e.g. john@abclogistics.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a secure password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full h-12 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Business Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="w-full h-12 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        id="address"
                        type="text"
                        placeholder="Enter your complete business address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type
                    </label>
                    <select
                      id="businessType"
                      value={formData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select your business type</option>
                      <option value="manufacturer">Manufacturer</option>
                      <option value="retailer">Retailer</option>
                      <option value="distributor">Distributor</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="shipmentVolume" className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Shipment Volume
                    </label>
                    <select
                      id="shipmentVolume"
                      value={formData.shipmentVolume}
                      onChange={(e) => handleInputChange('shipmentVolume', e.target.value)}
                      className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select shipment volume</option>
                      <option value="1-50">1-50 packages</option>
                      <option value="51-200">51-200 packages</option>
                      <option value="201-500">201-500 packages</option>
                      <option value="500+">500+ packages</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Service Setup */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Service Needed
                    </label>
                    <div className="relative">
                      <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        id="serviceType"
                        value={formData.serviceType}
                        onChange={(e) => handleInputChange('serviceType', e.target.value)}
                        className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="">Select service type</option>
                        <option value="domestic">Domestic Shipping</option>
                        <option value="international">International Shipping</option>
                        <option value="warehousing">Warehousing & Fulfillment</option>
                        <option value="freight">Freight & LTL</option>
                        <option value="express">Express Delivery</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requirements
                    </label>
                    <textarea
                      id="specialRequirements"
                      placeholder="Any special handling, insurance, or delivery requirements..."
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800">
                      <FiCheck className="w-4 h-4" />
                      <span className="text-sm font-medium">Ready to get started!</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
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
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  {currentStep === 3 ? (
                    <>
                      <FiTruck className="w-4 h-4" />
                      Create Account
                    </>
                  ) : (
                    'Continue'
                  )}
                </motion.button>

                {currentStep === 1 && (
                  <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{' '}
                    <a href="#" className="text-blue-600 font-medium hover:underline">
                      Sign In
                    </a>
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
