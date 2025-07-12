import { Outlet } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <div className='w-full h-full'>
     <Outlet/>
     <ToastContainer/>
    </div>
  )
}

export default App
