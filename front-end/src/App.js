import SectionContainer from "./components/FAQ/SectionContainer";
import Searchbar from "./components/FAQ/Searchbar";
import Footer from "./components/Footer";
import NavigationBar from "./components/Navbar";
import FaqIndivPage from "./pages/FaqIndivPage";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ALL CODE IN THIS FILE IS OVERWRITABLE, FOR DEBUG USE ONLY. TO BE REPLACED.
export default function App() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [faqSection, setFaqSection] = useState('');
  const [faqQuestion, setFaqQuestion] = useState('');

  const initChat = () => {
    sessionStorage.setItem('faqSection', faqSection);
    sessionStorage.setItem('faqQuestion', faqQuestion);

    navigate('/awaitchat');
  }

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/faq/section');
        const data = await response.json();
        console.log(data);
        setFaqs(data.sections);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <main className="bg-gray-100">
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