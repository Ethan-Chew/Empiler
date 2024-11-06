import SectionContainer from "./components/FAQ/SectionContainer";
import Searchbar from "./components/FAQ/Searchbar";
import Footer from "./components/Footer";
import NavigationBar from "./components/Navbar";

import { useState, useEffect } from 'react';

export default function App() {
  const [faqs, setFaqs] = useState([]);
  const [faqSection, setFaqSection] = useState('');
  const [faqQuestion, setFaqQuestion] = useState('');
  
  const initChat = () => {
    sessionStorage.setItem('faqSection', faqSection);
    sessionStorage.setItem('faqQuestion', faqQuestion);

    window.open('/awaitchat', "_self");
  }

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('/api/section/');
        const data = await response.json();
        setFaqs(data.sections);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <main className="bg-gray-100">
      <div>
        <input placeholder='Section' onChange={(e) => setFaqQuestion(e.target.value)} />
        <input placeholder='QUestion' onChange={(e) => setFaqSection(e.target.value)} />
        <button onClick={initChat}>
          Fire Request go WEEEEEEEEEEEEEEEE
        </button>
      </div>
      <NavigationBar />
      <header className="min-w-full px-10 py-16 bg-red-100">
        <img src="/FAQHeader.png" alt="Hero Image" className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover object-center rounded-lg mb-10" />
        <h1 className="text-3xl md:text-4xl font-semibold mb-5 md:mb-6">How can we help you today?</h1>
        <Searchbar showTitle={false} />
      </header>

      {/* Main Content */}
      <section className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {faqs.map(faq => (
          <a key={faq.id} href={`/faq/${faq.id}`}>
            <div className="group rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <SectionContainer title={faq.title} description={faq.description} />
            </div>
          </a>
        ))}
      </section>

      <Footer />
    </main>
  );
}