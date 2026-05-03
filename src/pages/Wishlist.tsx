import React from 'react';
import { useStore } from '../store';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Heart } from 'lucide-react';

export function Wishlist() {
  const { wishlist, products } = useStore();
  
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          Your Wishlist
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
        </p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="py-24 text-center bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800">
          <Heart className="w-16 h-16 mx-auto mb-6 text-gray-300" strokeWidth={1.5} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Explore our collection and save your favorite items by clicking the heart icon.
          </p>
          <Link 
            to="/products"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-[var(--color-primary-hover)] rounded-xl shadow-md transition-all active:scale-95"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
           {wishlistProducts.map(product => (
             <ProductCard key={product.id} product={product} />
           ))}
        </div>
      )}
    </motion.div>
  );
}
