import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { blogCategories } from '../assets/assets'
import { motion as Motion } from "motion/react"
import BlogCard from './BlogCard'
import { useAppContext } from '../context/AppContext'

const Bloglist = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const categoryFromUrl = searchParams.get('category')

    // Default is always "All" unless a valid category is in the URL
    const menu =
        categoryFromUrl && blogCategories.includes(categoryFromUrl) && categoryFromUrl !== 'All'
            ? categoryFromUrl
            : 'All'

    const { blogs, input } = useAppContext()

    const selectCategory = (item) => {
        const next = new URLSearchParams(searchParams)
        if (item === 'All') next.delete('category')
        else next.set('category', item)
        setSearchParams(next, { replace: true })
    }

    const filterBlogs = () => {
        if (input === '') return blogs
        return blogs.filter((blog) =>
            blog.title.toLowerCase().includes(input.toLowerCase()) ||
            blog.category.toLowerCase().includes(input.toLowerCase())
        )
    }

    return (
        <div id='blogs'>
            <div className='flex justify-center gap-4 sm:gap-8 my-10 relative'>
                {blogCategories.map((item) => (
                    <div key={item} className='relative'>
                        <button
                            onClick={() => selectCategory(item)}
                            className={`cursor-pointer text-gray-500 ${menu === item && 'text-white px-4 pt-0.5'}`}
                        >
                            {item}
                            {menu === item && (
                                <Motion.div
                                    layoutId='underline'
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    className='absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full'
                                />
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 sm:mx-16 xl:mx-40'>
                {filterBlogs()
                    .filter((blog) => menu === 'All' ? true : blog.category === menu)
                    .map((blog) => <BlogCard key={blog._id} blog={blog} />)}
            </div>
        </div>
    )
}

export default Bloglist
