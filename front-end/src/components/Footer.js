import { PiChats } from "react-icons/pi";
import { BsCalendarCheck } from "react-icons/bs";

export default function Footer() {
  return (
    <footer className="py-12 bg-gray-50"> {/* Footer with padding */}
      <div className="flex flex-col lg:flex-row justify-between items-start px-8 lg:px-16">
        <div className="mb-8 lg:mb-0">
          <img src="/ocbc-logo.png" alt="OCBC Logo" className="w-40 h-20 lg:w-[280px] lg:h-[76px]" />
          <h3 className="text-3xl lg:text-[50px] mt-4">Group</h3>
        </div>
        {/* Container for the 2 columns */}
        <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-12 lg:ml-96"> {/* Added left margin here to push the columns to the right */}
          <div className="space-y-4">
            <h4 className="text-lg lg:text-[20px]">Useful Links</h4>
            <p className="text-base lg:text-[16px]">Investor Information</p>
            <p className="text-base lg:text-[16px]">International Network</p>
            <p className="text-base lg:text-[16px]">Careers</p>
            <p className="text-base lg:text-[16px]">Research</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg lg:text-[20px]">Contact Us</h4>
            <p className="text-base lg:text-[16px]">Personal Banking</p>
            <p className="text-base lg:text-[16px]">Premier Banking</p>
            <p className="text-base lg:text-[16px]">FRANK by OCBC</p>
            <p className="text-base lg:text-[16px]">Business Banking</p>
          </div>
        </div>
        {/* Circle Section with SVGs and hover effect */}
        <div className="flex flex-row lg:flex-col space-x-6 lg:space-x-0 lg:space-y-6 mt-8 lg:mt-0">
          {/* Circle 1 */}
          <div className="w-12 h-12 lg:w-[50px] lg:h-[50px] bg-[#2D3D45] rounded-full flex justify-center items-center hover:scale-105 transition-transform">
            <img src="/facebook.svg" alt="Facebook" className="w-2/5 h-2/5 object-contain" />
          </div>
          {/* Circle 2 */}
          <div className="w-12 h-12 lg:w-[50px] lg:h-[50px] bg-[#2D3D45] rounded-full flex justify-center items-center hover:scale-105 transition-transform">
            <img src="/youtube.svg" alt="Youtube" className="w-2/5 h-2/5 object-contain" />
          </div>
          {/* Circle 3 */}
          <div className="w-12 h-12 lg:w-[50px] lg:h-[50px] bg-[#2D3D45] rounded-full flex justify-center items-center hover:scale-105 transition-transform">
            <img src="/twitter.svg" alt="Twitter" className="w-2/5 h-2/5 object-contain" />
          </div>
          {/* Circle 4 */}
          <div className="w-12 h-12 lg:w-[50px] lg:h-[50px] bg-[#2D3D45] rounded-full flex justify-center items-center hover:scale-105 transition-transform">
            <img src="/linkedin.svg" alt="Linkedin" className="w-2/5 h-2/5 object-contain" />
          </div>
        </div>
      </div>
    </footer>
  );
}