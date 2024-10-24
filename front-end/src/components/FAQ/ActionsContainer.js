export default function ActionsContainer({ icon, title, description }) {
    return (
        <div class="relative bg-white rounded-lg shadow-lg w-full md:w-96 py-8 px-6 text-center h-full">
            <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-300 rounded-full w-20 h-20 border-4 border-ocbcred"></div>
            
            <h2 class="mt-5 text-xl font-semibold">{ title }</h2>
            <p class="mt-2 text-sm text-gray-600">{ description }</p>
        </div>
    )
}