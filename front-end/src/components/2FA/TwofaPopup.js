import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";

function TwoFactorPopup({ isOpen, setIsOpen }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  const slideVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white w-96 p-6 rounded-lg shadow-lg relative text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <IoMdClose />
            </button>

            <AnimatePresence mode="wait">
              {currentSlide === 0 && (
                <motion.div
                  key="slide1"
                  className="text-center"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <h2 className="text-xl font-bold mb-4">Setup Two-Factor Authentication</h2>
                  <p className="text-gray-600 mb-6">
                    You will need to install a mobile authenticator application
                    (such as Google Authenticator) on your phone. After
                    installing, scan or click the QR code below.
                  </p>
                  <div className="bg-gray-200 w-48 h-48 mx-auto rounded-md flex items-center justify-center">
                    <span className="text-gray-500"></span>
                  </div>
                  <button
                    onClick={nextSlide}
                    className="mt-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Next
                  </button>
                </motion.div>
              )}

              {currentSlide === 1 && (
                <motion.div
                  key="slide2"
                  className="text-center"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <h2 className="text-xl font-bold mb-4">Setup Two-Factor Authentication</h2>
                  <p className="text-gray-600 mb-6">
                    Enter the 6-digit code you see on your authenticator app.
                  </p>
                  <div className="flex justify-center space-x-2 mb-6">
                    {Array(6)
                      .fill(0)
                      .map((_, idx) => (
                        <input
                          key={idx}
                          type="text"
                          maxLength="1"
                          className="w-10 h-10 border border-gray-300 rounded-md text-center text-lg"
                        />
                      ))}
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={prevSlide}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Back
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Submit
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TwoFactorPopup;