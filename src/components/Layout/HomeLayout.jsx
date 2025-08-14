import React from 'react';
import Navbar from '../Shared/Navbar';
import HeroSection from '../Shared/HeroSection/HeroSection';
import FeaturedPosts from '../Home/FeaturedPosts';
import Testimonials from '../Home/Testimonials';

const HomeLayout = () => {
    return (
        <div>
            <HeroSection></HeroSection>
            <FeaturedPosts></FeaturedPosts>
            <Testimonials></Testimonials>
        </div>
    );
};

export default HomeLayout;