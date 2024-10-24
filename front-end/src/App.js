import ActionsContainer from "./components/FAQ/ActionsContainer";
import Searchbar from "./components/FAQ/Searchbar";
import Footer from "./components/Footer";

import { FAQRoutes } from "./utils/FAQRoutes";

export default function App() {
  return (
    <main className="bg-gray-100">
      <header className="z-10 min-w-screen p-10 shadow-md">
        <h1 className="font-bold text-3xl md:text-4xl">Welcome to OCBC Support</h1>
      </header>

      {/* Main Content */}
      <div className="p-10">
        <section id="search-faq" className="mt-5 mb-16 w-full">
          <Searchbar showTitle={true} />
        </section>

        <section id="landing-actions" className="grid grid-cols-1 sm:grid-cols-2 py-5 content-center place-items-center sm:place-items-start gap-20">
          {FAQRoutes.map((route, index) => (
            <ActionsContainer key={index} title={route.title} description={route.description} />
          ))}
        </section>
      </div>

      <Footer />
    </main>
  );
}