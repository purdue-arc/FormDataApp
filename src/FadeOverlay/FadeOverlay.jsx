import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./FadeOverlay.css";

function FadeOverlay() {
    const [showOverlay, setShowOverlay] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const fromStartScreen = location.state?.fromStartScreen || false;

    useEffect(() => {
        if (fromStartScreen) {
            setShowOverlay(true); // Show overlay initially
            const timer = setTimeout(() => {
                setShowOverlay(false); // Hide overlay after animation
                // Reset the state to avoid re-triggering the fade
                navigate(location.pathname, { replace: true });
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [fromStartScreen, location, navigate]);

    if (!showOverlay) {
        return null;
    }

    return (
        <div className="fade-overlay"></div>
    );
}

export default FadeOverlay;
