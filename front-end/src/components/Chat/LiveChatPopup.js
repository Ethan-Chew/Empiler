import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from "react-icons/io";

function LiveChatPopup({ isOpen, setIsOpen }) {
  const [faqSection, setFaqSection] = useState('');
  const [faqQuestion, setFaqQuestion] = useState('');

  const initChat = () => {
    sessionStorage.setItem('faqSection', faqSection);
    sessionStorage.setItem('faqQuestion', faqQuestion);

    window.open('/awaitchat', "_self");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    initChat();
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
            className="bg-white w-80 p-6 rounded-lg shadow-lg relative"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <IoMdClose />
            </button>
            <h2 className="text-xl font-semibold mb-4">Request Live Chat</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm text-gray-600">Question Category</label>
                <select
                  value={faqSection}
                  onChange={(e) => setFaqSection(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                >
                  <option value="" disabled>Select a category</option>
                  <option value="General">General</option>
                  <option value="Cross Border Payments">Cross Border Payments</option>
                  <option value="Payments and Transactions">Payments and Transactions</option>
                  <option value="ATMs">ATMs</option>
                  <option value="OCBC Digital Banking">OCBC Digital Banking</option>
                  <option value="Phone and SMS Banking">Phone and SMS Banking</option>
                  <option value="Cards">Cards</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600">Question</label>
                <input
                  type="text"
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="Example: How to change password"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Request
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LiveChatPopup;