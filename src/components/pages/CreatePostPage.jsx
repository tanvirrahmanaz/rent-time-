import React, { useState } from 'react';
import { auth } from '../../firebase.config'; // Firebase auth

const CreatePostPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        postType: 'house',
        location: '',
        rent: '',
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };
    
    // ImgBB-তে ছবি আপলোড করার ফাংশন
    const uploadImagesToImgBB = async () => {
        const uploadedUrls = [];
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

        for (const image of images) {
            const imgFormData = new FormData();
            imgFormData.append('image', image);

            try {
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                    method: 'POST',
                    body: imgFormData,
                });
                const result = await response.json();
                if (result.success) {
                    uploadedUrls.push(result.data.url);
                } else {
                    throw new Error(result.error.message);
                }
            } catch (err) {
                 throw new Error(`Failed to upload image: ${err.message}`);
            }
        }
        return uploadedUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!auth.currentUser) {
            setError("You must be logged in to create a post.");
            return;
        }
        if (images.length === 0) {
            setError("Please upload at least one image.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            // ১. ছবিগুলো ImgBB তে আপলোড করুন
            const photoUrls = await uploadImagesToImgBB();

            // ২. ফর্মের সব ডেটা এবং ছবির URL গুলো একত্র করুন
            const finalPostData = {
                ...formData,
                photos: photoUrls,
                ownerId: auth.currentUser.uid, // লগইন করা ইউজারের UID
            };

            // ৩. আপনার ব্যাকএন্ডে API কল করে ডেটা পাঠান
            const response = await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalPostData),
            });
            
            if (!response.ok) throw new Error("Failed to create post.");

            const result = await response.json();
            console.log("Post created successfully:", result);
            // এখানে পোস্ট সফলভাবে তৈরি হওয়ার পর ড্যাশবোর্ডে রিডাইরেক্ট করতে পারেন

        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white my-10 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Create a New Post</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title, Description, Type, Location, Rent inputs... */}
                 <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" name="title" onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" rows="4" onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Post Type</label>
                    <select name="postType" onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        <option value="house">House/Room Rent</option>
                        <option value="roommate">Looking for Roommate</option>
                    </select>
                </div>
                {/* ... other form fields ... */}
                <div>
                    <label htmlFor="images" className="block text-sm font-medium text-gray-700">Upload Photos</label>
                    <input type="file" name="images" onChange={handleImageChange} multiple required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
                    {loading ? 'Submitting...' : 'Create Post'}
                </button>
            </form>
        </div>
    );
};

export default CreatePostPage;