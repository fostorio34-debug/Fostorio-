import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Plus, Minus, ShoppingCart, Heart, Check, Image as ImageIcon, Video as VideoIcon, X, Play, FileVideo } from 'lucide-react';
import { useStore } from '../store';
import { formatDistanceToNow } from 'date-fns';

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [reviewVideos, setReviewVideos] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const { products, reviews, addToCart, user, addReview, orders, wishlist, toggleWishlist } = useStore();
  const product = products.find(p => p.id === id);
  const productReviews = reviews.filter(r => r.productId === id);
  
  const isWishlisted = product ? wishlist.includes(product.id) : false;
  
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
    if (isAdding) return;
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => setIsAdding(false), 1200);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReviewImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: any) => {
        // For videos we use Blob URLs generally, but since we persist to store 
        // and store is in localStorage, we should be careful with size.
        // For this demo, we'll use base64 for images and blob URLs for videos (won't persist across refresh if they exceed memory)
        const url = URL.createObjectURL(file as any);
        setReviewVideos(prev => [...prev, url]);
      });
    }
  };

  const removeImage = (index: number) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setReviewVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addReview({
      productId: product.id,
      userId: user.id,
      userName: user.name,
      rating: reviewRating,
      comment: reviewText,
      images: reviewImages,
      videos: reviewVideos
    });
    setReviewText('');
    setReviewRating(5);
    setReviewImages([]);
    setReviewVideos([]);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery full width on mobile */}
          <div className="relative aspect-square lg:aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm">
            {!isImageLoaded && (
              <div 
                className="absolute inset-0 bg-gradient-to-r from-gray-100 dark:from-gray-800 via-gray-200 dark:via-gray-700 to-gray-100 dark:to-gray-800 animate-pulse" 
                style={{ backgroundSize: '200% 100%' }} 
              />
            )}
            <img
              src={product.imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover object-center transition-all duration-700 ${isImageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
              onLoad={() => setIsImageLoaded(true)}
            />
            {product.discount && (
              <span className="absolute top-4 left-4 bg-[var(--color-primary)] text-white px-3 py-1 text-sm font-bold rounded-full shadow-md z-10 tracking-wide">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">{product.name}</h1>
            
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
              <div className="flex items-center text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-gray-900 dark:text-white ml-1.5 font-bold">{averageRating.toFixed(1)}</span>
              </div>
              <span className="mx-2 text-gray-300">|</span>
              <button onClick={() => setActiveTab('reviews')} className="hover:text-[var(--color-primary)] underline underline-offset-4 decoration-gray-200 transition-colors">
                {productReviews.length} Reviews
              </button>
              <span className="mx-2 text-gray-300">|</span>
              <span className="font-medium text-gray-600 dark:text-gray-300">{product.soldCount} Sold</span>
            </div>

            <div className="flex items-end gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              <span className="text-3xl font-bold text-[var(--color-primary)]">Rs. {product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through mb-1">Rs. {product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">Description</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full mt-1.5 mr-3 shrink-0 transition-transform hover:scale-150 duration-300"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-8 border-t border-gray-100 dark:border-gray-800 pt-6">
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Quantity</span>
                <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-full p-1 border border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[var(--color-primary)] transition-colors active:scale-90"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[var(--color-primary)] transition-colors active:scale-90"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-4 sm:flex-1">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`flex-1 py-4 px-8 border-2 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                    isAdding 
                      ? 'bg-green-50 border-green-500 text-green-600' 
                      : 'bg-white dark:bg-gray-900 text-[var(--color-primary)] border-[var(--color-primary)] hover:bg-[#1e2a4a]/5 dark:hover:bg-[#1e2a4a]/20 active:scale-95'
                  }`}
                >
                  {isAdding ? (
                    <>
                       <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                         <Check className="w-5 h-5" />
                       </motion.div>
                       Added!
                    </>
                  ) : (
                    <>
                       <ShoppingCart className="w-5 h-5" /> Add to Cart
                    </>
                  )}
                </button>
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className="w-[56px] h-[56px] flex-shrink-0 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-500 hover:bg-red-50 transition-colors bg-white dark:bg-gray-900 group active:scale-95"
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-6 h-6 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-500'}`} />
                </button>
              </div>
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  navigate('/checkout');
                }}
                className="flex-1 sm:flex-1 py-4 px-8 bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-[var(--color-primary-hover)] shadow-md hover:shadow-lg transition-all rounded-xl active:scale-95"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 sm:mt-24 pt-8 sm:pt-12 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-8 mb-8 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 text-sm sm:text-base font-bold transition-colors relative ${activeTab === 'details' ? 'text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-900 dark:text-white'}`}
            >
              More Details
              {activeTab === 'details' && <div className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-[var(--color-primary)]" />}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm sm:text-base font-bold transition-colors relative ${activeTab === 'reviews' ? 'text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-900 dark:text-white'}`}
            >
              Reviews ({productReviews.length})
              {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-[var(--color-primary)]" />}
            </button>
          </div>

          {activeTab === 'details' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-gray-600 dark:text-gray-300 max-w-3xl text-sm sm:text-base leading-relaxed">
              <p className="mb-4">Designed with intention and crafted to last. Our products use only premium materials sourced responsibly.</p>
              <p>We believe in objects that acquire history, character, and sentiment. This item is designed to become more beautiful with age.</p>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              {/* Add Review Form */}
              <div className="mb-12 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Write a Review</h3>
                {!user ? (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Please <Link to="/login" className="font-bold text-[var(--color-primary)] hover:underline">log in</Link> to leave a review.
                  </p>
                ) : !hasPurchased ? (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    You must purchase this item to leave a review.
                  </p>
                ) : (
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-5">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="text-gray-300 hover:text-yellow-400 focus:outline-none transition-colors"
                          >
                            <Star className={`w-8 h-8 ${star <= reviewRating ? 'fill-current text-yellow-400' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-5">
                      <label htmlFor="review" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Review</label>
                      <textarea
                        id="review"
                        rows={4}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="What did you like or dislike? Share your unboxing experience!"
                        required
                      ></textarea>
                    </div>

                    {/* Media Uploads */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">Add Photos or Videos</label>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-[var(--color-primary)] hover:bg-[#c49a5c]/5 dark:hover:bg-[#c49a5c]/10 transition-all group"
                        >
                          <div className="text-center">
                            <ImageIcon className="w-6 h-6 mx-auto text-gray-400 group-hover:text-[var(--color-primary)]" />
                            <span className="text-[10px] font-bold text-gray-400 group-hover:text-[var(--color-primary)] mt-1 block">Photos</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
                          className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-[var(--color-primary)] hover:bg-[#c49a5c]/5 dark:hover:bg-[#c49a5c]/10 transition-all group"
                        >
                          <div className="text-center">
                            <VideoIcon className="w-6 h-6 mx-auto text-gray-400 group-hover:text-[var(--color-primary)]" />
                            <span className="text-[10px] font-bold text-gray-400 group-hover:text-[var(--color-primary)] mt-1 block">Video</span>
                          </div>
                        </button>

                        {/* Previews */}
                        {reviewImages.map((img, idx) => (
                          <div key={`img-${idx}`} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                            <img src={img} alt="preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {reviewVideos.map((vid, idx) => (
                          <div key={`vid-${idx}`} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group bg-black">
                            <video src={vid} className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <Play className="w-6 h-6 text-white fill-current" />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeVideo(idx)}
                              className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                        multiple
                      />
                      <input
                        type="file"
                        ref={videoInputRef}
                        onChange={handleVideoUpload}
                        className="hidden"
                        accept="video/*"
                        multiple
                      />
                    </div>

                    <p className="text-xs text-gray-400 mb-5">* Verified purchase required to submit a review.</p>
                    <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-[var(--color-primary-hover)] rounded-xl shadow-md transition-all active:scale-95">
                      Submit Review
                    </button>
                  </form>
                )}
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {productReviews.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No reviews yet.</p>
                    <p className="text-sm text-gray-400">Be the first to review this product!</p>
                  </div>
                ) : (
                  productReviews.map(review => (
                    <div key={review.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{review.userName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-current text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} />
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium tracking-wide">• {formatDistanceToNow(new Date(review.date), { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed mb-4">{review.comment}</p>
                      
                      {/* Review Media */}
                      {(review.images?.length || 0) + (review.videos?.length || 0) > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {review.images?.map((img, idx) => (
                            <button key={idx} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 hover:opacity-90 transition-opacity">
                              <img src={img} alt="review" className="w-full h-full object-cover" />
                            </button>
                          ))}
                          {review.videos?.map((vid, idx) => (
                            <button key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden bg-black border border-gray-100 dark:border-gray-800 hover:opacity-90 transition-opacity flex items-center justify-center">
                              <video src={vid} className="w-full h-full object-cover opacity-60" />
                              <Play className="absolute w-6 h-6 text-white fill-current" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
