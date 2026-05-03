import React, { useState } from 'react';
import { useStore, Product } from '../store';
import { motion } from 'motion/react';
import { Navigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, CalendarDays, CalendarCheck, TrendingUp, PackageSearch, Users } from 'lucide-react';
import { emailService } from '../services/emailService';

export function AdminDashboard() {
  const { user, products, orders, users, updateOrderStatus, addProduct, updateProduct, deleteProduct, updateUserRole } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({ name: '', description: '', price: 0, imageUrl: '', category: 'other' });

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const ordersLast30Days = orders.filter(o => new Date(o.date) >= thirtyDaysAgo);
  const ordersLast7Days = orders.filter(o => new Date(o.date) >= sevenDaysAgo);
  
  const revenueLast30Days = ordersLast30Days.reduce((sum, o) => sum + o.total, 0);
  const revenueLast7Days = ordersLast7Days.reduce((sum, o) => sum + o.total, 0);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
    } else {
      addProduct(productForm as Omit<Product, 'id'>);
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: 0, imageUrl: '', category: 'other' });
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your store products, orders, and users.</p>
        </div>
        {activeTab === 'products' && (
          <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: 0, imageUrl: '', category: 'other' }); setIsProductModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-sm hover:bg-[var(--color-primary-hover)] text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        )}
      </div>

      <div className="flex gap-6 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-4 text-sm font-medium relative whitespace-nowrap ${activeTab === 'overview' ? 'text-[var(--color-primary)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white'}`}
        >
          Overview
          {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]" />}
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-4 text-sm font-medium relative whitespace-nowrap ${activeTab === 'products' ? 'text-[var(--color-primary)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white'}`}
        >
          Products
          {activeTab === 'products' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]" />}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 text-sm font-medium relative whitespace-nowrap ${activeTab === 'orders' ? 'text-[var(--color-primary)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white'}`}
        >
          Orders
          {activeTab === 'orders' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]" />}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-4 text-sm font-medium relative whitespace-nowrap ${activeTab === 'users' ? 'text-[var(--color-primary)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white'}`}
        >
          Users
          {activeTab === 'users' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]" />}
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-[#1e2a4a]/5 text-[#1e2a4a] dark:text-[#c49a5c] rounded-lg">
                   <CalendarCheck className="w-5 h-5" />
                 </div>
                 <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Last 7 Days Orders</span>
               </div>
               <span className="text-3xl font-bold text-gray-900 dark:text-white">{ordersLast7Days.length}</span>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                   <TrendingUp className="w-5 h-5" />
                 </div>
                 <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Last 7 Days Revenue</span>
               </div>
               <span className="text-3xl font-bold text-gray-900 dark:text-white">Rs. {revenueLast7Days.toFixed(2)}</span>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                   <CalendarDays className="w-5 h-5" />
                 </div>
                 <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Last 30 Days Orders</span>
               </div>
               <span className="text-3xl font-bold text-gray-900 dark:text-white">{ordersLast30Days.length}</span>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                   <PackageSearch className="w-5 h-5" />
                 </div>
                 <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Last 30 Days Revenue</span>
               </div>
               <span className="text-3xl font-bold text-gray-900 dark:text-white">Rs. {revenueLast30Days.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white dark:bg-gray-900 border text-left border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                        <img className="h-10 w-10 object-cover" src={product.imageUrl} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    Rs. {product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEditModal(product)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-gray-900 border text-left border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    User {order.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    Rs. {order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        updateOrderStatus(order.id, newStatus);
                        
                        // Find user email to send update notification
                        const customer = users.find(u => u.id === order.userId);
                        if (customer) {
                          emailService.sendStatusUpdate(order, customer.email, newStatus);
                        }
                      }}
                      className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-sm text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-900 border text-left border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {u.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {u.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={u.role}
                      onChange={(e) => updateUserRole(u.id, e.target.value as 'admin' | 'customer')}
                      disabled={u.email === 'fostorio34@gmail.com'}
                      className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-sm text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 disabled:opacity-50"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input required type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea required rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                  <input required type="number" step="0.01" min="0" value={productForm.price || ''} onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Original Price</label>
                  <input type="number" step="0.01" min="0" value={productForm.originalPrice || ''} onChange={e => setProductForm({...productForm, originalPrice: parseFloat(e.target.value) || undefined})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                <input required type="url" value={productForm.imageUrl} onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value as Product['category']})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="featured">Featured</option>
                  <option value="new">New</option>
                  <option value="best-seller">Best Seller</option>
                  <option value="perfumes">Perfumes</option>
                  <option value="belts">Belts</option>
                  <option value="wallets">Wallets</option>
                  <option value="fragrances">Fragrances</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-sm hover:bg-[var(--color-primary-hover)]">Save Product</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
