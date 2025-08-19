import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Divider, 
  Chip, 
  Button, 
  CircularProgress,
  Alert,
  Avatar,
  Stack
} from '@mui/material';
import { 
  Home, 
  Schedule, 
  Cancel, 
  CheckCircle, 
  Close, 
  HelpOutline 
} from '@mui/icons-material';
import { auth } from '../../firebase.config';
import { Link } from 'react-router-dom';

const MyRequestsPage = () => {
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMyRequests = async () => {
        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch('http://localhost:5000/api/bookings/sent', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch requests');
            }
            
            const data = await response.json();
            setMyRequests(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth.currentUser) {
            fetchMyRequests();
        }
    }, []);
    
    const handleCancelRequest = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this request?")) return;

        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error('Failed to cancel request');
            }
            
            setMyRequests(myRequests.filter(req => req._id !== bookingId));
        } catch (error) {
            setError(error.message);
        }
    };

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            Pending: {
                icon: <HelpOutline fontSize="small" />,
                color: 'warning',
                label: 'Pending'
            },
            Approved: {
                icon: <CheckCircle fontSize="small" />,
                color: 'success',
                label: 'Approved'
            },
            Rejected: {
                icon: <Close fontSize="small" />,
                color: 'error',
                label: 'Rejected'
            },
        };

        return (
            <Chip
                icon={statusConfig[status]?.icon}
                label={statusConfig[status]?.label}
                color={statusConfig[status]?.color}
                variant="outlined"
                size="small"
                sx={{ 
                    borderRadius: 1,
                    fontWeight: 600
                }}
            />
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                    My Booking Requests
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    View and manage your sent booking requests
                </Typography>
            </Box>

            {myRequests.length === 0 ? (
                <Card elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        No Requests Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        You haven't sent any booking requests yet.
                    </Typography>
                    <Button 
                        variant="contained" 
                        component={Link} 
                        to="/posts"
                        startIcon={<Home />}
                    >
                        Browse Listings
                    </Button>
                </Card>
            ) : (
                <Stack spacing={3}>
                    {myRequests.map(request => (
                        <Card key={request._id} elevation={3} sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    mb: 2
                                }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            REQUEST FOR:
                                        </Typography>
                                        <Typography 
                                            component={Link} 
                                            to={`/post/${request.postId?._id}`}
                                            variant="h6" 
                                            sx={{ 
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                                '&:hover': {
                                                    textDecoration: 'underline'
                                                }
                                            }}
                                        >
                                            {request.postId?.title || 'Post Deleted'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {request.postId?.location || 'Location not available'}
                                        </Typography>
                                    </Box>
                                    <StatusBadge status={request.status} />
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Schedule color="action" sx={{ mr: 1 }} />
                                        <Typography variant="caption">
                                            Sent on: {new Date(request.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>

                                    {request.status === 'Pending' && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={<Cancel />}
                                            onClick={() => handleCancelRequest(request._id)}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none'
                                            }}
                                        >
                                            Cancel Request
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}
        </Container>
    );
};

export default MyRequestsPage;