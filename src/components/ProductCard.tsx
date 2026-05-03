import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, useStore } from '../store';
import { motion } from 'motion/react';
import { Star, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  key?: React.Key;
}

export function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <motion.div whileTap={{ scale: 0.98 }} className="group bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-800 relative">
      <Link to={`/product/${product.id}`} className="block flex-1 flex flex-col">
        {/* Responsive Image Aspect Ratio - Made taller to be more dominant */}
        <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          {!isImageLoaded && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-gray-100 dark:from-gray-800 via-gray-200 dark:via-gray-700 to-gray-100 dark:to-gray-800 animate-pulse" 
              style={{ backgroundSize: '200% 100%' }} 
            />
          )}
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`object-cover w-full h-full object-center group-hover:scale-105 transition-all duration-700 ease-out ${isImageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
            loading="lazy"
            onLoad={() => setIsImageLoaded(true)}
          />
          {product.discount && (
            <span className="absolute top-3 left-3 bg-[var(--color-primary)] text-white px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-full shadow-sm z-10">
              -{product.discount}%
            </span>
          )}
          <button 
            onClick={handleWishlistClick} 
            className="absolute top-3 right-3 p-1.5 sm:p-2 bg-white dark:bg-gray-900 rounded-full shadow-sm z-10 hover:scale-110 active:scale-95 transition-transform"
            aria-label="Toggle wishlist"
          >
             <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
          </button>
        </div>
        <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug mb-1.5 sm:mb-2">{product.name}</h3>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
               <div className="flex items-center text-yellow-400 text-xs sm:text-sm">
                 <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                 <span className="text-gray-700 dark:text-gray-200 ml-1 font-semibold">{product.rating.toFixed(1)}</span>
               </div>
               <span className="text-gray-300 text-xs sm:text-sm">•</span>
               <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">{product.soldCount} sold</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-auto flex-wrap">
            <span className="text-lg sm:text-xl font-bold text-[var(--color-primary)]">Rs. {product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">Rs. {product.originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
