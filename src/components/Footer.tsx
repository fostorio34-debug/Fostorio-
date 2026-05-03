import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="text-xl font-semibold tracking-tight text-gray-900 inline-block mb-4">
              CRAFTED<span className="text-gray-400">.</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-sm">
              We design and curate minimal everyday essentials. Designed to last and crafted with care.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">All Products</Link></li>
              <li><Link to="/products?category=new" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">New Arrivals</Link></li>
              <li><Link to="/products?category=best-seller" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Best Sellers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</Link></li>
              <li><Link to="/shipping" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Crafted. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-gray-900"><span className="sr-only">Instagram</span> INSTAGRAM</a>
            <a href="#" className="text-gray-400 hover:text-gray-900"><span className="sr-only">Twitter</span> TWITTER</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
