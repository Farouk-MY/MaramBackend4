import React from 'react'

const ClientFeedback = () => {
  return (
    <div className="client-feedback-area">
      <div className="single-feedback">
        <div className="inner">
          <div className="meta-img-section">
            <a className="image" href="#">
              <img src="/src/assets/images/logo/logo5.png" alt="Client" />
            </a>
          </div>
          <div className="rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <a href="#rating" key={star}>
                <i className="fa-sharp fa-solid fa-star"></i>
              </a>
            ))}
          </div>
          <div className="content">
           
            <div className="bottom-content">
              <div className="meta-info-section">
              
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientFeedback