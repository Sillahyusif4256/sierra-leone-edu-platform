// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiTrophy, FiShare2 } from 'react-icons/fi';

const SuccessCelebration = ({ isOpen, onClose, type = 'checkmark', title, message, actionText, onAction }) => {
  const celebrations = {
    checkmark: {
      icon: <FiCheck className="w-20 h-20 text-green-500" />,
      color: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    trophy: {
      icon: <FiTrophy className="w-20 h-20 text-yellow-500" />,
      color: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    confetti: {
      icon: <span className="text-6xl">🎉</span>,
      color: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  };

  const celebration = celebrations[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Celebration Dialog */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className={`bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border-2 ${celebration.color} ${celebration.borderColor}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon with animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                {celebration.icon}
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-800 text-center mb-2"
              >
                {title}
              </motion.h2>

              {/* Message */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-center mb-6"
              >
                {message}
              </motion.p>

              {/* Action Button */}
              {actionText && onAction && (
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => {
                    onAction();
                    onClose();
                  }}
                  className="w-full bg-sl-blue hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
                >
                  <FiShare2 />
                  <span>{actionText}</span>
                </motion.button>
              )}

              {/* Close Button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={onClose}
                className="w-full mt-4 text-gray-500 hover:text-gray-700 transition"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SuccessCelebration;
