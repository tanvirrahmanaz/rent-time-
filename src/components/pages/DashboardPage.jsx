import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Divider,
  Link as MuiLink
} from '@mui/material';
import { auth } from '../../firebase.config';
import MyPostsList from '../Dashboard/MyPostsList';
import { Link } from 'react-router-dom';
import { Home, ListAlt, Send } from '@mui/icons-material';

const DashboardPage = () => {
    const user = auth.currentUser;

    return (
        <Box sx={{ 
            bgcolor: 'background.default', 
            minHeight: '100vh',
            py: 6
        }}>
            <Container maxWidth="lg">
                {/* Header Section */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ 
                        fontWeight: 700,
                        color: 'text.primary'
                    }}>
                        Welcome, {user?.displayName || 'User'}!
                    </Typography>
                    <Typography variant="subtitle1" sx={{ 
                        color: 'text.secondary',
                        maxWidth: 600
                    }}>
                        Manage your posts and view your activity here.
                    </Typography>
                </Box>

                {/* Main Content */}
                <Box component="main" sx={{ mb: 6 }}>
                    <MyPostsList />
                </Box>

                {/* Quick Actions */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card elevation={3} sx={{ 
                            height: '100%',
                            borderRadius: 3,
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 6
                            }
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2
                                }}>
                                    <Home color="primary" sx={{ 
                                        fontSize: 40,
                                        mr: 2
                                    }} />
                                    <Typography variant="h5" component="h2" sx={{ 
                                        fontWeight: 600
                                    }}>
                                        Your Listings
                                    </Typography>
                                </Box>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                    Manage the properties you have listed.
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Button
                                    component={Link}
                                    to="/dashboard/booking-requests"
                                    variant="outlined"
                                    color="primary"
                                    endIcon={<Send />}
                                    sx={{
                                        mt: 2,
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1
                                    }}
                                >
                                    View Received Requests
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card elevation={3} sx={{ 
                            height: '100%',
                            borderRadius: 3,
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 6
                            }
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2
                                }}>
                                    <ListAlt color="secondary" sx={{ 
                                        fontSize: 40,
                                        mr: 2
                                    }} />
                                    <Typography variant="h5" component="h2" sx={{ 
                                        fontWeight: 600
                                    }}>
                                        Your Requests
                                    </Typography>
                                </Box>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                    Check the status of your sent booking requests.
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Button
                                    component={Link}
                                    to="/dashboard/my-requests"
                                    variant="outlined"
                                    color="secondary"
                                    endIcon={<Send />}
                                    sx={{
                                        mt: 2,
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1
                                    }}
                                >
                                    View My Requests
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default DashboardPage;