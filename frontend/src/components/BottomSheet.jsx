// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';

const BottomSheet = ({ isOpen, onClose, children, height = 'auto' }) => {
  const sheetRef = useRef(null);

  const handlers = useSwipeable({
    onSwipedDown: onClose,
    onSwiping: (e) => {
      const sheet = sheetRef.current;
      if (sheet) {
        const y = e.deltaY;
        if (y > 0) {
          sheet.style.transform = `translateY(${y}px)`;
        }
      }
    },
    onSwiped: () => {
      const sheet = sheetRef.current;
      if (sheet) {
        sheet.style.transform = '';
      }
    },
    trackMouse: true,
    trackTouch: true,
  });

  const sheetVariants = {
    hidden: { y: '100%' },
    visible: { y: 0 },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5 },
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-50"
            onClick={onClose}
          />
          
          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            {...handlers}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl z-50 shadow-2xl"
            style={{ height: typeof height === 'number' ? `${height}px` : height, maxHeight: '90vh' }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
            
            {/* Content */}
            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100% - 40px)' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
