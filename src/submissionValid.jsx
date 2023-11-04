import React from 'react';
import './SuccessPage.css'; // You can create a CSS file to style the page

const SuccessPage = () => {
    return (
        <div className="success-page">
            <div className="success-container">
                <h1 className="success-heading">Success!</h1>
                <p className="success-message">Your application has been submitted successfully.</p>
                <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                </div>
                <div className="success-button-container">
                    <button className="success-button">Back to Home</button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
