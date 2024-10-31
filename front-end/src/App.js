import SectionContainer from "./components/FAQ/SectionContainer";
import Searchbar from "./components/FAQ/Searchbar";
import Footer from "./components/Footer";
import NavigationBar from "./components/Navbar";

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
        <SectionContainer title="Some Title" description="this is a description" />
      </section>

      <Footer />
      <footer className="bg-gray-100 py-8 text-center">
        <p className="pb-4 font-bold">Can't find what you're looking for?</p>
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-4">
        <a href="">
          <div className="w-80 h-56 flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-gray-100">
              <img src="/startLiveChat.svg" alt="Appointment" className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-semibold">Start a Live Chat</h3>
            <p className="text-gray-500 text-sm mt-1">Waiting Time: 2 minutes or less</p>
          </div>
          </a>
          <a href="">
          <div className="w-80 h-56 flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-gray-100">
              <img src="/scheduleAppointment.svg" alt="Appointment" className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-semibold">Schedule an Appointment</h3>
            <p className="text-gray-500 text-sm mt-1">for any further enquiries</p>
          </div>
          </a>
        </div>
        <div className="text-gray-700">
          <p className="mb-2">24/7 Hotline: +65 6363 3333</p>
          <p>Email: ocbc.business@gmail.com</p>
        </div>
      </footer>
    </main>
  );
}