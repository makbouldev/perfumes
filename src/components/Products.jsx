import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Products.css';
import ProductCard from './ProductCard';
import { API_URL } from '../config';
import { resolveImageUrl } from '../utils/imageResolver';

const Products = ({ limit, showViewAll = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  return (
    <section id="collection" className="products-section">
      <div className="section-header fade-in">
        <span className="section-subtitle">Exclusive Collection</span>
        <h2 className="section-title">The Masterpieces</h2>
        <p className="section-desc">
          Each bottle is a work of art, meticulously crafted to perfection.
        </p>
      </div>

      <div className="products-grid">
        {loading ? (
          <p>Loading collection...</p>
        ) : (
          products
            .slice()
            .reverse()
            .slice(0, limit || products.length)
            .map((product, index) => (
            <ProductCard 
              key={product.id}
              {...product}
              image={resolveImageUrl(product.imagePath)}
              imagePath={product.imagePath}
              delay={index + 1}
            />
          ))
        )}
      </div>
      {showViewAll && (
        <div className="view-all-container fade-in delay-3">
          <Link to="/collection" className="secondary-btn view-all-btn">View Full Collection</Link>
        </div>
      )}
    </section>
  );
};

export default Products;
