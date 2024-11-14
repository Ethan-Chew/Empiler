import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from "react-icons/io";

function LiveChatPopup({ section, question, isOpen, setIsOpen }) {
  const [faqSection, setFaqSection] = useState('');
  const [faqQuestion, setFaqQuestion] = useState('');
  const [msg, setMsg] = useState(null);

  const initChat = () => {
    sessionStorage.setItem('faqSection', faqSection);
    sessionStorage.setItem('faqQuestion', faqQuestion);

    window.open('/awaitchat', "_self");
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (faqSection === '' || faqQuestion === '') {
      setMsg('Both Category and Question are required.');
      return;
    }

    initChat();
  };

  useEffect(() => {
    // If not null, set the FAQ Section and/or FAQ Question to its variables
    if (section) {
      setFaqSection(section);
    }

    if (question) {
      setFaqQuestion(question);
    }
  }, [section, question]);

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
            className="bg-white w-2/3 md:w-1/2 p-6 rounded-lg shadow-lg relative text-left"
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
            <div className='mb-4'>
              <h2 className="text-xl font-semibold mb-1">Request Live Chat</h2>
              <p className='text-neutral-700'>Need to speak to our Customer Support Agent? Start a Live Chat and have a conversation online.</p>
            </div>
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
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                Request
              </button>
              <p className='text-red-800 pt-1'>{ msg }</p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LiveChatPopup;