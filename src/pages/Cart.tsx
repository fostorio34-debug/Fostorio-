import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useStore } from '../store';

export function Cart() {
  const { cart, removeFromCart, updateQuantity } = useStore();

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-sm">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24"
    >
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-12">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        <div className="lg:col-span-8">
          <ul className="divide-y divide-gray-200 border-t border-gray-200">
            {cart.map((item) => (
              <li key={item.product.id} className="py-6 flex">
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover object-center" />
                </div>
                <div className="ml-4 flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3><Link to={`/product/${item.product.id}`}>{item.product.name}</Link></h3>
                      <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center border border-gray-200 rounded">
                      <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="p-1.5 text-gray-400 hover:text-gray-900">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 text-gray-400 hover:text-gray-900">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Order summary</h2>
            <div className="flow-root">
              <dl className="-my-4 text-sm divide-y divide-gray-200">
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Shipping</dt>
                  <dd className="font-medium text-gray-900">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</dd>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">Total</dt>
                  <dd className="text-base font-medium text-gray-900">${total.toFixed(2)}</dd>
                </div>
              </dl>
            </div>
            <div className="mt-8">
              <Link
                to="/checkout"
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-sm shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-gray-800"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
