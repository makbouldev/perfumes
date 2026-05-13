import React from 'react';
import './Hero.css';
import heroImg from '../assets/hero.png';
import { FiArrowRight } from 'react-icons/fi';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-content fade-in delay-1">
        <span className="hero-subtitle">The Essence of Elegance</span>
        <h1 className="hero-title">Discover Your<br/>Signature <span>Scent</span></h1>
        <p className="hero-description">
          Experience our curated collection of luxurious fragrances designed to 
          awaken the senses and leave a lasting impression.
        </p>
        <div className="hero-actions">
          <button className="primary-btn">
            Shop Collection <FiArrowRight className="btn-icon" />
          </button>
          <button className="secondary-btn">Explore Origins</button>
        </div>
      </div>
      <div className="hero-image fade-in delay-2">
        <div className="image-wrapper">
          <img src={heroImg} alt="Luxury Perfume Bottle" />
          <div className="image-backdrop glass"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
