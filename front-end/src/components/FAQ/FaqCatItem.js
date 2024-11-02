export default function FaqCatItem({title, description, href}) {
    return (
        <a href={href} className="flex bg-white shadow rounded-lg w-full shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="w-2 bg-purple-500 rounded-l-lg"></div>
            <div className="flex items-center w-full p-4">
                <h2 className="font-semibold text-lg pr-4 text-black">{title}</h2>
                <div className="h-12 border-l border-gray-300 mx-4"></div>
                <p className="text-gray-600 text-sm">{description}</p>
            </div>
        </a>
    )
}