import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const { axios, SetToken } = useAppContext();

    const [email, SetEmail] = useState('');
    const [password, SetPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const { data } = await axios.post('/api/admin/login', { email, password })

            if (data.success) {
                SetToken(data.token)
                localStorage.setItem('token', data.token)
                axios.defaults.headers.common['Authorization'] = data.token
                toast.success('Login successful')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='w-full py-6 text-center'>
                        <h1 className='text-3xl font-bold'> <span className='text-primary'>Admin</span>Login</h1>
                        <p className='font-light'>Enter your credentials to access the admin panel</p>
                    </div>
                    <form onSubmit={handleSubmit} className='mt-6 w-full sm:max-w-md text-gray-600 '>
                        <div className='flex flex-col'>
                            <label>Email</label>
                            <input onChange={e => SetEmail(e.target.value)} value={email} type="email" placeholder='Your Email id' required className='border-b-2 border-gray-300 py-2 outline-none mb-6' />
                        </div>

                        <div className='flex flex-col'>
                            <label>Password</label>
                            <input onChange={e => SetPassword(e.target.value)} value={password} type="password" placeholder='Your Password' required className='border-b-2 border-gray-300 py-2 outline-none mb-6' />
                        </div>
                        <button type='submit' className=' font-medium py-3 rounded w-full bg-primary text-white cursor-pointer hover:bg-primary/90 transition-all'>Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
