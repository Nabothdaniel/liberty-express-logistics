import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

//react router dom

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './auth/useAuth.jsx';

//pages
import Login from './pages/Login.jsx'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx';
import Signup from './pages/Signup.jsx';
import Track from './pages/TrackingDashboard.jsx';
import UserChat from './components/chats/user-chats.jsx';
import ProtectedRoute from './components/protectedRoute.jsx';
import AdminConversationsList from './pages/AdminChats.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/chat',
    element: <UserChat />
  },
  {
    path: '/admin-chats',
    element: <AdminConversationsList />
  },
  {
    path: '/track',
    element: (
      <Track />
    ),
  },
  {
    path: '/track/:id',
    element: (
      <ProtectedRoute>
        <Track />
      </ProtectedRoute>
    ),
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </AuthProvider>
  </StrictMode>,
)
