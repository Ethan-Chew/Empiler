import SectionContainer from "./components/FAQ/SectionContainer";
import Searchbar from "./components/FAQ/Searchbar";
import Footer from "./components/Footer";
import NavigationBar from "./components/Navbar";
import FaqIndivPage from "./pages/FaqIndivPage";

export default function App() {
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
        <a href="/faq">
          <div className="group rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <SectionContainer title="Some Title" description="this is a description" />
          </div>
        </a>
      </section>

      <Footer />
      
    </main>
  );
}