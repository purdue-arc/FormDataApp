import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import "./Nav.css";

const Menu = () => (
    <>
        <p>
            <Link to="/"> Company </Link>
        </p>
        <p>
            <Link to="/club"> Club </Link>
        </p>
        <p>
            <Link to="/lab"> Lab </Link>
        </p>
    </>
);

const Navbar  = () => {
    const [toggleMenu, setToggleMenu] = useState(false);
    return (
        <div className="gpt3__navbar">
            <div className="gpt3__navbar-links">
                <div className="gpt3__navbar-links_logo">
                </div>
                <div className="gpt3__navbar-links_container">
                    <Menu />
                </div>
            </div>
            <div className="gpt3__navbar-sign">
            </div>
            <div className="gpt3__navbar-menu">
                {toggleMenu ?
                    <RiCloseLine
                        color="#fff"
                        size={27}
                        onClick={() => setToggleMenu(false)}
                    />
                    :
                    <RiMenu3Line
                        color="#fff"
                        size={27}
                        onClick={() => setToggleMenu(true)}
                    />
                }

                {toggleMenu && (
                    <div className="gpt3__navbar-menu_container scale-up-center">
                        <div className="gpt3__navbar-menu_container-links"></div>
                        <Menu />

                        <div className="gpt3__navbar-menu-container-links-sign">
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
