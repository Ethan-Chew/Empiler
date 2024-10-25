export default function NavigationBar() {
    return (
        <div className="z-10 px-10 py-4 flex flex-row items-center shadow">
            <a className="text-lg font-semibold" href="/">OCBC Support Centre</a>
            <div className="ml-auto duration-200">
                <a className="px-3 py-2 border-2 border-ocbcred hover:bg-ocbcred hover:text-white rounded-lg">Sign Up</a>
                <a className="px-3 py-2 bg-ocbcred hover:bg-ocbcdarkred text-white rounded-lg ml-4" href="/login">Login</a>
            </div>
        </div>
    );
}