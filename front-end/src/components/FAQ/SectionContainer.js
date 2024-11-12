import { FaArrowRightLong } from "react-icons/fa6";
import { GrHelpBook, GrMoney, GrCalculator, GrChat, GrGlobe, GrCreditCard, GrAtm } from "react-icons/gr";
import React from "react";

const Icons = {
    GrHelpBook, 
    GrMoney, 
    GrCalculator, 
    GrChat, 
    GrGlobe, 
    GrCreditCard, 
    GrAtm
};

export default function SectionContainer({ icon, title, description }) {
    return (
        <div className="h-full flex flex-col border-2 border-neutral-600 p-5 rounded-xl bg-white group">
            {Icons[icon] && React.createElement(Icons[icon], { className: "text-5xl mb-2 stroke-1" })}
            <div className="flex-grow">
                <p className="text-2xl font-bold">{ title }</p>
                <p>{ description }</p>
            </div>

            <div className="mt-3 flex flex-row gap-2 items-center">
                <a className="font-semibold text-ocbcred">Explore FAQ</a>
                <FaArrowRightLong className="fill-ocbcred font-light transform transition-transform duration-300 group-hover:translate-x-2" />
            </div>
        </div>
    )
}