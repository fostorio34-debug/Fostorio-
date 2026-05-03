import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

import { emailService } from '../services/emailService';

export function Checkout() {
  const { cart, clearCart, user, addOrder } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'easypaisa'>('cod');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const newOrder = addOrder({ userId: user.id, items: [...cart], total });
      // Trigger confirmation email
      emailService.sendOrderConfirmation(newOrder, user.email);
    }
    setStep(3);
    clearCart();
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (step === 3) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Order Confirmed!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Thank you for your purchase. We've sent a confirmation email with your order details.</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to homepage...</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        {/* Form elements */}
        <div className="lg:col-span-7">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">Checkout</h1>
          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleCompleteOrder}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Shipping Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
                      <input type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-sm" />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">First Name</label>
                      <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-sm" />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Last Name</label>
                      <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-sm" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Address</label>
                      <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-sm" />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">City</label>
                      <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-sm" />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Postal Code</label>
                      <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-sm" />
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full py-3 px-4 bg-gray-900 text-white font-medium hover:bg-gray-800 rounded-sm">Continue to Payment</button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Payment Details</h2>
                    <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:text-white">Edit Shipping</button>
                  </div>
                  <div className="space-y-4 mb-6">
                    <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-sm cursor-pointer hover:bg-gray-50 dark:bg-gray-800">
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="form-radio text-gray-900 dark:text-white focus:ring-gray-900 h-4 w-4" />
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">Cash on Delivery</span>
                    </label>
                    <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-sm cursor-pointer hover:bg-gray-50 dark:bg-gray-800">
                      <input type="radio" name="payment" value="easypaisa" checked={paymentMethod === 'easypaisa'} onChange={() => setPaymentMethod('easypaisa')} className="form-radio text-gray-900 dark:text-white focus:ring-gray-900 h-4 w-4" />
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">Easypaisa</span>
                    </label>
                    <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-sm cursor-pointer hover:bg-gray-50 dark:bg-gray-800">
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="form-radio text-gray-900 dark:text-white focus:ring-gray-900 h-4 w-4" />
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">Credit Card</span>
                    </label>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Card Number</label>
                        <input type="text" required placeholder="0000 0000 0000 0000" className="w-full px-3 py-2 border border-gray-300 rounded-sm" />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Expiry Date</label>
                        <input type="text" required placeholder="MM/YY" className="w-full px-3 py-2 border border-gray-300 rounded-sm" />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">CVC</label>
                        <input type="text" required placeholder="123" className="w-full px-3 py-2 border border-gray-300 rounded-sm" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 rounded-sm border border-gray-200 dark:border-gray-700">
                      You will pay in cash to the courier when your order arrives.
                    </div>
                  )}

                  {paymentMethod === 'easypaisa' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-sm">
                      <p className="text-sm text-green-900 font-medium mb-2">Easypaisa Payment Instructions</p>
                      <p className="text-sm text-green-800 mb-4">Please transfer the total amount to the following Easypaisa account and provide the transaction ID below.</p>
                      <p className="text-lg font-bold text-green-900 mb-4 tracking-wider">03475430069</p>
                      <div>
                        <label className="block text-sm font-medium text-green-900 mb-1">Transaction ID / TID</label>
                        <input type="text" required className="w-full px-3 py-2 border border-green-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-white dark:bg-gray-900" placeholder="e.g. 1234567890" />
                      </div>
                    </div>
                  )}
                </div>
                <button type="submit" className="w-full py-3 px-4 bg-gray-900 text-white font-medium hover:bg-gray-800 rounded-sm">Complete Order</button>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Order Summary</h2>
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item.product.id} className="py-4 flex">
                  <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded overflow-hidden">
                    <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.product.name}</h3>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Rs. {(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Qty: {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-300">Subtotal</dt>
                <dd className="font-medium text-gray-900 dark:text-white">Rs. {subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-300">Shipping</dt>
                <dd className="font-medium text-gray-900 dark:text-white">{shipping === 0 ? 'Free' : `Rs. ${shipping.toFixed(2)}`}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4 text-base">
                <dt className="font-medium text-gray-900 dark:text-white">Total</dt>
                <dd className="font-medium text-gray-900 dark:text-white">Rs. {total.toFixed(2)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
