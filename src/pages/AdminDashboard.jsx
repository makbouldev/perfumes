import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBox, FiList, FiLogOut, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import './Admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [activeTab, token]);

  const fetchData = async () => {
    try {
      if (activeTab === 'orders') {
        const res = await fetch('http://localhost:5000/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setOrders(await res.json());
      } else {
        const res = await fetch('http://localhost:5000/api/products');
        if (res.ok) setProducts(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  const handleAddProduct = async () => {
    const name = prompt("Enter product name:");
    const notes = prompt("Enter product notes:");
    const price = parseFloat(prompt("Enter price:"));
    if (name && notes && price) {
      await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, notes, price, imagePath: 'perfume_1.png' })
      });
      fetchData();
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    }
  };

  return (
    <div className="admin-dashboard fade-in">
      <div className="admin-sidebar glass">
        <div className="admin-logo">L'Aura <span>Admin</span></div>
        <nav className="admin-nav">
          <button 
            className={activeTab === 'orders' ? 'active' : ''} 
            onClick={() => setActiveTab('orders')}
          >
            <FiList /> Orders
          </button>
          <button 
            className={activeTab === 'products' ? 'active' : ''} 
            onClick={() => setActiveTab('products')}
          >
            <FiBox /> Products
          </button>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>

      <div className="admin-main glass">
        {activeTab === 'orders' ? (
          <div className="admin-panel">
            <h2>Recent Orders</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan="8" className="text-center">No orders found.</td></tr>
                  ) : orders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>{order.customerEmail}</td>
                      <td>{order.phone}</td>
                      <td>{order.address}</td>
                      <td>${order.totalAmount}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td><span className="status-badge">{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="admin-panel">
            <div className="panel-header">
              <h2>Product Catalog</h2>
              <button className="primary-btn sm" onClick={handleAddProduct}>
                <FiPlus /> Add Product
              </button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Notes</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td><img src={`/src/assets/${product.imagePath}`} alt="" className="admin-thumb" /></td>
                      <td>{product.name}</td>
                      <td>{product.notes}</td>
                      <td>${product.price}</td>
                      <td>
                        <button className="action-btn delete" onClick={() => handleDeleteProduct(product.id)}>
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
