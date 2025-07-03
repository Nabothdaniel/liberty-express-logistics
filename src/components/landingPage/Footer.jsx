import React from 'react'

const Footer = () => {
  return (
    <div className='flex  rounded-tl-[3rem] shadow-sm md:rounded-lg flex-col md:flex-row md:items-center px-4 md:px-20 text-left md:text-center justify-between py-10 bg-gray-900 text-white gap-5 md:gap-0'>
        <div>
            <h1 className=' font-bold text-2xl md:mb-3'>Liberty Express</h1>
            <ul className='my-5 md:my-0'>
                <li className='mb-2 hover:text-blue-500'><a href="#" >Home</a></li>
                <li className='mb-2 hover:text-blue-500'><a href="#">About</a></li>
                <li className='mb-2 hover:text-blue-500'><a href="#">Products & solutions</a></li>
            </ul>
        </div>
       
        <ul>
            <li className='mb-2 hover:text-blue-500'><a href="#">Privacy Policy</a></li>
            <li className='hover:text-blue-500'><a href="#">User Data Policy</a></li>
        </ul>
        <div>
            <p className='cursor-pointer hover:text-blue-500'> &copy; {new Date().getFullYear()}  Liberty Express </p>
        </div>
    </div>
  )
}

export default Footer
