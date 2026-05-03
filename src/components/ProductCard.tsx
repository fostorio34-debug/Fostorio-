import { Link } from 'react-router-dom';
import { Product } from '../store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group cursor-pointer">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden bg-gray-100 rounded-lg mb-4 relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="object-cover w-full h-full object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {product.category === 'new' && (
            <span className="absolute top-4 left-4 bg-white px-2 py-1 text-xs font-semibold tracking-wider uppercase rounded-sm">New</span>
          )}
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-gray-500">★ {product.rating.toFixed(1)}</span>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</span>
        </div>
      </Link>
    </div>
  );
}
