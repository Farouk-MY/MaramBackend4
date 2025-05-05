import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
// Remove Contact import

const Home = ({ showContact }) => {  // State for the text area in the hero section
  const [promptText, setPromptText] = useState('');
  
  // Settings for brand slider
  const brandSliderSettings = {
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    speed: 8000,
    autoplaySpeed: 0,
    cssEase: 'linear',
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  // Settings for testimonial slider
  const testimonialSliderSettings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  // Settings for service slider
  const serviceSliderSettings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Prompt submitted:', promptText);
    // Add your AI processing logic here
  };

  return (
    <>
      {/* Header Top Area */}
      

      {/* Header Area */}
      

      {/* Mobile Menu Popup */}
      

      {/* Hero Section */}
      <div className="slider-area slider-style-1 variation-default slider-bg-image bg-banner1 slider-bg-shape" data-black-overlay="1">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="inner text-center mt--140">
                <h1 className="title display-one">
                Create,Explore,Ask
                  <br /> 
                  <span className="header-caption">
                    <span className="cd-headline rotate-1">
                      <span className="cd-words-wrapper">
                        <b className="theme-gradient is-visible">AI Models</b>
                        <b className="theme-gradient">AI Writing</b>
                        <b className="theme-gradient">AI Coding</b>
                      </span>
                    </span>
                  </span> AI Hack
                </h1>
                
                <div className="form-group">
                  <textarea 
                    name="text" 
                    id="slider-text-area" 
                    cols="30" 
                    rows="2" 
                    placeholder="Enter a prompt, for example: a fundraising deck to a mobile finance app called Intuitive"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                  ></textarea>
                  <a className="btn-default" href="#" onClick={handleSubmit}>Start with AI</a>
                </div>
                
              </div>
            </div>
           
          </div>
        </div>
        <div className="bg-shape">
          <img className="bg-shape-one" src="/src/assets/images/bg/bg-shape-four.png" alt="Bg Shape" />
          <img className="bg-shape-two" src="/src/assets/images/bg/bg-shape-five.png" alt="Bg Shape" />
        </div>
      </div>

      {/* Brand Area */}
      <div className="rainbow-brand-area rainbow-section-gap">
        <div className="container">
          <div className="row">
            
          </div>
         
        </div>
      </div>

      {/* Generator Tab Area */}
      <div className="rainbow-service-area rainbow-section-gap">
        <div className="container">
         

          <div className="row row--30 align-items-center">
            <div className="col-lg-12">
              <div className="rainbow-default-tab style-three generator-tab-defalt">
               

                <div className="rainbow-tab-content tab-content">
                  {/* Audio Generator Tab */}
                  <div className="tab-pane fade show active" id="audio-generate" role="tabpanel" aria-labelledby="audio-generator-tab">
                    <div className="inner">
                      <div className="row">
                        <div className="col-xl-6">
                          <div className="section-title">
                            <h2 className="title">Add New Models.</h2>
                            <div className="features-section">
                              <ul className="list-style--1">
                                <li><i className="fa-regular fa-circle-check"></i> Add your own  Models easily </li>
                                <li><i className="fa-regular fa-circle-check"></i> chat with differents  Models</li>
                                <li><i className="fa-regular fa-circle-check"></i>Pre-trained Models</li>
                               
                              </ul>
                            </div>
                            <div className="read-more">
                              <a className="btn-default color-blacked" href="#">
                                Add model Now <i className="fa-sharp fa-solid fa-arrow-right"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-6 mt_md--30 mt_sm--30">
                          <div className="export-img">
                            <div className="inner-without-padding">
                              <div className="export-img img-bg-shape">
                                <img className="shape-dark" src="/src/assets/images/generator-img/cptr.png" alt="Chat example Image" />
                                <img className="shape-light" src="/src/assets/images/light/generator-img/cptr.png" alt="Chat example Image" />
                                <div className="image-shape"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Other tabs would be implemented similarly */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Area */}
      <div className="rainbow-service-area rainbow-section-gap rainbow-section-gapBottom-big">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-left">
                <h4 className="subtitle">
                  <span className="theme-gradient">Assisting individuals</span>
                </h4>
                <h2 className="title mb--60">
                  Chat Smarter <br />  with TuneAI
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Slider {...serviceSliderSettings} className="service-wrapper rainbow-service-slider-actvation slick-grid-15 rainbow-slick-dot rainbow-gradient-arrows">
                <div className="slide-single-layout">
                  <div className="rainbow-box-card card-style-default aiwave-service-default has-bg-shaped">
                    <div className="inner">
                      <div className="icon">
                        <img src="/src/assets/images/icons/service-icon-01.svg" alt="Service Icon" />
                      </div>
                      <div className="description centered-shape">
                        <h5 className="title">Ask anything</h5>
                        <p className="desc">Lets users quickly find answers to their questions without having to search through multiple sources.</p>
                        <a className="read-more-btn" href="#">Explore More <span><i className="fa-sharp fa-solid fa-arrow-right"></i></span></a>
                      </div>
                    </div>
                    <div className="bg-shaped">
                      <img src="/src/assets/images/service/bg.png" alt="" className="bg shape-dark" />
                      <img src="/src/assets/images/service/bg-hover.png" alt="" className="bg-hover shape-dark" />
                      <img src="/src/assets/images/light/service/bg.png" alt="" className="bg shape-light" />
                      <img src="/src/assets/images/light/service/bg-hover.png" alt="" className="bg-hover shape-light" />
                    </div>
                  </div>
                </div>
                <div className="slide-single-layout">
                  <div className="rainbow-box-card card-style-default aiwave-service-default has-bg-shaped">
                    <div className="inner">
                      <div className="icon">
                        <img src="/src/assets/images/icons/service-icon-02.svg" alt="Service Icon" />
                      </div>
                      <div className="description centered-shape">
                        <h5 className="title">Connect everywhere</h5>
                        <p className="desc">Lets users quickly find answers to their questions without having to search through multiple sources.</p>
                        <a className="read-more-btn" href="#">Explore More <span><i className="fa-sharp fa-solid fa-arrow-right"></i></span></a>
                      </div>
                    </div>
                    <div className="bg-shaped">
                      <img src="/src/assets/images/service/bg.png" alt="" className="bg shape-dark" />
                      <img src="/src/assets/images/service/bg-hover.png" alt="" className="bg-hover shape-dark" />
                      <img src="/src/assets/images/light/service/bg.png" alt="" className="bg shape-light" />
                      <img src="/src/assets/images/light/service/bg-hover.png" alt="" className="bg-hover shape-light" />
                    </div>
                  </div>
                </div>
                <div className="slide-single-layout">
                  <div className="rainbow-box-card card-style-default aiwave-service-default has-bg-shaped">
                    <div className="inner">
                      <div className="icon">
                        <img src="/src/assets/images/icons/service-icon-03.svg" alt="Service Icon" />
                      </div>
                      <div className="description centered-shape">
                        <h5 className="title">Fast responding</h5>
                        <p className="desc">Lets users quickly find answers to their questions without having to search through multiple sources.</p>
                        <a className="read-more-btn" href="#">Explore More <span><i className="fa-sharp fa-solid fa-arrow-right"></i></span></a>
                      </div>
                    </div>
                    <div className="bg-shaped">
                      <img src="/src/assets/images/service/bg.png" alt="" className="bg shape-dark" />
                      <img src="/src/assets/images/service/bg-hover.png" alt="" className="bg-hover shape-dark" />
                      <img src="/src/assets/images/light/service/bg.png" alt="" className="bg shape-light" />
                      <img src="/src/assets/images/light/service/bg-hover.png" alt="" className="bg-hover shape-light" />
                    </div>
                  </div>
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      

      {/* Copyright Area */}
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

export default Home;