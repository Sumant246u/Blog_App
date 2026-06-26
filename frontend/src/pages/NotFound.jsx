import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const NotFound = ({ title = '404', message = 'Page not found', showHome = true }) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-1 flex flex-col items-center justify-center text-center px-6 py-20'>
        <p className='text-primary font-semibold text-lg mb-2'>{title}</p>
        <h1 className='text-3xl sm:text-5xl font-bold text-gray-800 mb-4'>{message}</h1>
        <p className='text-gray-500 max-w-md mb-8'>
          The page you are looking for does not exist or may have been removed.
        </p>
        {showHome && (
          <Link
            to='/'
            className='bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-all'
          >
            Back to Home
          </Link>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default NotFound
