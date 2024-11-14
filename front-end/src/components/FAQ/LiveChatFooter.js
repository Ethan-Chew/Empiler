import { FaArrowRightLong } from "react-icons/fa6";
import { PiChats } from "react-icons/pi";
import { BsCalendarCheck } from "react-icons/bs";

export default function LiveChatFooter({setIsOpen}) {
    return (
        <div className="flex mt-12 bg-gray-100 rounded-lg w-full mx-auto p-6 lg:p-8">
        {/* Image Section */}
        <div className="w-[33%] h-[400px] mr-6 rounded-lg">
            <img src="/ocbcsteps.jpg" alt="OCBC Steps" className="w-full h-full object-contain" />
        </div>

        {/* Text and Button Section */}
        <div className="flex flex-col justify-between w-[calc(67%)]">
            <h2 className="text-[36px] mr-auto">Still can't find what you're looking for?</h2>
            <div className="flex space-x-6 mt-4">
                {/* Button 1: Live Chat */}
                <button onClick={() => setIsOpen(true)} className="border border-gray-200 bg-white rounded-lg p-8 shadow-md hover:shadow-lg text-left w-[calc(50%-1rem)] h-[300px] group">
                    <div className="w-16 h-16 mb-6">
                        <PiChats className="w-full h-full object-contain fill-ocbcred" />
                    </div>
                    <p className="text-[24px] font-semibold mb-2">Start a Live Chat</p>
                    <p className="text-[18px] text-gray-500 mb-4">Estimated Waiting Time: 2 Minutes</p>
                    <div className="flex items-center text-[#D00E35] font-semibold">
                        <p className="mr-2">Explore Live Chat</p>
                        <FaArrowRightLong className="fill-ocbcred font-light transform transition-transform duration-300 group-hover:translate-x-2" />
                    </div>
                </button>

                {/* Button 2: Book an Appointment */}
                <a className="border border-gray-200 group bg-white rounded-lg p-8 shadow-md hover:shadow-lg text-left w-[calc(50%-1rem)] h-[300px]" href="appointments/branches">
                    <div className="w-16 h-16 mb-6">
                        <BsCalendarCheck className="w-full h-full object-contain fill-ocbcred" />
                    </div>
                    <p className="text-[24px] font-semibold mb-2">Book an Appointment</p>
                    <p className="text-[18px] text-gray-500 mb-4">With one of our friendly staff members</p>
                    <div className="flex items-center text-[#D00E35] font-semibold">
                        <p className="mr-2">Explore Appointment</p>
                        <FaArrowRightLong className="fill-ocbcred font-light transform transition-transform duration-300 group-hover:translate-x-2" />
                    </div>
                </a>
            </div>
        </div>
    </div>
    );
}