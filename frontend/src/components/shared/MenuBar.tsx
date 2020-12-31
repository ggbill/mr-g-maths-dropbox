import React, { useState, useLayoutEffect } from 'react'
import { AppBar, Toolbar, Button, Drawer, MenuItem } from '@material-ui/core'
import { Link } from 'react-router-dom'
import "./menuBar.scss"
import LinkButton from './LinkButton'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'

interface InputProps {
    setCurrentPath: (path: string) => void,
}

const MenuBar = (props: InputProps) => {
    const [scrollClass, setScrollClass] = useState("menu-bar no-shadow")
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const toggleDrawer = (open: boolean) => event => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setIsDrawerOpen(open);
    };

    const handleClose = () => {
        setIsDrawerOpen(false);
    };

    const handleScroll = () => {
        if (window.pageYOffset > 1) {
            setScrollClass("menu-bar shadow")
        } else {
            setScrollClass("menu-bar no-shadow")
        }
    };

    useLayoutEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', () => handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, []);

    return (
        <>
            <AppBar className={scrollClass}>
                <Toolbar>
                        <img className="logo" alt="logo" src={require("../../images/MrG-maths-logo-mobile.png")} onClick={() => props.setCurrentPath("")} />
                    <div className="menu-items">
                        <LinkButton className="link-button" to='/about'>About</LinkButton>
                    </div>
                    <Button className="clickable-icon hamburger-menu" aria-controls="simple-menu" aria-haspopup="true" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="top"
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
                className="menu-drawer"
            >
                <div className="close-icon-container">
                    <Button className="clickable-icon" aria-controls="simple-menu" aria-haspopup="true" onClick={toggleDrawer(false)}>
                        <CloseIcon />
                    </Button>
                </div>
                <Link to='/about' style={{ textDecoration: 'none', color: 'black' }}>
                    <MenuItem onClick={handleClose}>About</MenuItem>
                </Link>
                <div className="drawer-footer">
                    <img className="logo" alt="logo" src={require("../../images/G-with-glow.png")} />
                </div>
            </Drawer>
        </>
    )
}

export default MenuBar