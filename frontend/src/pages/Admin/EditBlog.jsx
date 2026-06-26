import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, blogCategories } from '../../assets/assets'
import Quill from 'quill'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { parse } from 'marked'

const EditBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { axios, fetchBlogs } = useAppContext()

  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const [image, setImage] = useState(null)
  const [existingImage, setExistingImage] = useState('')
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Startup')
  const [isPublished, setPublished] = useState(false)

  const fetchBlog = async () => {
    try {
      setFetching(true)
      const { data } = await axios.get('/api/admin/blogs')
      if (!data.success) {
        toast.error(data.message)
        return
      }
      const blog = data.blogs.find((b) => String(b._id) === String(id))
      if (!blog) {
        toast.error('Blog not found')
        navigate('/admin/listBlog')
        return
      }
      setTitle(blog.title)
      setSubTitle(blog.subTitle || '')
      setCategory(blog.category)
      setPublished(blog.isPublished)
      setExistingImage(blog.image)
      setDescription(blog.description || '')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setFetching(false)
    }
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      setIsSaving(true)

      const blog = {
        title,
        subTitle,
        description: quillRef.current?.root.innerHTML || description,
        category,
        isPublished
      }

      const formData = new FormData()
      formData.append('blog', JSON.stringify(blog))
      if (image) formData.append('image', image)

      const { data } = await axios.post(`/api/blog/update/${id}`, formData)
      if (data.success) {
        toast.success(data.message)
        await fetchBlogs()
        navigate('/admin/listBlog')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const generateContent = async () => {
    if (!title) return toast.error('Please enter a title')

    try {
      setLoading(true)
      const { data } = await axios.post('/api/blog/generate', { prompt: title })
      if (data.success) {
        const html = parse(data.content)
        if (quillRef.current) {
          quillRef.current.root.innerHTML = html
        }
        setDescription(html)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    quillRef.current = null
    fetchBlog()
  }, [id])

  useEffect(() => {
    if (fetching || !editorRef.current || quillRef.current) return

    quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    if (description) {
      quillRef.current.root.innerHTML = description
    }
  }, [fetching, description])

  if (fetching) {
    return (
      <div className='flex-1 flex justify-center items-center bg-blue-50/50 min-h-[60vh]'>
        <div className='animate-spin rounded-full h-16 w-16 border-4 border-t-white border-gray-700'></div>
      </div>
    )
  }

  const previewImage = image ? URL.createObjectURL(image) : existingImage

  return (
    <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'>
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>
        <p>Thumbnail (leave unchanged to keep current image)</p>
        <label htmlFor='image'>
          <img src={previewImage || assets.upload_area} alt='upload-area' className='mt-2 h-16 rounded cursor-pointer object-cover' />
          <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden />
        </label>

        <p className='mt-4'>Blog Title</p>
        <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' placeholder='Type here' required className='w-full max-w-lg mt-2 pt-2 border border-gray-300 outline-none rounded' />

        <p className='mt-4'>SubTitle</p>
        <input onChange={(e) => setSubTitle(e.target.value)} value={subTitle} type='text' placeholder='Type here' className='w-full max-w-lg mt-2 pt-2 border border-gray-300 outline-none rounded' />

        <p className='mt-4'>Blog Description</p>
        <div className='max-w-lg pb-16 sm:pb-10 pt-2 relative'>
          <div ref={editorRef}></div>
          {loading && (
            <div className='absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2'>
              <div className='w-8 h-8 rounded-full border-2 border-t-white animate-spin'></div>
            </div>
          )}
          <button disabled={loading} onClick={generateContent} type='button' className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer'>Generate with AI</button>
        </div>

        <p className='mt-4'>Blog Category</p>
        <select onChange={(e) => setCategory(e.target.value)} value={category} name='category' className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded'>
          {blogCategories.map((item, index) => (
            <option key={index} value={item}>{item}</option>
          ))}
        </select>

        <div className='flex gap-2 mt-4'>
          <p>Publish Now</p>
          <input onChange={(e) => setPublished(e.target.checked)} type='checkbox' checked={isPublished} className='scale-125 cursor-pointer' />
        </div>

        <div className='flex gap-3 mt-8'>
          <button disabled={isSaving} type='submit' className='w-40 h-10 bg-primary text-white cursor-pointer rounded text-sm'>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type='button' onClick={() => navigate('/admin/listBlog')} className='w-32 h-10 border border-gray-300 cursor-pointer rounded text-sm'>
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}

export default EditBlog
