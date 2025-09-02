import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  CloudUpload,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  Phone,
  Users,
  Shield,
  Camera,
  AlertCircle,
  CheckCircle,
  Trash2,
  Move
} from 'lucide-react';
import Swal from 'sweetalert2';

const MAX_GALLERY_PHOTOS = 12;

const CreatePostPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    postType: 'house',
    location: '',
    rent: '',
    deposit: '',
    leaseTerm: '',
    contactNumber: '',
    contactPreference: 'Phone',
    availableFrom: '',
    visitingHours: '',
    bedrooms: '',
    bathrooms: '',
    size: '',
    amenities: '',
    utilitiesIncluded: '',
    furnished: 'No',
    petsAllowed: false,
    parking: false,
    floor: '',
    unitNo: '',
    preferredGender: 'Any',
    preferredOccupation: 'Any',
    rules: '',
    nidNumber: '',
  });

  // images
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [nidImageFile, setNidImageFile] = useState(null);

  // ui
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const galleryInputRef = useRef(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const steps = [
    { id: 1, title: 'Basic Info', icon: Home },
    { id: 2, title: 'Details', icon: MapPin },
    { id: 3, title: 'Price & Contact', icon: DollarSign },
    { id: 4, title: 'Photos', icon: Camera },
    { id: 5, title: 'Verification', icon: Shield },
  ];

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ---------- Drag & Drop helpers ----------
  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const acceptImages = (files) =>
    Array.from(files || []).filter((f) => f.type.startsWith('image/'));

  const addToGallery = (files) => {
    const imgs = acceptImages(files);
    if (!imgs.length) return;
    setGalleryFiles((prev) => {
      const merged = [...prev, ...imgs];
      if (merged.length > MAX_GALLERY_PHOTOS) {
        Swal.fire({
          icon: 'warning',
          title: 'File Limit Exceeded',
          text: `You can upload at most ${MAX_GALLERY_PHOTOS} gallery photos.`,
        });
      }
      return merged.slice(0, MAX_GALLERY_PHOTOS);
    });
  };

  const handleGalleryDrop = (e) => {
    preventDefaults(e);
    addToGallery(e.dataTransfer.files);
  };

  // ---------- Upload to ImgBB ----------
  const uploadToImgBB = async (filesOrSingle) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) throw new Error('ImgBB API key missing. Set VITE_IMGBB_API_KEY');

    const uploadOne = async (file) => {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: fd,
      });
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error?.message || 'ImgBB upload failed');
      return json.data.url;
    };

    if (Array.isArray(filesOrSingle)) {
      const out = [];
      for (const f of filesOrSingle) out.push(await uploadOne(f));
      return out;
    }
    if (filesOrSingle) return await uploadOne(filesOrSingle);
    return null;
  };

  // ---------- Validation ----------
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.title && formData.description && formData.postType;
      case 2:
        if (formData.postType === 'house') {
          return formData.bedrooms || formData.bathrooms || formData.size;
        }
        return true;
      case 3:
        return formData.location && formData.rent && formData.contactNumber && formData.availableFrom;
      case 4:
        return galleryFiles.length > 0;
      case 5:
        return !!formData.nidNumber && !!nidImageFile;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((p) => Math.min(p + 1, 5));
      setError('');
    } else {
      setError('Please fill in all required fields for this section.');
    }
  };
  const prevStep = () => {
    setCurrentStep((p) => Math.max(p - 1, 1));
    setError('');
  };

  // ---------- Reorder (drag inside gallery) ----------
  const [dragIndex, setDragIndex] = useState(null);
  const onThumbDragStart = (idx) => (e) => {
    setDragIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
  };
  const onThumbDrop = (idx) => (e) => {
    preventDefaults(e);
    if (dragIndex === null || dragIndex === idx) return;
    setGalleryFiles((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIndex, 1);
      arr.splice(idx, 0, moved);
      return arr;
    });
    setDragIndex(null);
  };

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError('You must be logged in to create a post.');
      return;
    }
    if (galleryFiles.length == 0) {
      setError('Please add at least one gallery photo.');
      return;
    }
    if (!formData.nidNumber || !nidImageFile) {
      setError('NID number and NID photo are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const galleryUrls = galleryFiles.length ? await uploadToImgBB(galleryFiles) : [];
      const nidImageUrl = await uploadToImgBB(nidImageFile);

      const amenities = formData.amenities
        ? formData.amenities.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      const utilitiesIncluded = formData.utilitiesIncluded
        ? formData.utilitiesIncluded.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      const rules = formData.rules
        ? formData.rules.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        title: formData.title,
        description: formData.description,
        postType: formData.postType,
        location: formData.location,
        rent: Number(formData.rent),
        deposit: formData.deposit ? Number(formData.deposit) : undefined,
        leaseTerm: formData.leaseTerm || undefined,
        contactNumber: formData.contactNumber,
        contactPreference: formData.contactPreference,
        availableFrom: formData.availableFrom,
        visitingHours: formData.visitingHours || undefined,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        size: formData.size ? Number(formData.size) : undefined,
        amenities,
        utilities: utilitiesIncluded,
        furnished: formData.furnished === 'Yes',
        petsAllowed: !!formData.petsAllowed,
        parking: formData.parking ? 'Available' : 'Not Available',
        floor: formData.floor ? Number(formData.floor) : undefined,
        unitNo: formData.unitNo || undefined,
        preferredGender: formData.preferredGender,
        preferredOccupation: formData.preferredOccupation,
        rules,
        photos: galleryUrls,
        nidNumber: formData.nidNumber,
        nidImage: nidImageUrl,
      };

      const token = await currentUser.getIdToken();
      const res = await fetch(`${apiBase}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Failed to create post.');

      await Swal.fire({
        icon: 'success',
        title: 'Post Created Successfully!',
        text: 'Your listing has been published and is now live.',
        confirmButtonColor: '#4F46E5',
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={
                  'w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ' +
                  (isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-500')
                }
              >
                {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
              </div>
              <span className={'text-sm font-medium ' + (isActive ? 'text-indigo-600' : 'text-gray-500')}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={'absolute h-0.5 w-16 mt-6 ml-16 ' + (isCompleted ? 'bg-green-500' : 'bg-gray-200')}
                  style={{ transform: 'translateX(50%)' }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const PhotoZone = ({ title, desc, onClick, onDrop }) => (
    <div
      onDragEnter={preventDefaults}
      onDragOver={preventDefaults}
      onDrop={onDrop}
      className="rounded-lg border-2 border-dashed p-6 text-center border-gray-200"
    >
      <Camera className="mx-auto w-10 h-10 text-gray-300 mb-3" />
      <p className="text-lg font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-500 mb-4">{desc}</p>
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
        onClick={onClick}
      >
        <CloudUpload className="w-4 h-4 mr-2" />
        Add Photos
      </button>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
              <p className="text-gray-600">Tell us about your property</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={onChange}
                  placeholder="e.g., Beautiful 2BR Apartment in Dhanmondi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  rows="4"
                  placeholder="Describe your property, neighborhood, and what makes it special..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Listing Type *</label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={
                      'border-2 rounded-lg p-4 cursor-pointer transition-all ' +
                      (formData.postType === 'house' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300')
                    }
                  >
                    <input
                      type="radio"
                      name="postType"
                      value="house"
                      checked={formData.postType === 'house'}
                      onChange={onChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <Home className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                      <div className="font-semibold">House/Room Rent</div>
                      <div className="text-sm text-gray-500">Rent out your property</div>
                    </div>
                  </label>

                  <label
                    className={
                      'border-2 rounded-lg p-4 cursor-pointer transition-all ' +
                      (formData.postType === 'roommate' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300')
                    }
                  >
                    <input
                      type="radio"
                      name="postType"
                      value="roommate"
                      checked={formData.postType === 'roommate'}
                      onChange={onChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                      <div className="font-semibold">Looking for Roommate</div>
                      <div className="text-sm text-gray-500">Find someone to share</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Details</h2>
              <p className="text-gray-600">Provide specific details about your property</p>
            </div>

            {formData.postType === 'house' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                    <input
                      name="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={onChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
                    <input
                      name="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={onChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Size (sq.ft)</label>
                    <input
                      name="size"
                      type="number"
                      value={formData.size}
                      onChange={onChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Floor</label>
                    <input
                      name="floor"
                      type="number"
                      value={formData.floor}
                      onChange={onChange}
                      placeholder="e.g., 3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Number</label>
                    <input
                      name="unitNo"
                      value={formData.unitNo}
                      onChange={onChange}
                      placeholder="e.g., 3A"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Furnished Status</label>
                  <select
                    name="furnished"
                    value={formData.furnished}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="No">Unfurnished</option>
                    <option value="Yes">Fully Furnished</option>
                    <option value="Partial">Partially Furnished</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      name="petsAllowed"
                      type="checkbox"
                      checked={formData.petsAllowed}
                      onChange={onChange}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">Pets Allowed</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      name="parking"
                      type="checkbox"
                      checked={formData.parking}
                      onChange={onChange}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">Parking Available</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
                  <input
                    name="amenities"
                    value={formData.amenities}
                    onChange={onChange}
                    placeholder="WiFi, AC, Balcony, Security (comma separated)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Utilities Included</label>
                  <input
                    name="utilitiesIncluded"
                    value={formData.utilitiesIncluded}
                    onChange={onChange}
                    placeholder="Water, Gas, Electricity, Internet (comma separated)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {formData.postType === 'roommate' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Gender</label>
                    <select
                      name="preferredGender"
                      value={formData.preferredGender}
                      onChange={onChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Any">Any</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Occupation</label>
                    <select
                      name="preferredOccupation"
                      value={formData.preferredOccupation}
                      onChange={onChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Any">Any</option>
                      <option value="Student">Student</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">House Rules</label>
              <textarea
                name="rules"
                value={formData.rules}
                onChange={onChange}
                rows="3"
                placeholder="No smoking, No loud music after 10pm, Keep common areas clean (comma separated)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Price & Contact</h2>
              <p className="text-gray-600">Set your price and contact information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Location *
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={onChange}
                  placeholder="e.g., Dhanmondi 15, Dhaka"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  Monthly Rent (BDT) *
                </label>
                <input
                  name="rent"
                  type="number"
                  value={formData.rent}
                  onChange={onChange}
                  placeholder="e.g., 25000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Security Deposit (BDT)</label>
                <input
                  name="deposit"
                  type="number"
                  value={formData.deposit}
                  onChange={onChange}
                  placeholder="e.g., 50000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Lease Term</label>
                <input
                  name="leaseTerm"
                  value={formData.leaseTerm}
                  onChange={onChange}
                  placeholder="e.g., 12 months"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Contact Number *
                </label>
                <input
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={onChange}
                  placeholder="e.g., +8801XXXXXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Preference</label>
                <select
                  name="contactPreference"
                  value={formData.contactPreference}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Available From *
                </label>
                <input
                  name="availableFrom"
                  type="date"
                  value={formData.availableFrom}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Visiting Hours</label>
                <input
                  name="visitingHours"
                  value={formData.visitingHours}
                  onChange={onChange}
                  placeholder="e.g., 10am - 6pm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Photos</h2>
              <p className="text-gray-600">Add photos to make your listing stand out</p>
            </div>

            <div className="space-y-6">
              <PhotoZone
                title="Gallery Photos"
                desc={`Drag & drop multiple photos here, or click to add (max ${MAX_GALLERY_PHOTOS})`}
                onClick={() => galleryInputRef.current?.click()}
                onDrop={handleGalleryDrop}
              />
              <input
                ref={galleryInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => addToGallery(e.target.files)}
              />
              {galleryFiles.length > 0 && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {galleryFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-lg overflow-hidden border bg-white"
                      draggable
                      onDragStart={onThumbDragStart(idx)}
                      onDragOver={preventDefaults}
                      onDrop={onThumbDrop(idx)}
                      title="Drag to reorder"
                    >
                      <img src={URL.createObjectURL(file)} alt={`gallery-${idx}`} className="h-24 w-full object-cover" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-2 py-1 bg-black/40">
                        <span className="inline-flex items-center text-white text-xs">
                          <Move className="w-3 h-3 mr-1" /> Drag
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setGalleryFiles((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="text-white/90 hover:text-white"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification (Required)</h2>
              <p className="text-gray-600">Help build trust with potential tenants</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Privacy Notice</p>
                  <p>Your NID information is stored securely and never displayed publicly. It's only used for verification purposes.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Shield className="inline w-4 h-4 mr-1" />
                  NID Number * (Required)
                </label>
                <input
                  name="nidNumber"
                  value={formData.nidNumber}
                  onChange={onChange}
                  placeholder="Enter your NID number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">NID Photo * (Required)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNidImageFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center">
                        <CloudUpload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Upload NID Photo</span>
                      </div>
                    </label>
                    {nidImageFile && (
                      <p className="text-sm text-green-600 mt-2 font-medium">✓ NID photo selected</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Ready to Submit!</p>
                  <p>Review your information and click submit to publish your listing.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create Your Listing</h1>
          <p className="text-lg text-gray-600">Find the perfect tenant for your property</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <StepIndicator />

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {renderStep()}

            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="text-sm text-gray-500">Step {currentStep} of {steps.length}</div>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors font-semibold flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Publish Listing
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm">
              Make sure to upload several gallery images. Drag thumbnails to reorder the gallery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;