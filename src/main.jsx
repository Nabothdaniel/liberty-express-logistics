import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

//react router dom

import {createBrowserRouter, RouterProvider} from 'react-router-dom';

//pages
import Login from './pages/Login.jsx'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx';
import Signup from './pages/Signup.jsx';


const router = createBrowserRouter([
  {
    path:'/',
    element:<Landing/>,
  },
  {
    path:'/dashboard',
    element:<Dashboard/>,
  },
  {
    path:'/login',
    element:<Login/>,
  },
    {
    path:'/signup',
    element:<Signup/>,
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
