import React from 'react';
import { Link } from 'react-router-dom';

const BlogListPage = () => {
    const blogs = [
        {
            id: 1,
            slug: 'first-post',
            title: 'First Blog Post',
            excerpt: 'This is a short summary of the first blog post content.',
            date: '2023-05-15'
        },
        {
            id: 2,
            slug: 'second-post',
            title: 'Second Blog Post',
            excerpt: 'This is a short summary of the second blog post content.',
            date: '2023-06-20'
        },
        {
            id: 3,
            slug: 'third-post',
            title: 'Third Blog Post',
            excerpt: 'This is a short summary of the third blog post content.',
            date: '2023-07-10'
        }
    ];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Our Blog</h1>
            
            <div style={{ display: 'grid', gap: '20px' }}>
                {blogs.map(blog => (
                    <div key={blog.id} style={{ 
                        border: '1px solid #ddd', 
                        padding: '20px',
                        borderRadius: '5px'
                    }}>
                        <h2 style={{ marginTop: '0' }}>{blog.title}</h2>
                        <p style={{ color: '#666', marginBottom: '10px' }}>
                            Posted on: {new Date(blog.date).toLocaleDateString()}
                        </p>
                        <p>{blog.excerpt}</p>
                        <Link 
                            to={`/blog/${blog.slug}`}
                            style={{
                                display: 'inline-block',
                                marginTop: '10px',
                                color: '#0066cc',
                                textDecoration: 'none'
                            }}
                        >
                            Read more →
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogListPage;