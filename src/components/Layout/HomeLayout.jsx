import React from 'react';
import Navbar from '../Shared/Navbar';
import HeroSection from '../Shared/HeroSection/HeroSection';
import FeaturedPosts from '../Home/FeaturedPosts';

const HomeLayout = () => {
    return (
        <div>
            <HeroSection></HeroSection>
            <FeaturedPosts></FeaturedPosts>
        </div>
    );
};

export default HomeLayout;