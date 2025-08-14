import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { staticBlogPosts } from '../../data/mockBlogs'; // স্ট্যাটিক ডেটা ইমপোর্ট করুন

const BlogPostPage = () => {
    const { slug } = useParams(); // URL থেকে slug নিন

    // স্ট্যাটিক অ্যারে থেকে slug অনুযায়ী সঠিক পোস্টটি খুঁজুন
    const post = staticBlogPosts.find(p => p.slug === slug);

    if (!post) {
        return (
            <div className="text-center p-20">
                <h1 className="text-4xl font-bold">404 - Post Not Found</h1>
                <p className="mt-4">The blog post you are looking for does not exist.</p>
                <Link to="/blog" className="mt-6 inline-block text-indigo-600 hover:underline">
                    &larr; Back to all blogs
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <article>
                    <header className="mb-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">{post.title}</h1>
                        <p className="mt-4 text-gray-500">
                            By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </header>
                    <img className="w-full h-auto rounded-lg shadow-lg mb-8" src={post.featuredImage} alt={post.title} />
                    
                    {/* `prose` ক্লাসটি Tailwind Typography প্লাগইন থেকে আসে, যা HTML রেন্ডারিংকে সুন্দর করে */}
                    <div 
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }} 
                    />

                    <div className="mt-10 border-t pt-6">
                        <Link to="/blog" className="text-indigo-600 hover:underline font-semibold">
                            &larr; Back to all blog posts
                        </Link>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogPostPage;