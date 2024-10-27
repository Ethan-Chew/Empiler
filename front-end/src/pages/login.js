import NavigationBar from "../components/Navbar"

export default function Login() {
    return (
        <div className="min-h-screen min-w-screen flex flex-col bg-neutral-100">
            <NavigationBar />

            <div className="flex flex-col flex-grow justify-center items-center md:h-auto">
                <div className="m-0 md:m-10 bg-white drop-shadow-[0_0px_4px_rgba(0,0,0,.3)] md:rounded-xl sm:w-3/4 flex-grow md:flex-grow-0 flex flex-col">
                    <div className="p-5 flex-grow md:flex-grow-0">
                        <div className="my-2 mb-6">
                            <img src="/ocbc.png" className="w-1/5 lg:w-1/12" />
                            <h1 className="mt-1 text-3xl font-bold">Support Portal</h1>
                        </div>

                        <div className="my-3 flex flex-col text-neutral-400">
                            <a>Username</a>
                            <input
                                className="border-3 rounded-lg border-neutral-400 px-3 py-2 outline-none"
                            />
                        </div>
                        <div className="my-3 flex flex-col text-neutral-400">
                            <a>Username</a>
                            <input
                                className="border-3 rounded-lg border-neutral-400 px-3 py-2 outline-none"
                            />
                        </div>

                        <div className="py-7 flex flex-col items-center">
                            <button className="bg-ocbcred hover:bg-ocbcdarkred py-2 w-full text-white text-lg font-semibold rounded-xl">
                                Login
                            </button>
                            <button className="mt-3 text-neutral-400 hover:text-neutral-500">
                                Forget Password
                            </button>
                        </div>
                    </div>

                    <div className="w-full bg-neutral-200 md:rounded-b-xl p-5 text-center">
                        <a>Don't have an support account? <span className="text-ocbcred">Sign up now</span></a>
                    </div>
                </div>
            </div>
        </div>
    )
}