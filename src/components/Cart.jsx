import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FiX, FiTrash2 } from 'react-icons/fi';
import './Cart.css';
import perfume1 from '../assets/perfume_1.png';
import perfume2 from '../assets/perfume_2.png';
import perfume3 from '../assets/perfume_3.png';
import perfume4 from '../assets/perfume_4.png';
import perfume5 from '../assets/perfume_5.png';
import perfume6 from '../assets/perfume_6.png';

// Fallback map since imagePath is stored as string
const imageMap = {
  'perfume_1.png': perfume1,
  'perfume_2.png': perfume2,
  'perfume_3.png': perfume3,
  'perfume_4.png': perfume4,
  'perfume_5.png': perfume5,
  'perfume_6.png': perfume6
};

const Cart = () => {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, cartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          phone: formData.phone,
          address: formData.address,
          totalAmount: cartTotal
        })
      });
      
      if (response.ok) {
        alert("Thank you for your purchase! Your luxury fragrance is on its way.");
        clearCart();
        setIsCheckingOut(false);
        setFormData({ name: '', email: '', phone: '', address: '' });
        toggleCart();
      } else {
        alert("There was an issue processing your order.");
      }
    } catch (err) {
      alert("Network error: Could not place order.");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`cart-backdrop ${isCartOpen ? 'open' : ''}`} 
        onClick={toggleCart}
      />
      
      {/* Cart Drawer */}
      <div className={`cart-drawer glass ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-cart-btn" onClick={toggleCart}>
            <FiX size={24} />
          </button>
        </div>

        <div className="cart-items">
          {isCheckingOut ? (
            <form className="cart-checkout-form fade-in" onSubmit={handleCheckoutSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Delivery Address</label>
                <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" required></textarea>
              </div>
            </form>
          ) : (
            cartItems.length === 0 ? (
              <p className="empty-cart">Your cart is elegantly empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={imageMap[item.imagePath]} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="cart-item-qty">Qty: {item.quantity}</p>
                    <p className="cart-item-price">${item.price * item.quantity}</p>
                  </div>
                  <button 
                    className="remove-item-btn" 
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))
            )
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>${cartTotal}</span>
          </div>
          {isCheckingOut ? (
            <div className="checkout-actions">
              <button className="secondary-btn" onClick={() => setIsCheckingOut(false)}>Back</button>
              <button className="primary-btn" onClick={handleCheckoutSubmit}>Confirm Order</button>
            </div>
          ) : (
            <button 
              className="primary-btn checkout-btn" 
              disabled={cartItems.length === 0}
              onClick={() => setIsCheckingOut(true)}
            >
              Checkout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
