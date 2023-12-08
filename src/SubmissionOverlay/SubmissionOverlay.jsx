import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SubmissionOverlay.css";

function SubmissionOverlay() {
    const [whiteOverlay, setWhiteOverlay] = useState(false);
    const navigate = useNavigate();

    const handleBackClick = () => {
        setWhiteOverlay(true);
        setTimeout(() => navigate("/"), 1000); // Adjust the duration to match the fade-in animation time
    };

    return (
        <div className="submission-overlay">
            {whiteOverlay && <div className="white-overlay"></div>}
            <div className="overlay-content">
                <h2>Submission Successful!</h2>
                <div className="success-message">
                    Your form has been successfully submitted! If any questions
                    or concerns, you can contact us here: vmuthuku@purdue.edu
                </div>
                <button onClick={handleBackClick} className="back-button">Back to Start</button>
            </div>
        </div>
    );
}

export default SubmissionOverlay;
