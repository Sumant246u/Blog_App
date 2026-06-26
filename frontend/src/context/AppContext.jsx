import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL?.trim() || '';

const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const navigate = useNavigate()

    const [token, SetToken] = useState(null)
    const [blogs, SetBlogs] = useState([])
    const [input, SetInput] = useState('')

    const logout = () => {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        SetToken(null)
    }

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get('/api/blog/all')
            data.success ? SetBlogs(data.blogs) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchBlogs();
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
            SetToken(storedToken)
            axios.defaults.headers.common['Authorization'] = storedToken;
        }
    }, [])

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401 && localStorage.getItem('token')) {
                    logout()
                    toast.error('Session expired. Please login again.')
                    navigate('/admin')
                }
                return Promise.reject(error)
            }
        )
        return () => axios.interceptors.response.eject(interceptor)
    }, [navigate])

    const value = {
        axios, navigate, SetToken, token, blogs, SetBlogs, input, SetInput, fetchBlogs, logout
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
};
