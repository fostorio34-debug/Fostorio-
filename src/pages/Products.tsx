import { motion } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { ProductCard } from '../components/ProductCard';

export function Products() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const products = useStore((state) => state.products);
  
  const filteredProducts = categoryFilter 
    ? products.filter(p => p.category === categoryFilter)
    : products;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
          {categoryFilter === 'new' ? 'New Arrivals' : categoryFilter === 'best-seller' ? 'Best Sellers' : 'All Products'}
        </h1>
        <p className="text-gray-600 max-w-xl">
          Discover our collection of thoughtfully designed essentials, made for everyday life.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
         {filteredProducts.map(product => (
           <ProductCard key={product.id} product={product} />
         ))}
      </div>
    </motion.div>
  );
}
