import { useStore } from '../store';
import { motion } from 'motion/react';
import { Navigate } from 'react-router-dom';

export function Profile() {
  const { user, logout, orders } = useStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userOrders = orders.filter(o => o.userId === user.id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-4 py-12 lg:py-24">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-2xl font-semibold mb-4">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600 mb-6">{user.email}</p>
            <button onClick={logout} className="text-sm font-medium text-gray-900 border border-gray-900 px-4 py-2 rounded-sm hover:bg-gray-900 hover:text-white transition-colors">
              Sign Out
            </button>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
          
          <div className="space-y-4">
            {userOrders.length === 0 ? (
              <p className="text-gray-500 text-sm">No orders found.</p>
            ) : (
              userOrders.map(order => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.id}</h3>
                      <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Items: {order.items.map(i => i.product.name).join(', ')}</p>
                  </div>
                  <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-medium text-gray-900">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
