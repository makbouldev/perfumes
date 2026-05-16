import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBox, FiList, FiLogOut, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { API_URL } from '../config';
import { resolveImageUrl } from '../utils/imageResolver';
import './Admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', notes: '', price: '' });
  const [selectedFile, setSelectedFile] = useState(null);
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
        const res = await fetch(`${API_URL}/api/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setOrders(await res.json());
      } else {
        const res = await fetch(`${API_URL}/api/products`);
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

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('notes', newProduct.notes);
    formData.append('price', newProduct.price);
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      setIsModalOpen(false);
      setNewProduct({ name: '', notes: '', price: '' });
      setSelectedFile(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    }
  };

  return (
    <div className="admin-dashboard fade-in">
      <div className="admin-sidebar glass">
        <div className="admin-logo">RYME <span>Admin</span></div>
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
              <button className="primary-btn sm" onClick={() => setIsModalOpen(true)}>
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
                      <td><img src={resolveImageUrl(product.imagePath)} alt="" className="admin-thumb" /></td>
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

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="modal-backdrop fade-in" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Fragrance</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleAddProductSubmit} className="admin-form">
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  value={newProduct.name} 
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Scent Notes</label>
                <input 
                  type="text" 
                  placeholder="e.g. Vanilla • Rose • Oud"
                  value={newProduct.notes} 
                  onChange={e => setNewProduct({...newProduct, notes: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  value={newProduct.price} 
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setSelectedFile(e.target.files[0])} 
                  required 
                />
              </div>
              <button type="submit" className="primary-btn w-100">Save Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
