import React from 'react';
import { motion } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { ProductCard } from '../components/ProductCard';

export function Products() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const discountFilter = searchParams.get('discount');
  const searchQuery = searchParams.get('q');
  
  const products = useStore((state) => state.products);
  
  let filteredProducts = products;
  let title = 'All Products';

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredProducts = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    title = `Search results for "${searchQuery}"`;
  } else if (categoryFilter) {
    filteredProducts = products.filter(p => p.category === categoryFilter);
    title = categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1).replace('-', ' ');
  } else if (discountFilter === 'true') {
    filteredProducts = products.filter(p => p.discount);
    title = 'Flash Sale';
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl">
          Discover our collection of thoughtfully designed essentials, made for everyday life.
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-gray-500 dark:text-gray-400">No products found for this section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
           {filteredProducts.map(product => (
             <ProductCard key={product.id} product={product} />
           ))}
        </div>
      )}
    </motion.div>
  );
}
