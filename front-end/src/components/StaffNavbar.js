export default function StaffNavigationBar() {
    return (
        <div className="flex flex-row z-10 px-10 py-4 items-center">
            <img src="/ocbc.png" className="w-1/4 md:w-1/12" />

            <div className="ml-auto text-lg flex flex-row gap-4">
                <a>Home</a>
                <a>Chats</a>
            </div>
        </div>
    );
}