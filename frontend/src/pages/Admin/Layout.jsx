import React from 'react'
import { assets } from '../../assets/assets'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
    const { axios, SetToken, navigate } = useAppContext()

    const logout = () => {
        localStorage.removeItem('token')
        axios.defaults.headers.common['Authorization'] = null
        SetToken(null)
        navigate('/')
    }

    return (
        <>
            <div className='flex items-center justify-between py-2 h-[60px] sm:h-[70px] px-3 sm:px-12 border-b border-gray-200'>
                <img
                    onClick={() => navigate('/')}
                    src={assets.logo}
                    alt='logo'
                    className='w-28 sm:w-40 cursor-pointer'
                />
                <button
                    onClick={logout}
                    className='text-xs sm:text-sm px-4 sm:px-8 py-2 bg-primary text-white rounded-full cursor-pointer whitespace-nowrap'
                >
                    Logout
                </button>
            </div>

            <div className='flex h-[calc(100vh-60px)] sm:h-[calc(100vh-70px)]'>
                <Sidebar />
                <main className='flex-1 min-w-0 overflow-y-auto overflow-x-hidden'>
                    <Outlet />
                </main>
            </div>
        </>
    )
}

export default Layout
