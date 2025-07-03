import  { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiTruck } from 'react-icons/fi';
import FormImg from '../assets/images/forms/form.jpg'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = () => {
    console.log('Logging in with:', formData);
    alert('Login submitted!');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section (Optional Branding) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 relative">
        <div className="absolute inset-0 bg-black/20" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${FormImg})`
          }}
        />
        <div className="relative z-10 p-12 text-white flex flex-col justify-between">
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
            <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Log in to manage your shipments and track deliveries with ease.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Section (Login Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <div className="flex justify-center items-center gap-2 mb-2 text-blue-600">
              <FiTruck className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Liberty Express</h2>
            </div>
            <p className="text-gray-600">Log in to your account</p>
          </div>

          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. user@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full h-12 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              className="w-full h-12 bg-gray-900 active:bg-gray-700 hover:bg-gray-700 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
            >
              Login
            </motion.button>

            <p className="text-sm text-center text-gray-600 mt-4">
              Don't have an account?{' '}
              <a href="#" className="text-blue-600 font-medium hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
