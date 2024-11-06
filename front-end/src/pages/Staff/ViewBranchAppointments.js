export default function ViewBranchAppointments() {
  return (
    <div className="font-sans h-screen overflow-hidden">
      <div className="bg-custom-blue-gray w-full h-24"></div>

      <div className="bg-[#D9D9D9] w-full p-6">
        <p className="text-2xl font-bold text-black">View Branch Appointments</p>
        <p className="text-sm text-black">View all scheduled appointments</p>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Search by User or Branch Location"
            className="w-full p-3 rounded-full bg-white border border-gray-300 text-sm text-gray-500"
          />
        </div>
      </div>

      <div className="px-6 py-4">
        <p className="text-lg">
          Showing all appointments for:{" "}
          <span className="text-[#DA291C]">Sixth Avenue Branch, Singapore.</span>
        </p>
      </div>

      <div className="px-6 overflow-y-scroll h-[calc(100vh-250px)]">
        {[...Array(7)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow cursor-pointer flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-semibold text-black">Sixth Avenue Branch</p>
              <p className="text-sm text-[#707070]">
                1.1 km | 827 Bukit Timah Road, Singapore 279886
              </p>
            </div>

            <div className="w-px h-12 bg-[#707070] mx-6"></div>

            <div className="text-right">
              <p className="text-sm text-[#007B00]">
                13 December 2024, 4.00pm - 4.30pm
                <br />
                Booked by: Person Name
              </p>
            </div>

            <div className="text-[#C7C7C7] text-2xl">&gt;</div>
          </div>
        ))}
      </div>
    </div>
  );
}