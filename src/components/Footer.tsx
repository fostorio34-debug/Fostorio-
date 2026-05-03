import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              We design and curate minimal everyday essentials. Designed to last and crafted with care.
            </p>
            <form className="flex gap-2 max-w-sm" onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing!');}}>
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                className="flex-1 min-w-0 px-0 py-2 border-0 border-b border-gray-300 dark:border-gray-600 bg-transparent text-sm text-gray-900 dark:text-white focus:ring-0 focus:border-gray-900 dark:focus:border-white transition-colors"
              />
              <button 
                type="submit"
                className="px-4 py-2 text-sm font-semibold tracking-wide text-gray-900 dark:text-white hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary)] transition-colors border-b border-transparent hover:border-[var(--color-primary)] pb-1"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">All Products</Link></li>
              <li><Link to="/products?category=new" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/products?category=best-seller" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">Best Sellers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">Contact</Link></li>
              <li><Link to="/shipping" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Crafted. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-gray-900 dark:text-white"><span className="sr-only">Instagram</span> INSTAGRAM</a>
            <a href="#" className="text-gray-400 hover:text-gray-900 dark:text-white"><span className="sr-only">Twitter</span> TWITTER</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
