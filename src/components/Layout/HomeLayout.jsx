import React from 'react';
import Navbar from '../Shared/Navbar';
import HeroSection from '../Shared/HeroSection/HeroSection';
import Testimonials from '../Home/Testimonials';
import ListingsSection from '../Home/ListingsSection';

const HomeLayout = () => {
    return (
        <div>
            <HeroSection></HeroSection>
            <ListingsSection></ListingsSection>
            <Testimonials></Testimonials>

        </div>
    );
};

export default HomeLayout;