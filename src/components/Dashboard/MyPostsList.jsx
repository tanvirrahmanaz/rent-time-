import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase.config';
import { 
  Delete, 
  Visibility, 
  House, 
  Groups 
} from '@mui/icons-material';

const MyPostsList = () => {
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const token = await auth.currentUser.getIdToken();
                const response = await fetch('https://rent-time.vercel.app/api/my-posts', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch your posts. Please log in again.');
                }
                const data = await response.json();
                setMyPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (auth.currentUser) {
            fetchMyPosts();
        }
    }, []);

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch(`https://rent-time.vercel.app/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete the post.');
            
            setMyPosts(myPosts.filter(post => post._id !== postId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            py: 4 
        }}>
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Alert severity="error" sx={{ mb: 3 }}>
            {error}
        </Alert>
    );

    return (
        <Paper elevation={3} sx={{ 
            mb: 6,
            borderRadius: 3,
            overflow: 'hidden'
        }}>
            <Box sx={{ 
                p: 3,
                bgcolor: 'primary.main',
                color: 'primary.contrastText'
            }}>
                <Typography variant="h5" component="h2" sx={{ 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <House sx={{ mr: 1 }} /> Your Listings
                </Typography>
            </Box>
            
            {myPosts.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        You have not created any posts yet.
                    </Typography>
                    <Button 
                        component={Link} 
                        to="/create-post" 
                        variant="contained" 
                        sx={{ mt: 2 }}
                    >
                        Create Your First Post
                    </Button>
                </Box>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'background.paper' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Rent</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {myPosts.map(post => (
                                <TableRow key={post._id} hover>
                                    <TableCell>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {post.title}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={post.postType} 
                                            icon={post.postType === 'house' ? <House /> : <Groups />}
                                            color={post.postType === 'house' ? 'primary' : 'secondary'}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1" color="text.secondary">
                                            {post.rent} BDT
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                component={Link}
                                                to={`/post/${post._id}`}
                                                color="primary"
                                                size="small"
                                            >
                                                <Visibility />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDelete(post._id)}
                                                color="error"
                                                size="small"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
};

export default MyPostsList;