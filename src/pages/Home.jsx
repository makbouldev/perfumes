import React from 'react';
import Hero from '../components/Hero';
import Products from '../components/Products';

const Home = () => {
  return (
    <div className="page-transition fade-in">
      <Hero />
      <Products limit={6} showViewAll={true} />
    </div>
  );
};

export default Home;
