import React from 'react';
import './About.css';
import heroImg from '../assets/hero.png'; // Reusing for aesthetic

const About = () => {
  return (
    <div className="about-page fade-in">
      <div className="about-header">
        <h1 className="about-title">Our <span>Story</span></h1>
        <p className="about-subtitle">The artistry behind the scent.</p>
      </div>

      <div className="about-content">
        <div className="about-text glass">
          <h2>A Heritage of Elegance</h2>
          <p>
            Founded in the heart of Paris, RYME PERFUM is dedicated to crafting 
            unforgettable olfactory experiences. We believe that a perfume is more 
            than just a scent—it is a signature, an emotion, and a memory.
          </p>
          <p>
            Our master perfumers source only the rarest and most exquisite raw 
            materials from around the globe, ensuring that every drop reflects 
            our uncompromising commitment to quality and sustainability.
          </p>
        </div>
        <div className="about-image-wrapper">
          <img src={heroImg} alt="Our Heritage" className="about-img" />
          <div className="about-img-backdrop"></div>
        </div>
      </div>
    </div>
  );
};

export default About;
