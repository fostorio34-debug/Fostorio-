import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User as UserIcon, Search, Menu, X, Heart, Moon, Sun, Bell } from 'lucide-react';
import { useStore } from '../store';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

export function Navigation() {
  const { cart, user, wishlist, darkMode, toggleDarkMode, notifications, markNotificationAsRead } = useStore();
  const handleLogout = async () => {
    try {
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('../lib/firebase');
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };
  const location = useLocation();
  const navigate = useNavigate();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const userNotifications = notifications.filter(n => n.userId === user?.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const unreadCount = userNotifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4 sm:gap-8">
            <div className="flex items-center gap-4">
              <button 
                className="md:hidden text-gray-700 dark:text-gray-200 hover:text-[var(--color-primary)] transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link to="/" className="flex-shrink-0">
                <Logo />
              </Link>
            </div>
            
            {/* Desktop Navigation & Search */}
            <div className="hidden md:flex flex-1 items-center max-w-lg">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-full leading-5 bg-gray-50 dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] sm:text-sm transition-colors"
                  placeholder="Search products..."
                />
              </form>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <div className="hidden md:flex items-center gap-6">
                <Link to="/products" className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-[var(--color-primary)] transition-colors">Categories</Link>
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Admin</Link>
                    )}
                    <Link to="/profile" className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-[var(--color-primary)]">Profile</Link>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-gray-700 dark:text-gray-200 transition-colors">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1">
                    <UserIcon className="w-5 h-5" />
                    <span className="text-sm font-semibold">Login</span>
                  </Link>
                )}
              </div>

              <button aria-label="Toggle Dark Mode" onClick={toggleDarkMode} className="text-gray-700 dark:text-gray-200 hover:text-[var(--color-primary)] transition-colors">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user && (
                <div className="relative" ref={notificationsRef}>
                  <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative text-gray-700 dark:text-gray-200 p-2 -m-2 group hover:text-[var(--color-primary)] transition-colors">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[10px] font-bold text-white transform translate-x-1/4 -translate-y-1/4 bg-[var(--color-primary)] rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-4 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#1a1b1e]">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="text-xs text-[var(--color-primary)] font-medium">{unreadCount} new</span>
                          )}
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                          {userNotifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">No notifications</div>
                          ) : (
                            userNotifications.map(notification => (
                              <div
                                key={notification.id}
                                onClick={() => {
                                  markNotificationAsRead(notification.id);
                                  setIsNotificationsOpen(false);
                                  navigate('/profile');
                                }}
                                className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors ${notification.read ? 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50' : 'bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                              >
                                <p className={`text-sm ${notification.read ? 'text-gray-600 dark:text-gray-300' : 'text-gray-900 dark:text-white font-medium'}`}>{notification.message}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(notification.date).toLocaleString()}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <Link to="/cart" className="relative text-gray-700 dark:text-gray-200 p-2 -m-2 group hover:text-[var(--color-primary)] transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[10px] font-bold text-white transform translate-x-1/4 -translate-y-1/4 bg-[var(--color-primary)] rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <Link to="/wishlist" className="relative text-gray-700 dark:text-gray-200 p-2 -m-2 group hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[10px] font-bold text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 dark:border-gray-800 py-4 px-2 space-y-4 bg-white dark:bg-gray-900">
               <form onSubmit={handleSearch} className="relative w-full max-w-sm mx-auto mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-full leading-5 bg-gray-50 dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] text-sm transition-colors"
                    placeholder="Search products..."
                  />
                </form>
              <div className="flex flex-col space-y-4 items-center">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-[var(--color-primary)] transition-colors">Home</Link>
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-[var(--color-primary)] transition-colors">Categories</Link>
                <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-red-500 transition-colors flex items-center gap-2">
                  <Heart className="w-5 h-5" /> Wishlist
                </Link>
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-blue-600 hover:text-blue-700">Admin Dashboard</Link>
                    )}
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-[var(--color-primary)]">Profile</Link>
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:text-white transition-colors flex items-center gap-2">
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-200 hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1">
                    <UserIcon className="w-5 h-5" />
                    <span className="text-base font-semibold">Login</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
