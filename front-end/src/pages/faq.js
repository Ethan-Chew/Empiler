import NavigationBar from "../components/Navbar";
import Footer from "../components/Footer";
import FaqCatItem from "../components/FAQ/FaqCatItem";

export default function FAQ() {
    return (
        <div className="bg-gray-100">
            <NavigationBar />

            {/* Header Section */}
            <div className="bg-red-100 p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">Payments and Transactions</h1>
                    <p className="text-gray-500">Last Updated: 24th October 2024</p>
                </div>
            </div>

            {/* Items List */}
            <div className="space-y-4 w-full mx-auto flex flex-col items-center p-10">
                <FaqCatItem title="Some Title" description="this is a description"/>
                <FaqCatItem title="Some Title" description="this is a description"/>
            </div>            

            <Footer />
        </div>
    );
}