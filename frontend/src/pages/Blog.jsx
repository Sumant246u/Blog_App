import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { assets } from '../assets/assets'
import Navbar from '../components/Navbar'
import Moment from 'moment'
import Loader from '../components/Loader'
import Footer from '../components/Footer'
import NotFound from './NotFound'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Blog = () => {
  const { slug } = useParams()
  const { axios } = useAppContext()

  const [status, setStatus] = useState('loading')
  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  const fetchBlogData = async () => {
    setStatus('loading')
    setData(null)
    try {
      const { data: res, status: httpStatus } = await axios.get(`/api/blog/${slug}`)
      if (res.success) {
        setData(res.blog)
        setStatus('found')
      } else if (httpStatus === 404) {
        setStatus('notFound')
      } else {
        setStatus('error')
        toast.error(res.message)
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setStatus('notFound')
      } else {
        setStatus('error')
        toast.error(error.message)
      }
    }
  }

  const fetchComments = async (blogId) => {
    try {
      const { data } = await axios.post('/api/blog/comments', { blogId })
      if (data.success) {
        setComments(data.comments)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const addComment = async (e) => {
    e.preventDefault()
    if (!data?._id) return

    try {
      const { data: res } = await axios.post('/api/blog/add-comment', { blog: data._id, name, content })
      if (res.success) {
        toast.success(res.message)
        setName('')
        setContent('')
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareLinks = data ? {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(data.title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  } : {}

  useEffect(() => {
    fetchBlogData()
  }, [slug])

  useEffect(() => {
    if (data?._id) fetchComments(data._id)
  }, [data?._id])

  if (status === 'loading') return <Loader />
  if (status === 'notFound') return <NotFound title='404' message='Blog not found' />
  if (status === 'error') return <NotFound title='Error' message='Something went wrong' />

  return (
    <div className='relative'>
      <Helmet>
        <title>{data.title} | QuickBlog</title>
        <meta name='description' content={data.subTitle || data.title} />
        <meta property='og:title' content={data.title} />
        <meta property='og:description' content={data.subTitle || data.title} />
        <meta property='og:image' content={data.image} />
        <meta property='og:type' content='article' />
        <meta name='twitter:card' content='summary_large_image' />
      </Helmet>

      <img src={assets.gradientBackground} alt='' className='absolute -top-50 -z-1 opacity-50' />
      <Navbar />

      <div className='text-center mt-20 text-gray-600'>
        <p className='text-primary py-4 font-medium'>
          Published on {Moment(data.createdAt).format('MMMM Do YYYY')} · {data.views || 0} views
        </p>
        <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>{data.title}</h1>
        <h2 className='my-5 max-w-lg mx-auto truncate'>{data.subTitle}</h2>
        <p className='inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary'>QuickBlog Team</p>
      </div>

      <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
        <img src={data.image} alt={data.title} className='rounded-3xl mb-5' />

        <div className='rich-text max-w-3xl mx-auto' dangerouslySetInnerHTML={{ __html: data.description }}></div>

        <div className='mt-10 mb-10 max-w-3xl mx-auto'>
          <p className='font-semibold mb-4'>Comments ({comments.length})</p>
          <div className='flex flex-col gap-4'>
            {comments.map((item) => (
              <div key={item._id} className='relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <img src={assets.user_icon} alt='' className='w-6' />
                  <p className='font-medium'>{item.name}</p>
                </div>
                <p className='text-sm max-w-md ml-8'>{item.content}</p>
                <div className='absolute right-4 bottom-3 flex items-center gap-2 text-xs'>{Moment(item.createdAt).fromNow()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className='max-w-3xl mx-auto'>
          <p className='font-semibold mb-4'>Add your comment</p>
          <form onSubmit={addComment} className='flex flex-col items-start gap-4 max-w-lg'>
            <input onChange={(e) => setName(e.target.value)} value={name} type='text' placeholder='Name' required className='w-full p-2 border border-gray-300 rounded outline-none' />
            <textarea onChange={(e) => setContent(e.target.value)} value={content} placeholder='Comment' required className='w-full p-2 border border-gray-300 rounded outline-none h-48'></textarea>
            <button type='submit' className='bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer'>Submit</button>
          </form>
        </div>

        <div className='my-24 max-w-3xl mx-auto'>
          <p className='font-semibold my-4'>Share this article on social media</p>
          <div className='flex gap-4'>
            <a href={shareLinks.twitter} target='_blank' rel='noreferrer' aria-label='Share on Twitter'>
              <img src={assets.twitter_icon} alt='Twitter' className='w-10 hover:scale-110 transition-all' />
            </a>
            <a href={shareLinks.facebook} target='_blank' rel='noreferrer' aria-label='Share on Facebook'>
              <img src={assets.facebook_icon} alt='Facebook' className='w-10 hover:scale-110 transition-all' />
            </a>
            <a href={shareLinks.linkedin} target='_blank' rel='noreferrer' aria-label='Share on LinkedIn'>
              <img src={assets.googleplus_icon} alt='LinkedIn' className='w-10 hover:scale-110 transition-all' />
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Blog
