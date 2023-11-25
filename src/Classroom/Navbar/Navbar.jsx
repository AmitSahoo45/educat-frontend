import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppBar, Box, Button, Container, Menu, MenuItem, Toolbar, Typography } from '@mui/material';

import { connectWithSocketServer } from '../../realtimeCommunication/socketConnection';
import { openAlertMessage } from "../../store/actions/alertActions";
import { ContextStore } from '../../shared/context/Context';
import { logout } from '../../shared/utils/auth';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Navbar = () => {
    const { user, setUser } = useContext(ContextStore);

    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        const userDetails = localStorage.getItem("user");

        if (!userDetails) {
            dispatch(openAlertMessage("You are not logged in", "error"));
            history.push("/login")
        } else {
            setUser(JSON.parse(userDetails));
            connectWithSocketServer(JSON.parse(userDetails));
        }
    }, []);

    const [anchorElNav, setAnchorElNav] = useState(null);
    const handleCloseNavMenu = () => setAnchorElNav(null);

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            cursor: 'pointer',
                        }}
                        onClick={() => history.push("/classroom")}
                    >
                        CLASSROOM
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        CLASSROOM
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navbar