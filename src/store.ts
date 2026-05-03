import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  category: 'featured' | 'new' | 'best-seller' | 'other' | 'perfumes' | 'belts' | 'wallets' | 'fragrances';
  rating: number;
  soldCount: number;
  features: string[];
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  images?: string[];
  videos?: string[];
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

export interface Notification {
  id: string;
  userId: string;
  message: string;
  date: string;
  read: boolean;
}

interface StoreState {
  products: Product[];
  reviews: Review[];
  cart: CartItem[];
  user: User | null;
  notifications: Notification[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  login: (user: User) => void;
  logout: () => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  orders: { id: string, userId: string, items: CartItem[], total: number, date: string, status: string }[];
  addOrder: (order: { userId: string, items: CartItem[], total: number }) => { id: string, userId: string, items: CartItem[], total: number, date: string, status: string };
  updateOrderStatus: (orderId: string, status: string) => void;
  markNotificationAsRead: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  users: User[];
  updateUserRole: (id: string, role: 'customer' | 'admin') => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Minimalist Leather Wallet', description: 'Crafted from full-grain leather, this minimalist wallet holds up to 8 cards and cash without the bulk.', price: 45.00, originalPrice: 60.00, discount: 25, imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800', category: 'wallets', rating: 4.8, soldCount: 1250, features: ['Full-grain premium leather', 'Holds up to 8 cards', 'Slim minimalist profile', 'RFID blocking tech'] },
  { id: '2', name: 'Ceramic Espresso Cup Set', description: 'A pair of handcrafted ceramic espresso cups. Matte finish on the outside, glazed inside.', price: 32.00, originalPrice: 40.00, discount: 20, imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800', category: 'new', rating: 5.0, soldCount: 420, features: ['Handcrafted ceramic', 'Set of 2 cups', 'Dishwasher safe', 'Matte exterior'] },
  { id: '3', name: 'Linen Throw Blanket', description: 'Lightweight, breathable 100% linen throw blanket. Perfect for cozy evenings.', price: 85.00, originalPrice: 100.00, discount: 15, imageUrl: 'https://images.unsplash.com/photo-1596484552834-6a58f850d0a1?auto=format&fit=crop&q=80&w=800', category: 'featured', rating: 4.9, soldCount: 890, features: ['100% pure linen', 'Breathable fabric', 'Large 50x60" size'] },
  { id: '4', name: 'Soy Wax Scented Candle', description: 'Hand-poured soy wax candle with notes of cedar, sandalwood, and amber.', price: 24.00, originalPrice: 30.00, discount: 20, imageUrl: 'https://images.unsplash.com/photo-1602874801007-bd458cb6c525?auto=format&fit=crop&q=80&w=800', category: 'best-seller', rating: 4.5, soldCount: 3200, features: ['Natural soy wax', '45+ hour burn time', 'Wood wick'] },
  { id: '5', name: 'Canvas Tote Bag', description: 'Heavyweight canvas tote bag with reinforced dual straps and an interior pocket.', price: 28.00, originalPrice: 35.00, discount: 20, imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800', category: 'other', rating: 4.2, soldCount: 150, features: ['Heavyweight canvas', 'Inner zip pocket', 'Reinforced straps'] },
  { id: '6', name: 'Matte Black Water Bottle', description: 'Double-wall vacuum insulated stainless steel water bottle. Keeps drinks cold for 24 hours.', price: 35.00, originalPrice: 50.00, discount: 30, imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=800', category: 'new', rating: 4.7, soldCount: 840, features: ['Double-wall insulation', '24h cold / 12h hot', 'BPA free'] },
  { id: '7', name: 'Signature Ocean Perfume', description: 'A refreshing aquatic perfume with top notes of bergamot and sea breeze.', price: 65.00, originalPrice: 85.00, discount: 23, imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80&w=800', category: 'perfumes', rating: 4.8, soldCount: 560, features: ['Eau de Parfum', '50ml bottle', 'Long-lasting scent'] },
  { id: '8', name: 'Classic Leather Belt', description: 'Full-grain leather belt with a solid brass buckle. Designed to age beautifully.', price: 35.00, originalPrice: 50.00, discount: 30, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800', category: 'belts', rating: 4.6, soldCount: 2300, features: ['Full-grain leather', 'Brass buckle', '1.5" width'] },
  { id: '9', name: 'Slim Bifold Wallet', description: 'Premium leather wallet holding up to 10 cards.', price: 40.00, originalPrice: 50.00, discount: 20, imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800', category: 'wallets', rating: 4.9, soldCount: 4200, features: ['Bifold design', 'Quick-access slot'] },
  { id: '10', name: 'Midnight Wood Fragrance', description: 'A deep, woody scent featuring cedarwood, amber, and a hint of vanilla.', price: 75.00, originalPrice: 100.00, discount: 25, imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800', category: 'fragrances', rating: 4.7, soldCount: 950, features: ['Woody profile', 'Unisex fragrance', '100ml size'] }
];

const mockReviews: Review[] = [
  { id: 'r1', productId: '1', userId: 'u2', userName: 'Alex Johnson', rating: 5, comment: 'Seriously the best wallet I have ever owned. High quality leather.', date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'r2', productId: '3', userId: 'u3', userName: 'Maria Garcia', rating: 4, comment: 'Very soft, but slightly smaller than I expected.', date: new Date(Date.now() - 86400000 * 12).toISOString() },
];

const mockOrders = [
  { id: 'ORD-1234', userId: 'u1', items: [{ product: mockProducts[0], quantity: 1 }], total: 45.00, date: new Date(Date.now() - 86400000 * 15).toISOString(), status: 'Delivered' }
];

const mockUsers: User[] = [
  { id: 'fostorio34@gmail.com', name: 'Admin', email: 'fostorio34@gmail.com', role: 'admin' },
  { id: 'u1', name: 'Test User', email: 'test@example.com', role: 'customer' },
  { id: 'u2', name: 'Alex Johnson', email: 'alex@example.com', role: 'customer' },
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      products: mockProducts,
      reviews: mockReviews,
      cart: [],
      user: null,
      notifications: [],
      orders: mockOrders,
      users: mockUsers,
      wishlist: [],
      darkMode: false,
      toggleDarkMode: () => set((state) => {
        const newDarkMode = !state.darkMode;
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { darkMode: newDarkMode };
      }),
      addOrder: (order) => {
        const newOrder = {
          ...order,
          id: `ORD-${Math.floor(Math.random() * 10000)}`,
          date: new Date().toISOString(),
          status: 'Processing'
        };
        set((state) => ({
          orders: [...state.orders, newOrder]
        }));
        return newOrder;
      },
      updateOrderStatus: (orderId, status) => set((state) => {
        const order = state.orders.find(o => o.id === orderId);
        if (!order) return {};
        return {
          orders: state.orders.map((o) => o.id === orderId ? { ...o, status } : o),
          notifications: [
            ...state.notifications,
            {
              id: Math.random().toString(36).substring(7),
              userId: order.userId,
              message: `Your order ${order.id} status has been updated to: ${status}`,
              date: new Date().toISOString(),
              read: false
            }
          ]
        };
      }),
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
      })),
      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: Math.random().toString(36).substring(7), rating: 0, soldCount: 0 }]
      })),
      updateProduct: (id, product) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...product } : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      updateUserRole: (id, role) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, role } : u)
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
      toggleWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.includes(productId)
          ? state.wishlist.filter((id) => id !== productId)
          : [...state.wishlist, productId],
      })),
    }),
    {

      name: 'ecommerce-storage',
    }
  )
);
