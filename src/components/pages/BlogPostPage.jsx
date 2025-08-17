import React from 'react';
import { useParams, Link } from 'react-router-dom';

const BlogPostPage = () => {
    const { slug } = useParams();
    
    // Static blog posts data
    const posts = [
        {
            id: 1,
            slug: 'first-post',
            title: 'First Blog Post',
            content: '<p>This is the full content of the first blog post.</p><p>You can add multiple paragraphs here.</p>',
            date: '2023-05-15',
            author: 'Admin'
        },
        {
            id: 2,
            slug: 'second-post',
            title: 'Second Blog Post',
            content: '<p>This is the full content of the second blog post.</p><p>More details about the topic.</p>',
            date: '2023-06-20',
            author: 'Editor'
        },
        {
            id: 3,
            slug: 'third-post',
            title: 'Third Blog Post',
            content: '<p>This is the full content of the third blog post.</p><p>Final thoughts on the subject.</p>',
            date: '2023-07-10',
            author: 'Writer'
        }
    ];

    const post = posts.find(p => p.slug === slug);

    if (!post) {
        return (
            <div style={{ 
                maxWidth: '800px', 
                margin: '0 auto', 
                padding: '20px',
                textAlign: 'center'
            }}>
                <h1>404 - Post Not Found</h1>
                <p>The blog post you are looking for does not exist.</p>
                <Link 
                    to="/blog"
                    style={{
                        display: 'inline-block',
                        marginTop: '20px',
                        color: '#0066cc',
                        textDecoration: 'none'
                    }}
                >
                    ← Back to all blogs
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <article>
                <h1 style={{ marginBottom: '10px' }}>{post.title}</h1>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                    By {post.author} on {new Date(post.date).toLocaleDateString()}
                </p>
                
                <div 
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                    style={{ lineHeight: '1.6' }}
                />
                
                <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
                    <Link 
                        to="/blog"
                        style={{
                            color: '#0066cc',
                            textDecoration: 'none'
                        }}
                    >
                        ← Back to all blog posts
                    </Link>
                </div>
            </article>
        </div>
    );
};

export default BlogPostPage;