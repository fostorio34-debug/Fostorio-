import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { ProductCard } from '../components/ProductCard';

export function Home() {
  const products = useStore((state) => state.products);
  const featuredProduct = products.find(p => p.category === 'featured') || products[0];
  const newArrivals = products.filter(p => p.category === 'new').slice(0, 4);
  const bestSellers = products.filter(p => p.category === 'best-seller').slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center bg-gray-50 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={featuredProduct.imageUrl}
            alt="Hero"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gray-900/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold tracking-tight text-white mb-6"
            >
              Essentials for modern living.
            </motion.h1>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to={`/product/${featuredProduct.id}`}
                className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 transition-colors"
              >
                Shop Featured
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">New Arrivals</h2>
          <Link to="/products?category=new" className="text-sm font-medium text-gray-600 hover:text-gray-900 underline underline-offset-4">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Best Sellers</h2>
          <Link to="/products?category=best-seller" className="text-sm font-medium text-gray-600 hover:text-gray-900 underline underline-offset-4">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </motion.div>
  );
}
