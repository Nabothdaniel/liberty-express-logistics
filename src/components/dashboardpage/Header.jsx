import { useState } from 'react';
import { FiSearch, FiBell, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { RxDashboard } from "react-icons/rx";

const DashboardHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', active: true },
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <div className="flex items-center justify-between p-4 ">
          <h2 className="text-lg font-bold text-gray-900">Liberty Express</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-gray-900">
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`w-full text-left mb-2 px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer ${
                item.active
                  ? 'bg-gray-200 text-gray-700'
                  : 'text-gray-600  active:bg-gray-100 hover:bg-gray-100 active:text-gray-900 hover:text-gray-900'
              }`}
            >
              <RxDashboard className=" inline-block md:hidden mr-2" />
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Hamburger menu for mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            <h1 className="text-xl font-bold text-gray-900 hidden lg:block">
              Liberty Express
            </h1>

            {/* Desktop nav */}
            <nav className="hidden lg:flex space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-gray-100 text-gray-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.active && (
                    <span className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                  )}
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Right user section */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <FiSearch className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 relative">
              <FiBell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
                alt="Anna Green"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-sm hidden md:block">
                <div className="font-medium text-gray-900">Anna Green</div>
                <div className="text-gray-500">Account Executive</div>
              </div>
              <FiChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default DashboardHeader;
