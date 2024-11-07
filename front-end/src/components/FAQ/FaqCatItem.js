export default function FaqCatItem({ title, description, href }) {
    return (
        <a href={href} className="flex bg-white rounded-lg w-full shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="w-2 bg-purple-500 rounded-l-lg"></div>
            <div className="flex flex-col text-left w-full p-4">
                <h2 className="font-semibold text-xl pr-4 text-black flex-1">{title}</h2>
                <p className="text-gray-600 text-sm">{description}</p>
            </div>
        </a>
    );
}
