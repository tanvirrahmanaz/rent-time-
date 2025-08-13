import React from 'react';
import { Box, Button, Card, CardContent, Container, Grid, Typography, Stack } from '@mui/material';

// আইকনগুলো যোগ করলে দেখতে আরও সুন্দর লাগবে (ঐচ্ছিক)
import GroupIcon from '@mui/icons-material/Group';
import HouseIcon from '@mui/icons-material/House';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';


const heroCards = [
    {
        icon: <GroupIcon sx={{ fontSize: 30, color: 'white' }} />,
        title: 'I need a roommate',
        description: 'Create a listing for a potential roommate.',
        buttonText: 'Find Roommate'
    },
    {
        icon: <HouseIcon sx={{ fontSize: 30, color: 'white' }} />,
        title: 'I need a room',
        description: 'Find your next room or apartment with ease.',
        buttonText: 'Find House'
    },
    {
        icon: <AddHomeWorkIcon sx={{ fontSize: 30, color: 'white' }} />,
        title: 'Add my vacant place',
        description: 'Create a listing for post ads.',
        buttonText: 'Post Ads'
    }
];

const HeroSection = () => {
  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        py: { xs: 6, md: 10 },
        // الخلفية والصورة
        backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // ওভারলে
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // একটি ডার্ক ওভারলে
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} alignItems="center">
          
          {/* Left Side: Text Content */}
          <Grid item xs={12} md={7}>
            <Stack spacing={3} alignItems={{ xs: 'center', md: 'flex-start' }}>
              <Typography
                variant="h2"
                component="h1"
                fontWeight="bold"
                color="common.white"
                sx={{ textAlign: { xs: 'center', md: 'left' } }}
              >
                Rent Time - Home Renting Made Simple
              </Typography>
              <Typography 
                variant="body1" 
                color="grey.300" 
                sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: 500 }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Typography>
              <Button variant="contained" color="primary" size="large" sx={{ px: 4, py: 1.5 }}>
                Explore More
              </Button>
            </Stack>
          </Grid>

          {/* Right Side: Action Cards */}
          <Grid item xs={12} md={5}>
            <Stack spacing={2.5}>
              {heroCards.map((card, index) => (
                <Card key={index} sx={{ 
                    bgcolor: 'rgba(0, 77, 64, 0.9)', // ডার্ক সায়ান কালার, ছবির মতো
                    color: 'common.white',
                    borderRadius: 2,
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                  }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="h5" component="h3" fontWeight="600">
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="grey.300">
                        {card.description}
                      </Typography>
                      <Box>
                          <Button 
                            variant="contained" 
                            size="small"
                            sx={{
                                bgcolor: 'white',
                                color: 'black',
                                '&:hover': {
                                    bgcolor: 'grey.200'
                                }
                            }}
                          >
                           {card.buttonText}
                          </Button>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;