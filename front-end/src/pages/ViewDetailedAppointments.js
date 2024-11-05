export default function ViewDetailedAppointments() {
    return (
        <div className="font-sans h-screen overflow-hidden">
            
            <div className="bg-[#677A84] w-full h-24"></div> 

            
            <div className="bg-[#D9D9D9] w-full py-6 px-8">
                <p className="text-2xl font-semibold text-black">Appointment Details</p>
            </div>

            
            <div className="w-3/4 mx-auto mt-8 bg-white border border-[#C7C7C7] rounded-lg p-6 shadow-md">
                
                <div className="mb-4">
                    <p className="text-xl font-semibold text-black">Sixth Avenue Branch</p>
                    <p className="text-sm text-[#707070]">1.1 km | 827 Bukit Timah Road, Singapore 279886</p>
                </div>

                
                <div className="mb-6">
                    <p className="text-md text-[#007B00]">
                        13 December 2024, 4.00pm - 4.30pm
                        <br />Booked by: Person Name
                    </p>
                </div>

                
                <div className="flex justify-around mt-6">
                    
                    <div className="w-1/3">
                        <button className="w-full bg-white border border-gray-300 rounded-lg shadow-md py-4 px-6 text-center hover:bg-gray-100 transition-all">
                            <img src="/rescheduleappointment.svg" alt="Reschedule Icon" className="mx-auto w-40" /> 
                            <span className="text-black">Reschedule an Appointment</span>
                        </button>
                    </div>
                    
                    <div className="w-1/3">
                        <button className="w-full bg-white border border-gray-300 rounded-lg shadow-md py-4 px-6 text-center hover:bg-gray-100 transition-all">
                            <img src="/reassignstaff.svg" alt="Assign Icon" className="mx-auto w-40" /> 
                            <span className="text-black">Assign Appointment to Other Staff</span>
                        </button>
                    </div>
                </div>

                
                <div className="mt-8 text-center">
                    <button className="bg-white border border-gray-300 rounded-lg shadow-md py-4 px-6 w-1/3 hover:bg-gray-100 transition-all">
                        <span className="text-black">Back to List</span>
                    </button>
                </div>
            </div>
        </div>
    );
}