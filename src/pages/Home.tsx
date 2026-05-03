import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { ProductCard } from '../components/ProductCard';
import { Clock, Droplet, Move3d, Wallet, Zap } from 'lucide-react';

export function Home() {
  const products = useStore((state) => state.products);
  
  // Custom categories for icons
  const categories = [
    { name: 'Perfumes', icon: <Droplet className="w-6 h-6 text-[var(--color-primary)]" />, query: 'perfumes' },
    { name: 'Belts', icon: <Move3d className="w-6 h-6 text-[var(--color-primary)]" />, query: 'belts' },
    { name: 'Wallets', icon: <Wallet className="w-6 h-6 text-[var(--color-primary)]" />, query: 'wallets' },
    { name: 'Fragrances', icon: <Zap className="w-6 h-6 text-[var(--color-primary)]" />, query: 'fragrances' },
  ];

  // Flash Sale Timer Logic
  const [timeLeft, setTimeLeft] = useState(3600 * 5 + 1800); // 5h 30m
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const flashSaleProducts = useMemo(() => products.filter(p => p.discount), [products]);
  const justForYou = useMemo(() => products.slice().sort(() => Math.random() - 0.5).slice(0, 8), [products]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-8"
    >
      {/* Banner */}
      <section className="mt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="w-full rounded-2xl overflow-hidden relative aspect-[21/9] sm:aspect-[21/6] bg-gray-900 shadow-md">
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000" alt="Sale" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 pointer-events-none">
            <span className="text-[var(--color-primary)] font-bold text-sm sm:text-base tracking-wider uppercase mb-1 sm:mb-2 drop-shadow-md">Huge Sale</span>
            <h2 className="text-white text-2xl sm:text-4xl lg:text-5xl font-bold max-w-md leading-tight drop-shadow-lg">Up to 50% Off Everything</h2>
          </div>
        </div>
      </section>

      {/* Category Icons */}
      <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8">
          {categories.map((cat) => (
            <Link key={cat.name} to={`/products?category=${cat.query}`} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white dark:bg-gray-900 rounded-full shadow-sm flex items-center justify-center group-hover:shadow-md transition-all duration-300">
                {cat.icon}
              </div>
              <span className="text-[10px] sm:text-sm font-medium text-gray-700 dark:text-gray-200">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                Flash Sale
              </h2>
              <div className="flex items-center gap-1.5 bg-[var(--color-primary)] text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <Link to="/products?discount=true" className="text-xs sm:text-sm font-bold text-[var(--color-primary)]">
              SHOP MORE &gt;
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {flashSaleProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Just For You */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
          Just For You
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {justForYou.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </motion.div>
  );
}
