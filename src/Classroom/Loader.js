import React from 'react'

import '../App.css'
import { Box } from '@mui/material'

const Loader = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="loader JS_on">
                <span className="binary"></span>
                <span className="binary"></span>
                <span className="getting-there">LOADING STUFF...</span>
            </div>
        </Box>
    )
}

export default Loader