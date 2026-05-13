import React from 'react';
import './ProductCard.css';
import { FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const ProductCard = ({ id, image, imagePath, name, notes, price, delay }) => {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.stopPropagation(); // Prevent card click if we add a link wrapper later
    addToCart({ id, name, price, imagePath });
  };

  return (
    <div className={`product-card fade-in delay-${delay}`}>
      <div className="card-image-container">
        <img src={image} alt={name} className="product-image" />
        <div className="card-overlay glass">
          <button className="quick-add-btn" onClick={handleAdd}>
            <FiShoppingBag size={18} /> Quick Add
          </button>
        </div>
      </div>
      <div className="card-info">
        <span className="product-notes">{notes}</span>
        <h3 className="product-name">{name}</h3>
        <span className="product-price">${price}</span>
      </div>
    </div>
  );
};

export default ProductCard;
