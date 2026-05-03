import { motion } from 'motion/react';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';

const steps = [
  { id: 'Processing', icon: Clock, label: 'Order Processing' },
  { id: 'Shipped', icon: Package, label: 'Order Shipped' },
  { id: 'In Transit', icon: Truck, label: 'In Transit' },
  { id: 'Delivered', icon: CheckCircle2, label: 'Delivered' },
];

export function OrderTracking({ currentStatus }: { currentStatus: string }) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStatus);
  const activeStepIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-6">Tracking Details</h4>
      
      <div className="relative">
        <div className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
        <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gray-200 dark:bg-gray-700 sm:hidden"></div>
        
        <div className="relative flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
          {steps.map((step, index) => {
            const isCompleted = index <= activeStepIndex;
            const isActive = index === activeStepIndex;
            
            return (
              <div key={step.id} className="relative flex sm:flex-col items-center gap-4 sm:gap-3 group">
                <div 
                  className={`relative z-10 w-12 h-12 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    isCompleted 
                      ? 'bg-gray-900 border-gray-900 dark:bg-white dark:border-white text-white dark:text-gray-900' 
                      : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                  }`}
                >
                  <step.icon className={`w-5 h-5 sm:w-4 sm:h-4 ${isActive ? 'animate-pulse' : ''}`} />
                  
                  {isCompleted && index !== steps.length - 1 && (
                    <div className="absolute top-1/2 left-full w-[calc(100vw/4)] sm:w-[200px] h-0.5 bg-gray-900 dark:bg-white hidden sm:block -z-10 origin-left transition-all duration-500" />
                  )}
                  {isCompleted && index !== steps.length - 1 && (
                    <div className="absolute top-full text-center left-1/2 w-0.5 h-full min-h-[40px] bg-gray-900 dark:bg-white sm:hidden -z-10 -translate-x-1/2 transition-all duration-500" />
                  )}
                </div>
                
                <div className="flex flex-col sm:items-center sm:text-center mt-0 sm:mt-2">
                  <span className={`text-sm font-medium ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    {step.label}
                  </span>
                  {isActive && (
                    <motion.span 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-[var(--color-primary)] font-medium mt-1 uppercase tracking-wider"
                    >
                      Current Status
                    </motion.span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {activeStepIndex === steps.length - 1 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 bg-green-50 overflow-hidden dark:bg-green-900/20 px-4 py-3 rounded-lg border border-green-200 dark:border-green-800 flex items-center gap-3 text-green-800 dark:text-green-300"
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div className="flex flex-col gap-2">
            <p className="text-sm">Your order has been successfully delivered.</p>
            <p className="text-xs font-semibold">Thank you for shopping with us!</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
