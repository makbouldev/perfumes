import React from 'react';
import Hero from '../components/Hero';
import Products from '../components/Products';

const Home = () => {
  return (
    <div className="page-transition fade-in">
      <Hero />
      <Products />
    </div>
  );
};

export default Home;
