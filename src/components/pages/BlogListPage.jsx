import React from 'react';
import { Link } from 'react-router-dom';
import { staticBlogPosts } from '../../data/mockBlogs'; // স্ট্যাটিক ডেটা ইমপোর্ট করুন

const BlogListPage = () => {
    // এখন আর loading বা fetch এর প্রয়োজন নেই
    const blogs = staticBlogPosts;

    return (
        <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900">Our Blog</h1>
                    <p className="mt-4 text-lg text-gray-600">Tips, guides, and stories about renting and living.</p>
                </div>

                <div className="mt-12 grid gap-10 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                    {blogs.map(blog => (
                        <Link to={`/blog/${blog.slug}`} key={blog._id} className="group block shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <img className="h-56 w-full object-cover" src={blog.featuredImage} alt={blog.title} />
                            <div className="p-6">
                                <p className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
                                <h3 className="mt-2 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{blog.title}</h3>
                                <p className="mt-3 text-gray-600 text-sm">{blog.excerpt}</p>
                                <p className="mt-4 font-semibold text-indigo-600">Read More →</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    ); 
};

export default BlogListPage;