import React, { useState, useEffect } from 'react';
import './Products.css';
import ProductCard from './ProductCard';
import perfume1 from '../assets/perfume_1.png';
import perfume2 from '../assets/perfume_2.png';
import perfume3 from '../assets/perfume_3.png';
import perfume4 from '../assets/perfume_4.png';
import perfume5 from '../assets/perfume_5.png';
import perfume6 from '../assets/perfume_6.png';

const imageMap = {
  'perfume_1.png': perfume1,
  'perfume_2.png': perfume2,
  'perfume_3.png': perfume3,
  'perfume_4.png': perfume4,
  'perfume_5.png': perfume5,
  'perfume_6.png': perfume6
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
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
          products.map((product, index) => (
            <ProductCard 
              key={product.id}
              {...product}
              image={imageMap[product.imagePath]}
              delay={index + 1}
            />
          ))
        )}
      </div>
      
      <div className="view-all-container fade-in delay-3">
        <button className="secondary-btn view-all-btn">View Full Collection</button>
      </div>
    </section>
  );
};

export default Products;
