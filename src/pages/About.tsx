import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">About Crafted.</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          We believe in creating products that serve a purpose and look beautiful doing it. No clutter. No unnecessary details. Just honest design.
        </p>
      </div>

      <div className="aspect-[21/9] w-full bg-gray-100 rounded-2xl overflow-hidden mb-16">
        <img src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&q=80&w=2000" alt="Workspace" className="w-full h-full object-cover" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Philosophy</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            In a world filled with endless consumption and disposable goods, we set out to build something different. We create everyday carry essentials and home goods designed to age beautifully and last a lifetime.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Every material is carefully sourced. Every stitch is considered. If we wouldn't use it ourselves, we don't sell it.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Maker</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Crafted started in a small garage studio. What began as a personal quest to find the perfect minimal wallet turned into a dedicated practice of design and manufacturing.
          </p>
          <Link to="/products" className="inline-flex items-center text-gray-900 font-medium hover:underline hover:underline-offset-4">
            Explore the Collection →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
