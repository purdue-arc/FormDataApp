import { useNavigate } from "react-router-dom";
import "./SubmissionOverlay.css";
import {default as React} from "react"; // Import the CSS file for styling

function SubmissionOverlay() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate("/"); // Navigate back to the start screen
    };

    return (
        <div className="submission-overlay">
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
