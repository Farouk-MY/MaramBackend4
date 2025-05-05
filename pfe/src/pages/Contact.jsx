import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadphones, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';

const Contact = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('http://localhost:8000/api/v1/contact', formData);
            toast.success('Message sent successfully!');
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                message: ''
            });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="main-content">
            <div className="contact-banner"
                 style={{
                     padding: "120px 0 60px",
                     background: "",
                     position: "relative",
                     overflow: "hidden"
                 }}>
                <div className="bg-shape">
                    <img className="bg-shape-one" src="/src/assets/images/bg/bg-shape-four.png" alt="Bg Shape"
                         style={{ position: "absolute", bottom: "-10px", left: "0", opacity: "0.3" }} />
                    <img className="bg-shape-two" src="/src/assets/images/bg/bg-shape-five.png" alt="Bg Shape"
                         style={{ position: "absolute", top: "20px", right: "10%", opacity: "0.2" }} />
                </div>
            </div>

            <div className="rainbow-contact-area" style={{ padding: "80px 0" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="contact-wrapper"
                                 style={{
                                     background: "var(--color-dark)",
                                     borderRadius: "15px",
                                     boxShadow: "var(--dark-shadow-1)",
                                     overflow: "hidden",
                                     position: "relative"
                                 }}>
                                <div className="row g-0">
                                    <div className="col-lg-7">
                                        <div className="contact-form-wrapper" style={{ padding: "40px" }}>
                                            <h3 className="title mb-4" style={{ fontSize: "28px", color: "var(--color-heading)" }}>
                                                Contact Us
                                            </h3>

                                            <form className="rbt-profile-row rbt-default-form row row--15" onSubmit={handleSubmit}>
                                                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="first_name" className="mb-2" style={{ color: "var(--color-body)" }}>First Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="first_name"
                                                            placeholder="First Name"
                                                            value={formData.first_name}
                                                            onChange={handleChange}
                                                            required
                                                            style={{
                                                                background: "var(--color-lessdark)",
                                                                border: "1px solid var(--color-border)",
                                                                borderRadius: "8px",
                                                                padding: "12px 15px",
                                                                color: "var(--color-body)",
                                                                fontSize: "16px"
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="last_name" className="mb-2" style={{ color: "var(--color-body)" }}>Last Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="last_name"
                                                            placeholder="Last Name"
                                                            value={formData.last_name}
                                                            onChange={handleChange}
                                                            required
                                                            style={{
                                                                background: "var(--color-lessdark)",
                                                                border: "1px solid var(--color-border)",
                                                                borderRadius: "8px",
                                                                padding: "12px 15px",
                                                                color: "var(--color-body)",
                                                                fontSize: "16px"
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="email" className="mb-2" style={{ color: "var(--color-body)" }}>Email</label>
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            id="email"
                                                            placeholder="Email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            required
                                                            style={{
                                                                background: "var(--color-lessdark)",
                                                                border: "1px solid var(--color-border)",
                                                                borderRadius: "8px",
                                                                padding: "12px 15px",
                                                                color: "var(--color-body)",
                                                                fontSize: "16px"
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="phone" className="mb-2" style={{ color: "var(--color-body)" }}>Phone Number</label>
                                                        <input
                                                            type="tel"
                                                            className="form-control"
                                                            id="phone"
                                                            placeholder="+216"
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            style={{
                                                                background: "var(--color-lessdark)",
                                                                border: "1px solid var(--color-border)",
                                                                borderRadius: "8px",
                                                                padding: "12px 15px",
                                                                color: "var(--color-body)",
                                                                fontSize: "16px"
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="message" className="mb-2" style={{ color: "var(--color-body)" }}>Message</label>
                                                        <textarea
                                                            className="form-control"
                                                            id="message"
                                                            rows={5}
                                                            placeholder="Your message"
                                                            value={formData.message}
                                                            onChange={handleChange}
                                                            required
                                                            style={{
                                                                background: "var(--color-lessdark)",
                                                                border: "1px solid var(--color-border)",
                                                                borderRadius: "8px",
                                                                padding: "12px 15px",
                                                                color: "var(--color-body)",
                                                                fontSize: "16px",
                                                                resize: "vertical"
                                                            }}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                                <div className="col-12 mt-4">
                                                    <button
                                                        type="submit"
                                                        className="btn"
                                                        disabled={submitting}
                                                        style={{
                                                            background: "var(--dark-gradient-2)",
                                                            color: "var(--color-white)",
                                                            border: "none",
                                                            borderRadius: "30px",
                                                            padding: "14px 35px",
                                                            fontSize: "16px",
                                                            fontWeight: "500",
                                                            boxShadow: "var(--shadow-light)",
                                                            transition: "all 0.3s ease",
                                                            opacity: submitting ? 0.7 : 1
                                                        }}
                                                    >
                                                        {submitting ? 'Sending...' : 'Send Message'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                    <div className="col-lg-5">
                                        <div className="contact-info-wrapper"
                                             style={{
                                                 padding: "40px",
                                                 height: "100%",
                                                 background: "var(--dark-gradient-3)",
                                                 display: "flex",
                                                 flexDirection: "column",
                                                 justifyContent: "center"
                                             }}>
                                            <h3 className="mb-4" style={{ fontSize: "28px", color: "var(--color-heading)" }}>
                                                Contact Information
                                            </h3>

                                            <div className="rainbow-address mb-4">
                                                <div className="d-flex">
                                                    <div className="icon me-4">
                                                        <div
                                                            style={{
                                                                width: "60px",
                                                                height: "60px",
                                                                borderRadius: "50%",
                                                                background: "rgba(0,191,255,0.1)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faLocationDot}
                                                                style={{
                                                                    fontSize: "24px",
                                                                    color: "#00BFFF"
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="inner">
                                                        <h4 className="title mb-2" style={{ fontSize: "20px", color: "var(--color-heading)" }}>
                                                            Our Location
                                                        </h4>
                                                        <p style={{ fontSize: "16px", color: "var(--color-body)", lineHeight: "1.6" }}>
                                                            123 AI Avenue, Tech District<br />
                                                            San Francisco, CA 94103
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rainbow-address mb-4">
                                                <div className="d-flex">
                                                    <div className="icon me-4">
                                                        <div
                                                            style={{
                                                                width: "60px",
                                                                height: "60px",
                                                                borderRadius: "50%",
                                                                background: "rgba(0,191,255,0.1)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faHeadphones}
                                                                style={{
                                                                    fontSize: "24px",
                                                                    color: "#00BFFF"
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="inner">
                                                        <h4 className="title mb-2" style={{ fontSize: "20px", color: "var(--color-heading)" }}>
                                                            Contact Number
                                                        </h4>
                                                        <p style={{ fontSize: "16px", color: "var(--color-body)", lineHeight: "1.6" }}>
                                                            <a href="tel:+14445556667" style={{ color: "var(--color-body)", textDecoration: "none" }}>+1 444 555 6667</a><br />
                                                            <a href="tel:+12222222333" style={{ color: "var(--color-body)", textDecoration: "none" }}>+1 222 222 2333</a>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rainbow-address">
                                                <div className="d-flex">
                                                    <div className="icon me-4">
                                                        <div
                                                            style={{
                                                                width: "60px",
                                                                height: "60px",
                                                                borderRadius: "50%",
                                                                background: "rgba(0,191,255,0.1)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faEnvelope}
                                                                style={{
                                                                    fontSize: "24px",
                                                                    color: "#00BFFF"
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="inner">
                                                        <h4 className="title mb-2" style={{ fontSize: "20px", color: "var(--color-heading)" }}>
                                                            Email Address
                                                        </h4>
                                                        <p style={{ fontSize: "16px", color: "var(--color-body)", lineHeight: "1.6" }}>
                                                            <a href="mailto:admin@example.com" style={{ color: "var(--color-body)", textDecoration: "none" }}>admin@example.com</a><br />
                                                            <a href="mailto:info@example.com" style={{ color: "var(--color-body)", textDecoration: "none" }}>info@example.com</a>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="social-media mt-5">
                                                <h5 className="mb-3" style={{ fontSize: "18px", color: "var(--color-heading)" }}>Follow Us</h5>
                                                <ul className="list-inline">
                                                    <li className="list-inline-item">
                                                        <a
                                                            href="#"
                                                            className="d-inline-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                borderRadius: "50%",
                                                                background: "var(--color-lessdark)",
                                                                color: "var(--color-primary)",
                                                                transition: "all 0.3s ease",
                                                                marginRight: "10px"
                                                            }}
                                                        >
                                                            <i className="fab fa-facebook-f"></i>
                                                        </a>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <a
                                                            href="#"
                                                            className="d-inline-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                borderRadius: "50%",
                                                                background: "var(--color-lessdark)",
                                                                color: "var(--color-primary)",
                                                                transition: "all 0.3s ease",
                                                                marginRight: "10px"
                                                            }}
                                                        >
                                                            <i className="fab fa-twitter"></i>
                                                        </a>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <a
                                                            href="#"
                                                            className="d-inline-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                borderRadius: "50%",
                                                                background: "var(--color-lessdark)",
                                                                color: "var(--color-primary)",
                                                                transition: "all 0.3s ease",
                                                                marginRight: "10px"
                                                            }}
                                                        >
                                                            <i className="fab fa-instagram"></i>
                                                        </a>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <a
                                                            href="#"
                                                            className="d-inline-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                borderRadius: "50%",
                                                                background: "var(--color-lessdark)",
                                                                color: "var(--color-primary)",
                                                                transition: "all 0.3s ease"
                                                            }}
                                                        >
                                                            <i className="fab fa-linkedin-in"></i>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="map-section" style={{ padding: "0 0 80px" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div
                                className="map-container"
                                style={{
                                    borderRadius: "15px",
                                    overflow: "hidden",
                                    height: "450px",
                                    boxShadow: "var(--dark-shadow-1)"
                                }}
                            >
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.305935303!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1549271994796"
                                    width="100%"
                                    height="100%"
                                    style={{border:0}}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;