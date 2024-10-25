import { FaArrowRightLong } from "react-icons/fa6";

export default function SectionContainer({ icon, title, description, link }) {
    return (
        <div className="border-2 border-neutral-600 p-5 rounded-xl bg-white">
            <p className="text-2xl font-bold">{ title }</p>
            <p>{ description }</p>

            <div className="mt-3 flex flex-row gap-2 items-center">
                <a className="font-semibold text-ocbcred">Explore FAQ</a>
                <FaArrowRightLong className="fill-ocbcred font-light" />
            </div>
        </div>
    )
}