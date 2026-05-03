import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut, User as UserIcon } from 'lucide-react';
import { useStore } from '../store';

export function Navigation() {
  const { cart, user, logout } = useStore();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-semibold tracking-tight text-gray-900">
              CRAFTED<span className="text-gray-400">.</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Shop All</Link>
              <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">About</Link>
              <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-700">Admin</Link>
                  )}
                  <Link to="/profile" className="text-sm font-medium text-gray-600 hover:text-gray-900">Profile</Link>
                  <button onClick={logout} className="text-gray-400 hover:text-gray-600">
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-gray-400 hover:text-gray-600">
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}
            </div>

            <Link to="/cart" className="relative text-gray-900 p-2 -m-2 group">
              <ShoppingCart className="w-5 h-5 group-hover:text-gray-600 transition-colors" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-gray-900 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
