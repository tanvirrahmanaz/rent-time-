import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // AuthContext ব্যবহার করুন
import { CloudUpload } from 'lucide-react';
import Swal from 'sweetalert2';

const CreatePostPage = () => {
    const { currentUser } = useAuth();
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
        rules: '',
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files.length > 5) {
            alert("You can only upload a maximum of 5 images.");
            e.target.value = null; // Reset the file input
            return;
        }
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
        if (!currentUser) {
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
            };

            const token = await currentUser.getIdToken();
            const baseURL = import.meta.env.VITE_API_BASE_URL;

            const response = await fetch(`http://localhost:5000/api/posts`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(finalPostData),
            });
            
            const result = await response.json();
            if (!response.ok) {
                 throw new Error(result.message || "Failed to create post.");
            }

            Swal.fire({
                icon: 'success',
                title: 'Post Created!',
                text: 'Your listing has been published successfully.',
            }).then(() => {
                navigate('/dashboard');
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 py-10">
            <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Create a New Listing</h1>
                    <p className="text-gray-500 mt-2">Fill in the details to find the best match for your property.</p>
                </div>

                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* --- Basic Info Section --- */}
                    <div className="space-y-4 p-4 border rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Basic Information</h2>
                        <div><label className="block text-sm font-medium text-gray-600">Title</label><input type="text" name="title" onChange={handleInputChange} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/></div>
                        <div><label className="block text-sm font-medium text-gray-600">Description</label><textarea name="description" rows="4" onChange={handleInputChange} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea></div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Post Type</label>
                            <select name="postType" value={formData.postType} onChange={handleInputChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                <option value="house">House/Room Rent</option>
                                <option value="roommate">Looking for Roommate</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* --- Conditional Fields --- */}
                    {formData.postType === 'house' && (
                        <div className="space-y-4 p-4 border rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">House Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><label className="text-sm font-medium text-gray-600">Bedrooms</label><input type="number" name="bedrooms" onChange={handleInputChange} className="mt-1 w-full rounded-md border-gray-300"/></div>
                                <div><label className="text-sm font-medium text-gray-600">Bathrooms</label><input type="number" name="bathrooms" onChange={handleInputChange} className="mt-1 w-full rounded-md border-gray-300"/></div>
                                <div><label className="text-sm font-medium text-gray-600">Size (sq. ft.)</label><input type="number" name="size" onChange={handleInputChange} className="mt-1 w-full rounded-md border-gray-300"/></div>
                            </div>
                            <div><label className="text-sm font-medium text-gray-600">Amenities (comma-separated)</label><input type="text" name="amenities" onChange={handleInputChange} placeholder="e.g. WiFi, AC, Parking" className="mt-1 w-full rounded-md border-gray-300"/></div>
                        </div>
                    )}

                    {/* --- Contact & Location Section --- */}
                    <div className="space-y-4 p-4 border rounded-lg">
                         <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Location & Price</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="text-sm font-medium text-gray-600">Location</label><input type="text" name="location" onChange={handleInputChange} required className="mt-1 w-full rounded-md border-gray-300"/></div>
                            <div><label className="text-sm font-medium text-gray-600">Rent (BDT)</label><input type="number" name="rent" onChange={handleInputChange} required className="mt-1 w-full rounded-md border-gray-300"/></div>
                            <div><label className="text-sm font-medium text-gray-600">Contact Number</label><input type="tel" name="contactNumber" onChange={handleInputChange} required className="mt-1 w-full rounded-md border-gray-300"/></div>
                            <div><label className="text-sm font-medium text-gray-600">Available From</label><input type="date" name="availableFrom" onChange={handleInputChange} required className="mt-1 w-full rounded-md border-gray-300"/></div>
                         </div>
                    </div>

                    {/* --- Image Upload Section --- */}
                     <div className="space-y-2 p-4 border rounded-lg">
                        <label className="block text-xl font-semibold text-gray-700">Upload Photos</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                        <span>Upload files</span>
                                        <input id="file-upload" name="images" type="file" multiple onChange={handleImageChange} required className="sr-only" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                {images.length > 0 && <p className="text-sm font-medium text-green-600 mt-2">{images.length} file(s) selected</p>}
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 transition-all text-lg">
                        {loading ? 'Submitting...' : 'Submit Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePostPage;