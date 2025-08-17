import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Divider, 
  Grid, 
  TextField, 
  Typography, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  FormHelperText,
  Paper,
  Chip,
  LinearProgress,
  Avatar,
  IconButton
} from '@mui/material';
import { 
  AddPhotoAlternate, 
  Home, 
  Groups, 
  CalendarToday, 
  Phone, 
  Male, 
  Female, 
  School, 
  Work, 
  CheckCircle,
  CloudUpload
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { auth } from '../../firebase.config';
import { useNavigate } from 'react-router-dom';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

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

            const response = await fetch('https://rent-time.vercel.app/api/posts', {
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
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Create New Listing
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Fill in the details to find the perfect match
                    </Typography>
                </Box>

                {error && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                        <Typography color="error">{error}</Typography>
                    </Box>
                )}
                
                {success && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'success.light', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
                        <CheckCircle color="success" sx={{ mr: 1 }} />
                        <Typography color="success.main">{success}</Typography>
                    </Box>
                )}

                {loading && <LinearProgress sx={{ mb: 3 }} />}

                <form onSubmit={handleSubmit}>
                    {/* Basic Information Section */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <Home sx={{ mr: 1 }} /> Basic Information
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Post Type</InputLabel>
                                        <Select
                                            name="postType"
                                            value={formData.postType}
                                            onChange={handleInputChange}
                                            label="Post Type"
                                        >
                                            <MenuItem value="house">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Home sx={{ mr: 1, fontSize: 20 }} /> House/Room Rent
                                                </Box>
                                            </MenuItem>
                                            <MenuItem value="roommate">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Groups sx={{ mr: 1, fontSize: 20 }} /> Looking for Roommate
                                                </Box>
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Conditional Fields */}
                    {formData.postType === 'house' ? (
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    House Details
                                </Typography>
                                <Divider sx={{ mb: 3 }} />
                                
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Bedrooms"
                                            name="bedrooms"
                                            type="number"
                                            value={formData.bedrooms}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Bathrooms"
                                            name="bathrooms"
                                            type="number"
                                            value={formData.bathrooms}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Size (sq. ft.)"
                                            name="size"
                                            type="number"
                                            value={formData.size}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Amenities (comma separated)"
                                            name="amenities"
                                            value={formData.amenities}
                                            onChange={handleInputChange}
                                            placeholder="e.g. WiFi, AC, Parking"
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Groups sx={{ mr: 1 }} /> Roommate Preferences
                                </Typography>
                                <Divider sx={{ mb: 3 }} />
                                
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Preferred Gender</InputLabel>
                                            <Select
                                                name="preferredGender"
                                                value={formData.preferredGender}
                                                onChange={handleInputChange}
                                                label="Preferred Gender"
                                            >
                                                <MenuItem value="Any">Any</MenuItem>
                                                <MenuItem value="Male">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Male sx={{ mr: 1, fontSize: 20 }} /> Male
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="Female">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Female sx={{ mr: 1, fontSize: 20 }} /> Female
                                                    </Box>
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Preferred Occupation</InputLabel>
                                            <Select
                                                name="preferredOccupation"
                                                value={formData.preferredOccupation}
                                                onChange={handleInputChange}
                                                label="Preferred Occupation"
                                            >
                                                <MenuItem value="Any">Any</MenuItem>
                                                <MenuItem value="Student">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <School sx={{ mr: 1, fontSize: 20 }} /> Student
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="Professional">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Work sx={{ mr: 1, fontSize: 20 }} /> Professional
                                                    </Box>
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}

                    {/* Contact & Additional Info */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <Phone sx={{ mr: 1 }} /> Contact & Additional Information
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Rent (BDT)"
                                        name="rent"
                                        type="number"
                                        value={formData.rent}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Contact Number"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Available From"
                                        name="availableFrom"
                                        type="date"
                                        value={formData.availableFrom}
                                        onChange={handleInputChange}
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="NID Number (Optional)"
                                        name="nidNumber"
                                        value={formData.nidNumber}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        helperText="Providing NID can increase trust with potential tenants/roommates"
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Rules (comma separated)"
                                        name="rules"
                                        value={formData.rules}
                                        onChange={handleInputChange}
                                        placeholder="e.g. No smoking, No pets"
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Image Upload */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <AddPhotoAlternate sx={{ mr: 1 }} /> Photos
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            
                            <Box sx={{ textAlign: 'center', p: 3, border: '1px dashed', borderRadius: 2 }}>
                                <Button
                                    component="label"
                                    variant="contained"
                                    startIcon={<CloudUpload />}
                                >
                                    Upload Photos
                                    <VisuallyHiddenInput 
                                        type="file" 
                                        multiple 
                                        onChange={handleImageChange} 
                                        accept="image/*" 
                                        required 
                                    />
                                </Button>
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    Upload at least one photo (Max 5MB each)
                                </Typography>
                                
                                {images.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Selected {images.length} file(s)
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>

                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                px: 6,
                                py: 1.5,
                                fontSize: '1.1rem',
                                borderRadius: 2,
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                },
                            }}
                        >
                            {loading ? 'Creating Listing...' : 'Create Listing'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default CreatePostPage;