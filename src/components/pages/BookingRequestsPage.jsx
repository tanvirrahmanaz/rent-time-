import React, { useState, useEffect } from 'react';
import {
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
  Stack,
  Box,
  IconButton
} from '@mui/material';
import {
  Check as ApproveIcon,
  Close as RejectIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { auth } from '../../firebase.config';
import { Link } from 'react-router-dom';

const BookingRequestsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookingRequests = async () => {
        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch('https://rent-time.vercel.app/api/bookings/received', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch booking requests');
            }
            
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth.currentUser) {
            fetchBookingRequests();
        }
    }, []);
    
    const handleStatusUpdate = async (bookingId, status) => {
        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch(`https://rent-time.vercel.app/api/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update booking status');
            }
            
            fetchBookingRequests();
        } catch (error) {
            setError(error.message);
        }
    };

    const StatusChip = ({ status }) => {
        const statusConfig = {
            Pending: {
                color: 'warning',
                icon: <PersonIcon fontSize="small" />
            },
            Approved: {
                color: 'success',
                icon: <ApproveIcon fontSize="small" />
            },
            Rejected: {
                color: 'error',
                icon: <RejectIcon fontSize="small" />
            }
        };

        return (
            <Chip
                icon={statusConfig[status]?.icon}
                label={status}
                color={statusConfig[status]?.color}
                variant="outlined"
                sx={{ 
                    fontWeight: 600,
                    borderRadius: 1
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
                    Booking Requests
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage requests for your listings
                </Typography>
            </Box>

            {bookings.length === 0 ? (
                <Card elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        No Booking Requests
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        You haven't received any booking requests yet.
                    </Typography>
                    <Button 
                        variant="contained" 
                        component={Link} 
                        to="/dashboard"
                        startIcon={<HomeIcon />}
                    >
                        View Your Listings
                    </Button>
                </Card>
            ) : (
                <Stack spacing={3}>
                    {bookings.map(booking => (
                        <Card key={booking._id} elevation={3} sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Box sx={{ 
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    mb: 2
                                }}>
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Avatar sx={{ 
                                                bgcolor: 'primary.main', 
                                                width: 32, 
                                                height: 32,
                                                mr: 1
                                            }}>
                                                <PersonIcon fontSize="small" />
                                            </Avatar>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {booking.requesterName}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <EmailIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {booking.requesterEmail}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <StatusChip status={booking.status} />
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        REQUESTED FOR:
                                    </Typography>
                                    <Typography 
                                        component={Link} 
                                        to={`/post/${booking.postId._id}`}
                                        variant="subtitle1" 
                                        sx={{ 
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            textDecoration: 'none',
                                            '&:hover': {
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        <HomeIcon fontSize="small" sx={{ mr: 1 }} />
                                        {booking.postId.title}
                                    </Typography>
                                </Box>

                                {booking.status === 'Pending' && (
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'flex-end',
                                        gap: 1,
                                        pt: 2
                                    }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            startIcon={<ApproveIcon />}
                                            onClick={() => handleStatusUpdate(booking._id, 'Approved')}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none'
                                            }}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={<RejectIcon />}
                                            onClick={() => handleStatusUpdate(booking._id, 'Rejected')}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none'
                                            }}
                                        >
                                            Reject
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}
        </Container>
    );
};

export default BookingRequestsPage;