import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X, Building2, Users, Home, Database } from 'lucide-react';
import "./Nav.css";
import logo from "./riselogo.png";
import { Link } from 'react-router-dom';

const NavLinks = () => (
    <>
        <motion.p whileHover={{ scale: 1.02 }}>
            <a href="company">
                <Building2 size={18} />
                Company
            </a>
        </motion.p>
        <motion.p whileHover={{ scale: 1.02 }}>
            <a href="club">
                <Users size={18} />
                Club
            </a>
        </motion.p>
        <motion.p whileHover={{ scale: 1.02 }}>
            <a href="lab">
                <Home size={18} />
                Lab
            </a>
        </motion.p>
        <motion.p whileHover={{ scale: 1.02 }}>
            <a href="viewer">
                <Database size={18} />
                View Data
            </a>
        </motion.p>
    </>
);

const Navbar = ({ theme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { scrollY } = useScroll();

    // Transform values based on scroll with a longer range
    const borderRadius = useTransform(
        scrollY,
        [20, 220], // Increased range for more gradual effect
        [0, 10]   // Max border radius slightly reduced
    );

    const width = useTransform(
        scrollY,
        [20, 220],
        ["100vw", "94vw"]
    );

    const height = useTransform(
        scrollY,
        [20, 220],
        ["6rem", "5rem"]
    );

    const xOffset = useTransform(
        scrollY,
        [20, 220],
        ["0vw", "3vw"] // This controls the left position
    );

    const yOffset = useTransform(
        scrollY,
        [20, 220],
        ["0vh", "0.8vh"] // This controls the left position
    );

    const themeClass = theme ? `navbar--${theme}` : '';

    return (
        <div className={`nav-wrapper ${themeClass}`}>
            <motion.div
                className="navbar"
                style={{
                    borderRadius,
                    width,
                    height,
                    left: xOffset,
                    top: yOffset
                }}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }}
            >
                <div className="navbar-links">
                    <motion.div
                        className="navbar-links_logo"
                        whileHover={{ scale: 1.02 }}
                    >
                        <Link to="/">
                            <img src={logo} alt="RISE_Logo" />
                        </Link>
                    </motion.div>
                    <motion.div
                        className="navbar-links_container"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <NavLinks />
                    </motion.div>
                </div>
                <div className="navbar-menu">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isOpen ? (
                            <X color="#fff" size={27} onClick={() => setIsOpen(false)} />
                        ) : (
                            <Menu color="#fff" size={27} onClick={() => setIsOpen(true)} />
                        )}
                    </motion.div>

                    {isOpen && (
                        <motion.div
                            className="navbar-menu_container"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <NavLinks />
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Navbar;