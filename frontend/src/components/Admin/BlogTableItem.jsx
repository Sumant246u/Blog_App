import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const BlogTableItem = ({ blog, index, fetchBlog }) => {
    const { title, createdAt } = blog
    const blogDate = new Date(createdAt)
    const navigate = useNavigate()
    const { axios, fetchBlogs } = useAppContext()

    const deleteBlog = async () => {
        const confirm = window.confirm('Are you sure you want to delete this blog ?')
        if (!confirm) return

        try {
            const { data } = await axios.post('/api/blog/delete', { id: blog._id })
            if (data.success) {
                toast.success(data.message)
                await fetchBlog()
                await fetchBlogs()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const togglePublish = async () => {
        try {
            const { data } = await axios.post('/api/blog/toggle-publish', { id: blog._id })
            if (data.success) {
                toast.success(data.message)
                await fetchBlog()
                await fetchBlogs()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <tr className='border-y border-gray-200'>
            <td className='px-2 py-3 sm:px-4 align-top'>{index}</td>
            <td className='px-2 py-3 sm:px-4 align-top min-w-0 max-w-[110px] sm:max-w-xs'>
                <p className='truncate font-medium text-gray-700' title={title}>{title}</p>
                <p className={`sm:hidden text-[10px] mt-1 ${blog.isPublished ? 'text-green-600' : 'text-orange-600'}`}>
                    {blog.isPublished ? 'Published' : 'Unpublished'}
                </p>
            </td>
            <td className='px-2 py-3 sm:px-4 max-sm:hidden align-top whitespace-nowrap'>{blogDate.toDateString()}</td>
            <td className='px-2 py-3 sm:px-4 max-sm:hidden align-top'>
                <span className={`text-xs px-2 py-0.5 rounded-full ${blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {blog.isPublished ? 'Published' : 'Unpublished'}
                </span>
            </td>
            <td className='px-2 py-3 sm:px-4 align-top'>
                <div className='flex flex-col sm:flex-row gap-1 sm:gap-2'>
                    <button
                        onClick={() => navigate(`/admin/editBlog/${blog._id}`)}
                        className='border px-2 py-1 rounded cursor-pointer text-primary text-[11px] sm:text-xs whitespace-nowrap'
                    >
                        Edit
                    </button>
                    <button
                        onClick={togglePublish}
                        className='border px-2 py-1 rounded cursor-pointer text-[11px] sm:text-xs whitespace-nowrap'
                    >
                        {blog.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={deleteBlog} aria-label='Delete blog' className='self-start p-1'>
                        <img src={assets.cross_icon} alt='' className='w-6 sm:w-7 hover:scale-110 transition-all cursor-pointer' />
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default BlogTableItem
