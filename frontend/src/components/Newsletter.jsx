import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Newsletter = () => {
    const { axios } = useAppContext()
    const [email, setEmail] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            const { data } = await axios.post('/api/newsletter/subscribe', { email })
            if (data.success) {
                toast.success(data.message)
                setEmail('')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className='flex flex-col items-center justify-center text-center space-y-2 my-32'>
            <h1 className='md:text-4xl text-2xl font-semibold'>Never miss a Blog!</h1>
            <p className='md:text-lg text-gray-500/70 pb-8'>Subscribe to get the latest blog posts and tech updates.</p>
            <form onSubmit={handleSubmit} className='flex items-center justify-between max-w-2xl w-full md:h-13 h-12'>
                <input
                    className='border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500'
                    type='email'
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button
                    disabled={submitting}
                    className='md:px-12 px-8 h-full text-white bg-primary/80 hover:bg-primary transition-all cursor-pointer rounded-md rounded-l-none disabled:opacity-60'
                    type='submit'
                >
                    {submitting ? '...' : 'Subscribe'}
                </button>
            </form>
        </div>
    )
}

export default Newsletter
