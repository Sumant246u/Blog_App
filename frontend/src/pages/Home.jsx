import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Bloglist from '../components/Bloglist'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'
import { useAppContext } from '../context/AppContext'

const Home = () => {
  const { fetchBlogs } = useAppContext();

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <Navbar/>
      <Header/>
      <Bloglist/>
      <Newsletter/>
      <Footer/>
    </>
  )
}

export default Home
