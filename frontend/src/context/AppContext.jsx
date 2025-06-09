import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;



const AppContext = createContext()




export const AppProvider = ({ children }) => {

    const navigate = useNavigate()

    const [token, SetToken] = useState(null)
    const [blogs, SetBlogs] = useState([])
    const [input, SetInput] = useState('')

    const fetchBlogs = async () => {

        try {
            const { data } = await axios.get('/api/blog/all')
            data.success ? SetBlogs(data.blogs) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        fetchBlogs();
        const token= localStorage.getItem('token')
        if (token) {
            SetToken(token)
            axios.defaults.headers.common['Authorization'] = `${token}`;
        }
    },[])

    const value = {
        axios, navigate,SetToken, token, blogs, SetBlogs, input, SetInput
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