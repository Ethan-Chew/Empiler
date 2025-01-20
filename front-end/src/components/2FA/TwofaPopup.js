import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";
const qrcode = require('qrcode');

function TwoFactorPopup({ isOpen, setIsOpen, setIsTwofaDisabled }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [otp, setOtp] = useState('');
  const [secret, setSecret] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const userSession = JSON.parse(sessionStorage.getItem('userDetails'));

  const createOtp = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/otp/create/${currentUser.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setSecret(data.secretkey);
      qrcode.toDataURL(data.otpURI, (err) => {
        if (err) {
          console.error('Error generating QR code:', err);
        } else {
          document.getElementById('qr-code').src = qrcode.create(data.otpURI);
        }
      });
    } catch (error) {
      console.error('Error creating OTP:', error);
    }
  };

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
        alert('OTP verified successfully!');
        setIsOpen(false);
        setIsTwofaDisabled(false); // Enable the 2FA setup button
        
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/user/${userSession.id}`);
        const data = await response.json();
        setCurrentUser(data);
      }
      catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
      fetchCurrentUser();
    }, []);
    

  useEffect(() => {
    const existingOtp = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/otp/get/${currentUser.email}`);
        const data = await response.json(); 
        console.log(data);
        if (data.status === false) {
          createOtp();
        } else {
          setSecret(data.secret);
          qrcode.toDataURL(data.otpURI, (err, url) => {
            if (err) {
                console.error('Error generating QR code:', err);
            } else {
                document.getElementById('qr-code').src = url;
            }
        });
        }
      }
      catch (err) {
        console.error('Error fetching existing OTP:', err);
      }
    };
    setTimeout(existingOtp, 500);
  });

  const handleOtpChange = (e, idx) => {
    const value = e.target.value;
  
    if (!/^\d*$/.test(value)) return; // Allow only digits
  
    const otpArray = otp.split('');
    otpArray[idx] = value;
  
    // Handle backspace (clearing the current input and focusing the previous one)
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
                    <img id="qr-code"/>
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
                      onClick={prevSlide}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Back
                    </button>
                    <button
                      onClick={verifyOtp}
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