import SectionContainer from "./components/FAQ/SectionContainer";
import Searchbar from "./components/FAQ/Searchbar";
import Footer from "./components/Footer";
import NavigationBar from "./components/Navbar";

export default function App() {
  return (
    <main className="bg-gray-100">
      <NavigationBar />
      <header className="min-w-full px-10 py-16 bg-red-100">
        <h1 className="text-3xl md:text-4xl font-semibold mb-5 md:mb-6">How can we help you today?</h1>
        <Searchbar showTitle={false} />
      </header>

      {/* Main Content */}
      <section className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        <SectionContainer title="Some Title" description="this is a description" />
      </section>

      <Footer />
    </main>
  );
}