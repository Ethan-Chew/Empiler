import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";

function Login2faPopup({ isOpen, setIsOpen, currentUser, handleSuccessfulLogin }) {
  const [otp, setOtp] = useState('');

  const verifyOtp = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: currentUser.email,
          otpCode: otp
        })
      });
      const data = await response.json();
      if (data.status === true) {
        setIsOpen(false);
        handleSuccessfulLogin(currentUser);
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  const handleOtpChange = (e, idx) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return; // Allow only digits

    const otpArray = otp.split('');
    otpArray[idx] = value;

    // Handle backspace
    if (value === '' && idx > 0) {
      const prevInput = document.querySelector(`#otp-input-${idx - 1}`);
      if (prevInput) prevInput.focus();
    }

    setOtp(otpArray.join(''));

    // Automatically move focus to the next input if a digit is entered
    if (value && idx < 5) {
      const nextInput = document.querySelector(`#otp-input-${idx + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

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

            <motion.div
              key="slide2"
              className="text-center"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h2 className="text-xl font-bold mb-4">Two-Factor Authentication</h2>
              <p className="text-gray-600 mb-6">
                Enter the 6-digit code you see on your authenticator app.
              </p>
              <div className="flex justify-center space-x-2 mb-6">
                {Array(6)
                  .fill(0)
                  .map((_, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength="1"
                      className="w-10 h-10 border border-gray-300 rounded-md text-center text-lg"
                      value={otp[idx] || ''}
                      onChange={(e) => handleOtpChange(e, idx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                          const prevInput = document.querySelector(`#otp-input-${idx - 1}`);
                          if (prevInput) prevInput.focus();
                        }
                      }}
                    />
                  ))}
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyOtp}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Login2faPopup;