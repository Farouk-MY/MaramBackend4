import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <footer className="rainbow-footer footer-style-default footer-style-3 position-relative">
        <div className="footer-top">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                <div className="rainbow-footer-widget">
                  <div className="logo">
                    <Link to="/">
                      <img className="logo-light" src="/src/assets/images/logo/logo5.png" alt="ChatBot Logo" style={{ maxHeight: "150px" }} />
                    </Link>
                  </div>
                  
                  <h6 className="subtitle">Join a Newsletter</h6>
                  <form className="newsletter-form" action="#">
                    <div className="form-group">
                      <input type="email" placeholder="Enter Your Email Here" />
                      <button className="btn-default bg-solid-primary" type="submit"><i className="fa-sharp fa-regular fa-arrow-right"></i></button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-lg-2 col-md-6 col-sm-6 col-12">
                <div className="rainbow-footer-widget">
                  <div className="widget-menu-bottom">
                    <h4 className="title">Quick Links</h4>
                    <div className="inner">
                      <ul className="footer-link link-hover">
                        <li><a href="#">AI Models </a></li>
                        <li><a href="#">How to use</a></li>
                       
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-md-6 col-sm-6 col-12">
                <div className="rainbow-footer-widget">
                  <div className="widget-menu-top">
                    <h4 className="title">Services</h4>
                    <div className="inner">
                      <ul className="footer-link link-hover">
                        <li><a href="/blog">Add new Model</a></li>
                        
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                <div className="rainbow-footer-widget">
                  <div className="widget-menu-top">
                    <h4 className="title">Contact</h4>
                    <div className="inner">
                      <ul className="footer-link contact-link">

                        <li><i className="contact-icon fa-sharp fa-regular fa-envelope"></i><a href="#">TuneAI@gmail.com</a></li>
                        <li><i className="contact-icon fa-regular fa-phone"></i><a href="#">+216 58 410 466</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="copyright-area copyright-style-one">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-8 col-sm-12 col-12">
              <div className="copyright-left">
                <ul className="ft-menu link-hover">
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms And Condition</a></li>
                  <li><a href="#">Contact Us</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6 col-md-4 col-sm-12 col-12">
              <div className="copyright-right text-center text-lg-end">
                <p className="copyright-text">Copyright © 2024 <a href="https://themeforest.net/user/rainbow-themes" className="btn-read-more"><span>Rainbow-Themes.</span></a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;