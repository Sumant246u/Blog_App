import React, { useEffect, useState } from 'react'
import BlogTableItem from '../../components/Admin/BlogTableItem'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
const ListBlog = () => {

  const [Blogs, SetBlogs] = useState([]);

  const {axios}= useAppContext();

  const fetchBlog = async () => {
    // SetBlogs(blog_data);

    try {
      const {data}= await axios.get('/api/admin/blogs')
      if (data.success) {
        SetBlogs(data.blogs)

      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchBlog();
  }, [])
  return (
    <div className='flex-1 p-3 sm:p-5 md:pt-12 md:px-16 bg-blue-50/50'>
      <h1 className='text-lg sm:text-xl font-semibold text-gray-700'>All Blogs</h1>

      <div className='w-full mt-4 overflow-x-auto shadow rounded-lg bg-white'>
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
            {Blogs.map((blog, index) => (
              <BlogTableItem key={blog._id} blog={blog} fetchBlog={fetchBlog} index={index + 1} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListBlog
