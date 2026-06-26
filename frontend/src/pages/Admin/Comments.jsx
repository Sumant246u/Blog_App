import React, { useEffect, useState } from 'react'
import CommentTable from '../../components/Admin/CommentTable'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Comments = () => {

  const [comments,SetComments]= useState([])
  const [filter,SetFilter]= useState('Not Approved')

  const {axios}= useAppContext();

  const fetchComments = async ()=>{
      // SetComments(comments_data)
      try {
        const {data}= await axios.get('/api/admin/comments')
        data. success ? SetComments(data.comments) : toast.error(data. message)
      } catch (error) {
        toast.error(error.message)
      }
  }

  useEffect(()=>{
    fetchComments();
  },[])
  return (
    <div className='flex-1 p-3 sm:p-5 md:pt-12 md:px-16 bg-blue-50/50'>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>
        <h1 className='text-lg sm:text-xl font-semibold text-gray-700'>Comments</h1>
        <div className='flex gap-2 sm:gap-4'>
          <button onClick={()=>SetFilter('Approved')} className={` shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${filter === 'Approved' ? 'text-primary' :'text-gray-700'}`}>Approved</button>

          <button onClick={() => SetFilter('Not Approved')} className={` shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${filter === 'Not Approved' ? 'text-primary' : 'text-gray-700'}`}>Not Approved</button>

        </div>
      </div>

      <div className='w-full overflow-x-auto mt-4 bg-white shadow rounded-lg'>
          <table className='w-full min-w-[300px] text-sm text-gray-500'>
             <thead className='text-xs text-gray-700 text-left uppercase'>
                <tr>
                  <th scope='col' className='px-6 py-3'>Blog Title & Comment</th>
                  <th scope='col' className='px-6 py-3 max-sm:hidden'>DATE</th>
                  <th scope='col' className='px-6 py-3'>ACTION</th>
                </tr>
             </thead>
             <tbody>
              {comments.filter((comment)=>{
                if (filter === 'Approved') return comment.isApproved === true;
                return comment.isApproved === false
              }).map((comment,index)=> <CommentTable key={comment._id} comment={comment} index={index+1} fetchComments={fetchComments}/>)}
             </tbody>
          </table>
      </div>
    </div>
  )
}

export default Comments
