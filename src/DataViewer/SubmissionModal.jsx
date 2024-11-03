import React from 'react';
import { X } from 'lucide-react';

export function SubmissionModal({ isOpen, onClose, submission, getEntityName, getEntitySize }) {
    if (!submission) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2 className="modal-title">{getEntityName(submission, submission.type)}</h2>

                <div className="modal-details">
                    <div className="modal-section">
                        <h3>Organization Details</h3>
                        <p><strong>Type:</strong> {submission.type.charAt(0).toUpperCase() + submission.type.slice(1)}</p>
                        <p><strong>Size:</strong> {getEntitySize(submission, submission.type)}</p>
                        <p><strong>Participation Type:</strong> {submission.participationType || 'Not Specified'}</p>
                        <p><strong>Number of Representatives:</strong> {submission.numPeople}</p>
                    </div>

                    <div className="modal-section">
                        <h3>Contact Information</h3>
                        <p><strong>Name:</strong> {submission.contactName}</p>
                        <p><strong>Email:</strong> {submission.contactEmail}</p>
                        <p><strong>Phone:</strong> {submission.contactPhoneNumber || 'N/A'}</p>
                    </div>

                    {submission.comments && (
                        <div className="modal-section">
                            <h3>Additional Comments</h3>
                            <p>{submission.comments}</p>
                        </div>
                    )}

                    <div className="modal-section">
                        <h3>Submission Details</h3>
                        <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}