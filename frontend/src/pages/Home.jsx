import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Bloglist from '../components/Bloglist'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'
import { useAppContext } from '../context/AppContext'

const Home = () => {
  const { fetchBlogs } = useAppContext();
  const { hash } = useLocation();

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [hash]);

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
