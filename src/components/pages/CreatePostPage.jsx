import React, { useState } from 'react';
import { auth } from '../../firebase.config';
import { useNavigate } from 'react-router-dom';

const CreatePostPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        postType: 'house',
        location: '',
        rent: '',
        contactNumber: '',
        availableFrom: '',
        bedrooms: '',
        bathrooms: '',
        size: '',
        amenities: '',
        preferredGender: 'Any',
        preferredOccupation: 'Any',
        nidNumber: '',
        contactPreference: 'Phone',
        visitingHours: '',
        rules: '',
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const uploadImagesToImgBB = async () => {
        const uploadedUrls = [];
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

        if (!apiKey) {
            throw new Error("ImgBB API key is not configured. Please check your .env file.");
        }

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
                    throw new Error(result.error.message || "Unknown error from ImgBB.");
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
        setSuccess('');

        try {
            const photoUrls = await uploadImagesToImgBB();
            
            const amenitiesArray = formData.amenities ? formData.amenities.split(',').map(item => item.trim()) : [];
            const rulesArray = formData.rules ? formData.rules.split(',').map(item => item.trim()) : [];
            
            const finalPostData = {
                ...formData,
                rent: Number(formData.rent),
                bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
                bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
                size: formData.size ? Number(formData.size) : undefined,
                photos: photoUrls,
                amenities: amenitiesArray,
                rules: rulesArray,
                ownerId: auth.currentUser.uid,
            };

            const response = await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalPostData),
            });
            
            const result = await response.json();
            if (!response.ok) {
                 throw new Error(result.message || "Failed to create post.");
            }

            setSuccess("Post created successfully! Redirecting...");
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white my-10 rounded-lg shadow-2xl">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Create a New Post</h2>
            <p className="text-gray-500 mb-6">Fill in the details to find the best match.</p>

            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
            {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4">{success}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* --- Basic Info Section --- */}
                <div className="p-4 border rounded-lg bg-gray-50/50 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
                    <div><label>Title</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300"/></div>
                    <div><label>Description</label><textarea name="description" rows="4" value={formData.description} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300"></textarea></div>
                    <div>
                        <label>Post Type</label>
                        <select name="postType" value={formData.postType} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300">
                            <option value="house">House/Room Rent</option>
                            <option value="roommate">Looking for Roommate</option>
                        </select>
                    </div>
                </div>

                {/* --- Conditional Fields --- */}
                {formData.postType === 'house' ? (
                    <div className="p-4 border rounded-lg bg-gray-50/50 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">House Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div><label>Bedrooms</label><input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300"/></div>
                             <div><label>Bathrooms</label><input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300"/></div>
                             <div><label>Size (sq. ft.)</label><input type="number" name="size" value={formData.size} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300"/></div>
                        </div>
                        <div><label>Amenities (comma-separated)</label><input type="text" name="amenities" value={formData.amenities} onChange={handleInputChange} placeholder="e.g. WiFi, AC, Parking" className="mt-1 block w-full rounded-md border-gray-300"/></div>
                    </div>
                ) : (
                    <div className="p-4 border rounded-lg bg-gray-50/50 space-y-4">
                         <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Roommate Preferences</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label>Preferred Gender</label>
                                <select name="preferredGender" value={formData.preferredGender} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300"><option>Any</option><option>Male</option><option>Female</option></select>
                            </div>
                            <div>
                                <label>Preferred Occupation</label>
                                <select name="preferredOccupation" value={formData.preferredOccupation} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300"><option>Any</option><option>Student</option><option>Professional</option></select>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* --- Additional Info Section --- */}
                <div className="p-4 border rounded-lg bg-gray-50/50 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label>Location</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300"/></div>
                        <div><label>Rent (BDT)</label><input type="number" name="rent" value={formData.rent} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300"/></div>
                        <div><label>Contact Number</label><input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300"/></div>
                        <div><label>Available From</label><input type="date" name="availableFrom" value={formData.availableFrom} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300"/></div>
                    </div>
                    <div>
                        <label>NID Number (Optional)</label>
                        <input type="text" name="nidNumber" value={formData.nidNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300"/>
                        <p className="text-xs text-gray-500 mt-1">Providing NID can increase trust with potential tenants/roommates.</p>
                    </div>
                    <div><label>Rules (comma-separated)</label><input type="text" name="rules" value={formData.rules} onChange={handleInputChange} placeholder="e.g. No smoking, No pets" className="mt-1 block w-full rounded-md border-gray-300"/></div>
                </div>

                {/* --- Image Upload --- */}
                <div>
                    <label>Upload Photos (Required)</label>
                    <input type="file" name="images" onChange={handleImageChange} multiple required className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50"/>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 transition-all">
                    {loading ? 'Submitting...' : 'Submit Post'}
                </button>
            </form>
        </div>
    );
};

export default CreatePostPage;