import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import BlogTableItem from '../../components/Admin/BlogTableItem'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {
    const [dashboard, setDashboard] = useState({
        blogs: 0,
        comments: 0,
        drafts: 0,
        recentBlogs: []
    })

    const { axios } = useAppContext()

    const fetchDashboard = async () => {
        try {
            const { data } = await axios.get('/api/admin/dashboard')
            data.success ? setDashboard(data.dashboard) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchDashboard()
    }, [])

    return (
        <div className='flex-1 p-3 sm:p-4 md:p-10 bg-blue-50/50'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
                <div className='flex items-center gap-4 bg-white p-4 rounded shadow'>
                    <img src={assets.dashboard_icon_1} alt='' className='w-10 shrink-0' />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashboard.blogs}</p>
                        <p className='text-gray-400 font-light text-sm'>Blogs</p>
                    </div>
                </div>

                <div className='flex items-center gap-4 bg-white p-4 rounded shadow'>
                    <img src={assets.dashboard_icon_2} alt='' className='w-10 shrink-0' />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashboard.comments}</p>
                        <p className='text-gray-400 font-light text-sm'>Comments</p>
                    </div>
                </div>

                <div className='flex items-center gap-4 bg-white p-4 rounded shadow sm:col-span-2 lg:col-span-1'>
                    <img src={assets.dashboard_icon_3} alt='' className='w-10 shrink-0' />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashboard.drafts}</p>
                        <p className='text-gray-400 font-light text-sm'>Drafts</p>
                    </div>
                </div>
            </div>

            <div className='mt-6'>
                <div className='flex items-center gap-3 mb-3 text-gray-600'>
                    <img src={assets.dashboard_icon_4} alt='' className='w-5' />
                    <p className='font-medium'>Latest Blogs</p>
                </div>

                <div className='w-full overflow-x-auto shadow rounded-lg bg-white'>
                    <table className='w-full min-w-[320px] text-sm text-gray-500'>
                        <thead className='text-xs text-gray-600 text-left uppercase bg-gray-50'>
                            <tr>
                                <th scope='col' className='px-2 py-3 sm:px-4'>#</th>
                                <th scope='col' className='px-2 py-3 sm:px-4'>Blog Title</th>
                                <th scope='col' className='px-2 py-3 sm:px-4 max-sm:hidden'>Date</th>
                                <th scope='col' className='px-2 py-3 sm:px-4 max-sm:hidden'>Status</th>
                                <th scope='col' className='px-2 py-3 sm:px-4'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboard.recentBlogs.map((blog, index) => (
                                <BlogTableItem key={blog._id} blog={blog} fetchBlog={fetchDashboard} index={index + 1} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
