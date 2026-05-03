import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'featured' | 'new' | 'best-seller' | 'other';
  rating: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  products: Product[];
  reviews: Review[];
  cart: CartItem[];
  user: User | null;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  login: (user: User) => void;
  logout: () => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  orders: { id: string, userId: string, items: CartItem[], total: number, date: string, status: string }[];
  addOrder: (order: { userId: string, items: CartItem[], total: number }) => void;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Minimalist Leather Wallet', description: 'Crafted from full-grain leather, this minimalist wallet holds up to 8 cards and cash without the bulk.', price: 45.00, imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800', category: 'best-seller', rating: 4.8 },
  { id: '2', name: 'Ceramic Espresso Cup Set', description: 'A pair of handcrafted ceramic espresso cups. Matte finish on the outside, glazed inside.', price: 32.00, imageUrl: 'https://images.unsplash.com/photo-1610705663675-01bd9315bc32?auto=format&fit=crop&q=80&w=800', category: 'new', rating: 5.0 },
  { id: '3', name: 'Linen Throw Blanket', description: 'Lightweight, breathable 100% linen throw blanket. Perfect for cozy evenings.', price: 85.00, imageUrl: 'https://images.unsplash.com/photo-1580828369062-18d2bf411bed?auto=format&fit=crop&q=80&w=800', category: 'featured', rating: 4.9 },
  { id: '4', name: 'Soy Wax Scented Candle', description: 'Hand-poured soy wax candle with notes of cedar, sandalwood, and amber.', price: 24.00, imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800', category: 'best-seller', rating: 4.5 },
  { id: '5', name: 'Canvas Tote Bag', description: 'Heavyweight canvas tote bag with reinforced dual straps and an interior pocket.', price: 28.00, imageUrl: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&q=80&w=800', category: 'other', rating: 4.2 },
  { id: '6', name: 'Matte Black Water Bottle', description: 'Double-wall vacuum insulated stainless steel water bottle. Keeps drinks cold for 24 hours.', price: 35.00, imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800', category: 'new', rating: 4.7 },
  { id: '7', name: 'Signature Ocean Perfume', description: 'A refreshing aquatic perfume with top notes of bergamot and sea breeze.', price: 65.00, imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800', category: 'new', rating: 4.8 },
  { id: '8', name: 'Classic Leather Belt', description: 'Full-grain leather belt with a solid brass buckle. Designed to age beautifully.', price: 35.00, imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&q=80&w=800', category: 'other', rating: 4.6 },
  { id: '9', name: 'Slim Bifold Wallet', description: 'Premium leather wallet holding up to 10 cards.', price: 40.00, imageUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800', category: 'featured', rating: 4.9 },
  { id: '10', name: 'Midnight Wood Fragrance', description: 'A deep, woody scent featuring cedarwood, amber, and a hint of vanilla.', price: 75.00, imageUrl: 'https://images.unsplash.com/photo-1590514107775-6dc483a99187?auto=format&fit=crop&q=80&w=800', category: 'best-seller', rating: 4.7 }
];

const mockReviews: Review[] = [
  { id: 'r1', productId: '1', userId: 'u2', userName: 'Alex Johnson', rating: 5, comment: 'Seriously the best wallet I have ever owned. High quality leather.', date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'r2', productId: '3', userId: 'u3', userName: 'Maria Garcia', rating: 4, comment: 'Very soft, but slightly smaller than I expected.', date: new Date(Date.now() - 86400000 * 12).toISOString() },
];

const mockOrders = [
  { id: 'ORD-1234', userId: 'u1', items: [{ product: mockProducts[0], quantity: 1 }], total: 45.00, date: new Date(Date.now() - 86400000 * 15).toISOString(), status: 'Delivered' }
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      products: mockProducts,
      reviews: mockReviews,
      cart: [],
      user: null,
      orders: mockOrders,
      addOrder: (order) => set((state) => ({
        orders: [
          ...state.orders,
          {
            ...order,
            id: `ORD-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toISOString(),
            status: 'Processing'
          }
        ]
      })),
      addToCart: (product, quantity) => set((state) => {
        const existingItem = state.cart.find(item => item.product.id === product.id);
        if (existingItem) {
          return {
            cart: state.cart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          };
        }
        return { cart: [...state.cart, { product, quantity }] };
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.product.id !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      })),
      clearCart: () => set({ cart: [] }),
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      addReview: (review) => set((state) => ({
        reviews: [
          ...state.reviews,
          {
            ...review,
            id: Math.random().toString(36).substring(7),
            date: new Date().toISOString()
          }
        ]
      })),
    }),
    {
      name: 'ecommerce-storage',
    }
  )
);
