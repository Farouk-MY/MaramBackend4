import { useState } from 'react';

const EmailVerificationModal = ({ email, onClose, onSuccess }) => {
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/auth/verify/${verificationCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Failed to verify account');
            }

            setSuccess(true);
            // Call success callback after 1.5 seconds
            setTimeout(() => {
                onSuccess();
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="verification-modal">
                <div className="modal-header">
                    <h3>Verify Your Email</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    {success ? (
                        <div className="success-message">
                            <i className="fa-sharp fa-regular fa-circle-check"></i>
                            <p>Your email has been verified successfully!</p>
                            <p>Redirecting to sign in page...</p>
                        </div>
                    ) : (
                        <>
                            <p>We've sent a verification code to:</p>
                            <p className="email-highlight">{email}</p>
                            <p>Please enter the 6-digit verification code below:</p>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="verification-input-container">
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        placeholder="Enter verification code"
                                        required
                                        maxLength={6}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn-default"
                                    disabled={loading}
                                >
                                    {loading ? 'Verifying...' : 'Verify Email'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationModal;