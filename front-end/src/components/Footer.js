export default function Footer() {
    return (
      <><hr className="border-gray-300 border-t-3 w-11/12 mx-auto" />
      <footer className="bg-gray-100 py-8 text-left pl-10">
        <p className="pb-4 font-bold">Can't find what you're looking for?</p>
        <div className="flex flex-col md:flex-row justify-left gap-6 mb-4">
            <a href="">
              <div className="w-64 h-48 flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="w-20 h-20 mb-3 flex items-center justify-center rounded-full bg-gray-100">
                      <img src="/startLiveChat.svg" alt="Appointment" className="w-10 h-10" />
                  </div>
                  <h3 className="text-md font-semibold">Start a Live Chat</h3>
                  <p className="text-gray-500 text-xs mt-1">Waiting Time: 2 minutes or less</p>
              </div>
          </a>
          <a href="/appointment-booking">
              <div className="w-64 h-48 flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="w-20 h-20 mb-3 flex items-center justify-center rounded-full bg-gray-100">
                      <img src="/scheduleAppointment.svg" alt="Appointment" className="w-10 h-10" />
                  </div>
                  <h3 className="text-md font-semibold">Schedule an Appointment</h3>
                  <p className="text-gray-500 text-xs mt-1">for any further enquiries</p>
              </div>
          </a>
        </div>
        <div className="text-gray-700">
          <p className="mb-2">24/7 Hotline: +65 6363 3333</p>
          <p>Email: ocbc.business@gmail.com</p>
        </div>
      </footer></>
    );
}