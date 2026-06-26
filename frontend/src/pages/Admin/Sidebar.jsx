import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'

const navClass = ({ isActive }) =>
    `flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 py-3 px-2 md:px-9 w-full min-h-[56px] cursor-pointer transition-colors ${
        isActive
            ? 'bg-primary/10 text-primary md:border-r-4 md:border-primary'
            : 'text-gray-500 hover:bg-gray-50'
    }`

const Sidebar = () => {
    return (
        <aside className='flex flex-col w-[72px] md:w-64 shrink-0 border-r border-gray-200 bg-white overflow-y-auto'>
            <NavLink end to='/admin' className={navClass}>
                <img src={assets.home_icon} alt='' className='w-5 h-5 shrink-0' />
                <span className='text-[10px] md:text-sm leading-tight text-center md:text-left'>Dashboard</span>
            </NavLink>

            <NavLink end to='/admin/addBlog' className={navClass}>
                <img src={assets.add_icon} alt='' className='w-5 h-5 shrink-0' />
                <span className='text-[10px] md:text-sm leading-tight text-center md:text-left'>Add Blog</span>
            </NavLink>

            <NavLink end to='/admin/listBlog' className={navClass}>
                <img src={assets.list_icon} alt='' className='w-5 h-5 shrink-0' />
                <span className='text-[10px] md:text-sm leading-tight text-center md:text-left'>Blog List</span>
            </NavLink>

            <NavLink end to='/admin/comments' className={navClass}>
                <img src={assets.comment_icon} alt='' className='w-5 h-5 shrink-0' />
                <span className='text-[10px] md:text-sm leading-tight text-center md:text-left'>Comments</span>
            </NavLink>
        </aside>
    )
}

export default Sidebar
