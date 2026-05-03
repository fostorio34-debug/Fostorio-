import { useState } from 'react';
import { useStore } from '../store';
import { motion } from 'motion/react';
import { Navigate } from 'react-router-dom';
import { Package, Settings, Shield, Bell, Key, Smartphone } from 'lucide-react';
import { OrderTracking } from '../components/OrderTracking';

export function Profile() {
  const { user, orders } = useStore();
  const handleLogout = async () => {
    try {
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('../lib/firebase');
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };
  const [activeTab, setActiveTab] = useState<'orders' | 'settings' | 'security'>('orders');
  const [theme, setTheme] = useState<'white' | 'black' | 'skin'>('white');
  const [notifications, setNotifications] = useState({ email: true, sms: false, promos: true });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userOrders = orders.filter(o => o.userId === user.id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-4 py-12 lg:py-24">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl font-semibold mb-4">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{user.email}</p>
            <button onClick={handleLogout} className="text-xs font-medium text-gray-900 dark:text-white border border-gray-900 px-4 py-2 rounded-sm hover:bg-gray-900 hover:text-white transition-colors w-full">
              Sign Out
            </button>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-colors ${
                activeTab === 'orders' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-800 hover:text-gray-900 dark:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-colors ${
                activeTab === 'settings' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-800 hover:text-gray-900 dark:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-colors ${
                activeTab === 'security' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-800 hover:text-gray-900 dark:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              Security
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order History</h2>
              
              <div className="space-y-4">
                {userOrders.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No orders found.</p>
                  </div>
                ) : (
                  userOrders.map(order => (
                    <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{order.id}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Placed on {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Items: {order.items.map(i => i.product.name).join(', ')}</p>
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4 flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Total Amount</span>
                        <span className="font-medium text-gray-900 dark:text-white">Rs. {order.total.toFixed(2)}</span>
                      </div>
                      <OrderTracking currentStatus={order.status} />
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">App Settings</h2>

              <section>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" /> Theme Preference
                </h3>
                <div className="grid grid-cols-3 gap-4 max-w-lg">
                  <button
                    onClick={() => setTheme('white')}
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${theme === 'white' ? 'border-gray-900' : 'border-gray-200 dark:border-gray-700'}`}
                  >
                    <div className="w-full h-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded mb-2"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">White</span>
                  </button>
                  <button
                    onClick={() => setTheme('black')}
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${theme === 'black' ? 'border-gray-900' : 'border-gray-200 dark:border-gray-700'}`}
                  >
                    <div className="w-full h-12 bg-gray-900 rounded mb-2"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Black</span>
                  </button>
                  <button
                    onClick={() => setTheme('skin')}
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${theme === 'skin' ? 'border-gray-900' : 'border-gray-200 dark:border-gray-700'}`}
                  >
                    <div className="w-full h-12 bg-[#FEE4D2] rounded mb-2"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Skin</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">* Note: Theme preview is simulated for this demo.</p>
              </section>

              <section>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" /> Notifications
                </h3>
                <div className="space-y-4 max-w-lg">
                  <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:bg-gray-800">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Email Updates</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receive order status via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                      className="form-checkbox h-5 w-5 text-gray-900 dark:text-white rounded focus:ring-gray-900"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:bg-gray-800">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">SMS Alerts</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receive delivery updates via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.sms}
                      onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                      className="form-checkbox h-5 w-5 text-gray-900 dark:text-white rounded focus:ring-gray-900"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:bg-gray-800">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Promotions</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receive special offers and discounts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.promos}
                      onChange={(e) => setNotifications({ ...notifications, promos: e.target.checked })}
                      className="form-checkbox h-5 w-5 text-gray-900 dark:text-white rounded focus:ring-gray-900"
                    />
                  </label>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h2>

              <section>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-gray-500 dark:text-gray-400" /> Change Password
                </h3>
                <form className="max-w-md space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900 outline-none" />
                  </div>
                  <button className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition-colors">
                    Update Password
                  </button>
                </form>
              </section>

              <section className="pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-gray-500 dark:text-gray-400" /> Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Add an extra layer of security</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Require a verification code when signing in from a new device.</p>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium rounded-sm hover:bg-gray-50 dark:bg-gray-800 transition-colors">
                    Enable
                  </button>
                </div>
              </section>

              <section className="pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-red-600 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Danger Zone
                </h3>
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg max-w-xl">
                  <p className="text-sm text-red-800 font-medium mb-1">Delete Account</p>
                  <p className="text-xs text-red-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-sm hover:bg-red-700 transition-colors">
                    Delete Account
                  </button>
                </div>
              </section>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
