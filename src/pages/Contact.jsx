import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page fade-in">
      <div className="contact-header">
        <h1 className="contact-title">Get in <span>Touch</span></h1>
        <p className="contact-subtitle">We would love to hear from you.</p>
      </div>

      <div className="contact-container">
        <div className="contact-info glass">
          <h3>Contact Information</h3>
          <p>Have questions about our fragrances or an existing order? Reach out to our dedicated concierge team.</p>
          
          <div className="info-block">
            <h4>Email</h4>
            <p>concierge@lauraparfums.com</p>
          </div>
          
          <div className="info-block">
            <h4>Phone</h4>
            <p>+1 (800) 123-4567</p>
          </div>

          <div className="info-block">
            <h4>Boutique</h4>
            <p>15 Rue de la Paix<br/>75002 Paris, France</p>
          </div>
        </div>

        <form className="contact-form glass" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="Enter your name" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows="5" placeholder="How can we assist you?" required></textarea>
          </div>

          <button type="submit" className="primary-btn submit-btn">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
