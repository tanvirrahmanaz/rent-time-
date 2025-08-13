import React from 'react';
import Box from '@mui/material/Box';

const Logo = ({sx}) => {
    return (
        <div>
            <Box component="img" src="logo.png" alt="Logo" sx={sx} />
        </div>
    );
};

export default Logo;