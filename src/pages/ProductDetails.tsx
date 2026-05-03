import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Plus, Minus } from 'lucide-react';
import { useStore } from '../store';
import { formatDistanceToNow } from 'date-fns';

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const { products, reviews, addToCart, user, addReview, orders } = useStore();
  const product = products.find(p => p.id === id);
  const productReviews = reviews.filter(r => r.productId === id);
  
  const averageRating = productReviews.length > 0 
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length 
    : (product ? product.rating : 0);

  const hasPurchased = user && orders.some(order => 
    order.userId === user.id && order.items.some(item => item.product.id === id)
  );

  if (!product) {
    return <div className="py-24 text-center">Product not found.</div>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // Should show login prompt

    addReview({
      productId: product.id,
      userId: user.id,
      userName: user.name,
      rating: reviewRating,
      comment: reviewText,
    });
    setReviewText('');
    setReviewRating(5);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Image Gallery */}
        <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-medium text-gray-900">${product.price.toFixed(2)}</span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Star className="w-4 h-4 fill-current text-yellow-400" />
              <span>{averageRating.toFixed(1)}</span>
              <span className="mx-2">·</span>
              <button onClick={() => setActiveTab('reviews')} className="hover:text-gray-900 underline underline-offset-4">
                {productReviews.length} reviews
              </button>
            </div>
          </div>

          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-8 border-t border-b border-gray-100 py-6">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-gray-900">Quantity</span>
              <div className="flex items-center border border-gray-200 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-4 px-8 bg-white text-gray-900 border border-gray-900 text-sm font-medium hover:bg-gray-50 transition-colors rounded-sm"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                handleAddToCart();
                navigate('/checkout');
              }}
              className="flex-1 py-4 px-8 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors rounded-sm"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-24 pt-12 border-t border-gray-200">
        <div className="flex gap-8 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'details' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Details
            {activeTab === 'details' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'reviews' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Reviews ({productReviews.length})
            {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />}
          </button>
        </div>

        {activeTab === 'details' && (
          <div className="prose prose-sm text-gray-600 max-w-none">
            <p>Designed with intention and crafted to last. Our products use only premium materials sourced responsibly.</p>
            <ul>
              <li>Premium quality</li>
              <li>Minimalist design</li>
              <li>Durable construction</li>
            </ul>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-2xl">
            {/* Add Review Form */}
            <div className="mb-12 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
              {!user ? (
                <p className="text-sm text-gray-600">
                  Please <Link to="/login" className="font-medium text-gray-900 underline">log in</Link> to leave a review.
                </p>
              ) : !hasPurchased ? (
                <p className="text-sm text-gray-600">
                  You must purchase this item to leave a review.
                </p>
              ) : (
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="text-gray-400 hover:text-yellow-400 focus:outline-none"
                        >
                          <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-current text-yellow-400' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                    <textarea
                      id="review"
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                      required
                    ></textarea>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">* Verified purchase required.</p>
                  <button type="submit" className="px-6 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 rounded-sm">
                    Submit Review
                  </button>
                </form>
              )}
            </div>

            {/* Review List */}
            <div className="space-y-8">
              {productReviews.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product!</p>
              ) : (
                productReviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current text-yellow-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{review.userName}</span>
                      <span className="text-xs text-gray-500">• {formatDistanceToNow(new Date(review.date), { addSuffix: true })}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
