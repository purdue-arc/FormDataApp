import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Start.css";

function StartScreen() {
    const [fadeOut, setFadeOut] = useState(false);
    const navigate = useNavigate();

    const handleLinkClick = (path) => {
        setFadeOut(true);
        setTimeout(() => navigate(path), 500); // Match this with the duration of your fade-out animation
    };

    useEffect(() => {
        let timeout;
        if (fadeOut) {
            timeout = setTimeout(() => setFadeOut(false), 1500);
        }
        return () => clearTimeout(timeout); // Clear the timeout when the component unmounts or the fadeOut state changes
    }, [fadeOut]);

    return (
        <div className={`start-screen ${fadeOut ? 'fade-out' : ''}`}>
            <h1>Welcome! Select your organization type:</h1>
            <div className="links-container">
                <div onClick={() => handleLinkClick('/company')} className="start-link">Company</div>
                <div onClick={() => handleLinkClick('/club')} className="start-link">Club</div>
                <div onClick={() => handleLinkClick('/lab')} className="start-link">Lab</div>
            </div>
        </div>
    );
}

export default StartScreen;
