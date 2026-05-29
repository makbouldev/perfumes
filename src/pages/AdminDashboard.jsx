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
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to WebP or JPEG with 0.7 quality to guarantee small size
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          await submitProduct(compressedBase64);
        };
        img.onerror = () => {
          submitProduct('');
        };
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        submitProduct('');
      };
    } else {
      await submitProduct('');
    }
  };

  const submitProduct = async (base64Image) => {
    try {
      await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newProduct.name,
          notes: newProduct.notes,
          price: newProduct.price,
          imagePath: base64Image
        })
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

  const handleDeleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await fetch(`${API_URL}/api/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`${API_URL}/api/orders/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchData();
    } catch (err) {
      console.error(err);
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
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan="7" className="text-center">No orders found.</td></tr>
                  ) : orders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customerName || order.customername}</td>
                      <td>{order.phone}</td>
                      <td>{order.address}</td>
                      <td>{order.items}</td>
                      <td>{order.totalAmount || order.totalamount} DH</td>
                      <td>{new Date(order.createdAt || order.createdat).toLocaleDateString()}</td>
                      <td>
                        <select 
                          className="status-select"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="Pending">En attente</option>
                          <option value="Confirmed">Confirmé</option>
                          <option value="Cancelled">Annulé</option>
                        </select>
                      </td>
                      <td>
                        <button className="action-btn delete" onClick={() => handleDeleteOrder(order.id)}>
                          <FiTrash2 />
                        </button>
                      </td>
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
                      <td><img src={resolveImageUrl(product.imagePath || product.imagepath)} alt="" className="admin-thumb" /></td>
                      <td>{product.name}</td>
                      <td>{product.notes}</td>
                      <td>{product.price} DH</td>
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
                <label>Price (DH)</label>
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
