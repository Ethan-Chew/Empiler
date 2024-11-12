import SectionContainer from "./components/FAQ/SectionContainer";
import Searchbar from "./components/FAQ/Searchbar";
import Footer from "./components/Footer";
import NavigationBar from "./components/Navbar";
import LiveChatPopup from './components/Chat/LiveChatPopup';
import { searchClient } from '@algolia/client-search';
import { useState, useEffect } from 'react';


export default function App() {
  const [faqs, setFaqs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const algoilaAdminKey = process.env.REACT_APP_ALGOILA_ADMIN_KEY;

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/faq/section');
        const data = await response.json();
        setFaqs(data.sections);
      } catch (error) {
        console.error('Error fetching faq sections:', error);
      }
    };

    fetchFaqs();
  }, []);

  const processRecords = async () => {
    const client = searchClient('AFO67MRW1I', algoilaAdminKey);
    const datasetRequest = await fetch('http://localhost:8080/api/faq/details');
    const details = await datasetRequest.json();
    return await client.replaceAllObjects({ indexName: 'title', objects: details.details });
  };
  
  useEffect(() => {
    processRecords()
    .catch((err) => console.error(err));
  }, );

  return (
    <main className="bg-gray-100">
      <NavigationBar />
      <header className="relative w-full">
        <img 
          src="https://www.ocbc.com/iwov-resources/sg/ocbc/personal/img/live/help-and-support/featured_bg-contactus.png" 
          alt="Hero Image" 
          className="w-full h-[300px] md:h-72 object-cover object-center rounded-lg mb-10" 
        />
        <div className="absolute top-0 left-0 w-full h-full flex justify-start items-center text-left text-white px-4 md:px-8">
          <div className="flex-grow max-w-[50vw]">
            <h1 className="text-3xl md:text-4xl font-semibold mb-5 md:mb-6 text-black">How can we help you today?</h1>
            <Searchbar showTitle={false} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {faqs.map(faq => (
          <a key={faq.id} href={`/faq?title=${faq.title}`}>
            <SectionContainer icon={faq.icon} title={faq.title} description={faq.description} />
          </a>
        ))}
      </section>

      {isOpen && <LiveChatPopup isOpen={isOpen} setIsOpen={setIsOpen} />}

      <Footer setIsOpen={setIsOpen}/>
    </main>
  );
}
