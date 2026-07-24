import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { RxDashboard } from 'react-icons/rx';
import { useAuth } from '../../auth/useAuth';
import DashboardUserBox from './user-box';
import { Link } from 'react-router-dom';

const DashboardHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  const navItems = [{ name: 'Dashboard', active: true,link:'/dashboard' }];

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${sidebarOpen ? 'block' : 'hidden'
          }`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:hidden`}
      >
        <div className="flex items-center justify-between p-4">
          <Link to={'/dashboard'} className="text-lg font-bold text-gray-900">Liberty Express</Link>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-gray-900">
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 flex flex-col">
          {navItems.map((item) => (
            <Link to={item.link}
              key={item.name}
              className={`w-full text-left mb-2 px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer ${item.active
                  ? 'bg-gray-200 text-gray-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <RxDashboard className="inline-block md:hidden mr-2" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            <Link to={'/dashboard'} className="text-xl font-bold text-gray-900 hidden lg:block">Liberty Express</Link>

            <nav className="hidden lg:flex space-x-6">
              {navItems.map((item) => (
                <Link to={item.link}
                  key={item.name}
                  className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition-colors ${item.active ? 'bg-gray-100 text-gray-700' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {item.active && (
                    <span className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-2" />
                  )}
                  {item.name}
                </Link >
              ))}
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <DashboardUserBox user={user} loading={loading} />
          </div>
        </div>
      </header>
    </>
  );
};

export default DashboardHeader;
