import { FaArrowRightLong } from "react-icons/fa6";

export default function SectionContainer({ icon, title, description, link }) {
    return (
        <div className="h-full flex flex-col border-2 border-neutral-600 p-5 rounded-xl bg-white group">
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