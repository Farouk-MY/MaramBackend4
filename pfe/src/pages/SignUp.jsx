import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ClientFeedback from '../components/common/ClientFeedback'
import EmailVerificationModal from '../components/common/EmailVerificationModal'

const SignUp = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Reset states
    setError('')
    setSuccess(false)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to sign up')
      }

      setSuccess(true)
      // Show verification modal instead of redirecting immediately
      setShowVerificationModal(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle verification success
  const handleVerificationSuccess = () => {
    // Redirect to sign in page after successful verification
    navigate('/signin')
  }

  // Handle modal close
  const handleCloseModal = () => {
    setShowVerificationModal(false)
    // Redirect to sign in page even if they didn't verify
    navigate('/signin')
  }

  return (
      <div className="signup-area">
        <div className="wrapper">
          <div className="row">
            <div className="col-lg-6 bg-color-blackest left-wrapper">
              <div className="sign-up-box">
                <div className="signup-box-top">
                  <Link to="/">
                    {/* Logo can go here */}
                  </Link>
                </div>
                <div className="signup-box-bottom">
                  <div className="signup-box-content">
                    <div className="text-social-area">
                      <hr />
                      <span>Create Account</span>
                      <hr />
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                    )}

                    {success && !showVerificationModal && (
                        <div className="alert alert-success" role="alert">
                          Account created successfully! Please verify your email address.
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="input-section">
                        <div className="icon"><i className="feather-user"></i></div>
                        <input
                            type="text"
                            name="full_name"
                            placeholder="Enter Your Name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                        />
                      </div>
                      <div className="input-section mail-section">
                        <div className="icon"><i className="fa-sharp fa-regular fa-envelope"></i></div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                      </div>
                      <div className="input-section password-section">
                        <div className="icon"><i className="fa-sharp fa-regular fa-lock"></i></div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                      </div>
                      <div className="input-section password-section">
                        <div className="icon"><i className="fa-sharp fa-regular fa-lock"></i></div>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                      </div>
                      <button
                          type="submit"
                          className="btn-default"
                          disabled={loading}
                      >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                      </button>
                    </form>
                  </div>
                  <div className="signup-box-footer">
                    <div className="bottom-text">
                      Do you have an account? <Link className="btn-read-more ml--5" to="/signin"><span>Sign In</span></Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 right-wrapper">
              <ClientFeedback />
            </div>
          </div>
        </div>
        {/* Verification Modal */}
        {showVerificationModal && (
            <EmailVerificationModal
                email={formData.email}
                onClose={handleCloseModal}
                onSuccess={handleVerificationSuccess}
            />
        )}
      </div>
  )
}

export default SignUp