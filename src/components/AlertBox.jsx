import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertBox = ({ isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-6 right-6 z-50 w-96 bg-red-50 border-l-4 border-red-500 shadow-2xl rounded-r-lg p-4 flex items-start gap-4"
                >
                    <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                        <AlertTriangle className="text-red-600 w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-red-800 font-bold text-lg">Critical Alert</h4>
                        <p className="text-red-700 text-sm mt-1">
                            Garbage bin is overflowing! Fill level has exceeded 80%. Please schedule a pickup immediately.
                        </p>
                    </div>
                    <button className="text-red-400 hover:text-red-600 transition-colors">
                        <X size={20} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AlertBox;
