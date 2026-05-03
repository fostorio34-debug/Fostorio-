import { motion } from 'motion/react';
import { Send, Phone, Mail, MessageCircle } from 'lucide-react';

export function Contact() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600">Have a question or want to learn more about our products? Reach out to us directly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-gray-50 rounded-lg p-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <Phone className="w-5 h-5 text-gray-900" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Phone / WhatsApp</h3>
          <p className="text-gray-600 mb-4">Available during business hours for quick support.</p>
          <a href="tel:03158330069" className="text-xl font-semibold text-gray-900 hover:text-gray-600 transition-colors mb-4 block">
            0315 833 0069
          </a>
          <a href="https://wa.me/923158330069" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-2 bg-green-500 text-white text-sm font-medium rounded-sm hover:bg-green-600 transition-colors gap-2">
            <MessageCircle className="w-4 h-4" /> Message on WhatsApp
          </a>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <Mail className="w-5 h-5 text-gray-900" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Email</h3>
          <p className="text-gray-600 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
          <a href="mailto:fostorio34@gmail.com" className="text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors">
            fostorio34@gmail.com
          </a>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"></textarea>
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-gray-900 text-white font-medium hover:bg-gray-800 rounded-sm transition-colors flex items-center justify-center gap-2">
            Send Message <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
