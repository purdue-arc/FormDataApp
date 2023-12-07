import {Link} from "react-router-dom";
import React from "react";
import "./Start.css";

function StartScreen() {
    return (
        <div className="start-screen">
            <h1>Welcome! Select your organization type:</h1>
            <div className="links-container">
                <Link className="start-link" to="/company">Company</Link>
                <Link className="start-link" to="/club">Club</Link>
                <Link className="start-link" to="/lab">Lab</Link>
            </div>
        </div>
    );
}
export default StartScreen;