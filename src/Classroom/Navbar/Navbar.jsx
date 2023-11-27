import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppBar, Box, Button, Container, Menu, MenuItem, Toolbar, Typography } from '@mui/material';

import { connectWithSocketServer } from '../../realtimeCommunication/socketConnection';
import { openAlertMessage } from "../../store/actions/alertActions";
import { ContextStore } from '../../shared/context/Context';
import { logout } from '../../shared/utils/auth';

const pages = ['Products', 'Pricing', 'Blog'];

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
            <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

                <Button type='button' onClick={() => logout(history)} sx={{ backgroundColor: 'red', color: 'white', height: '35px', border: '2px solid red', ":hover": { backgroundColor: 'transparent' } }}>
                    Logout
                </Button>
            </Container>
        </AppBar>
    )
}

export default Navbar