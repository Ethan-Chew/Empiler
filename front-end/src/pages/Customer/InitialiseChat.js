export default function InitisaliseChat() {

    // Write code to initialise the connection to backend and await a response

    return (
        <div className="min-w-screen min-h-screen flex items-center md:justify-center">
            <div className="p-5 rounded-xl bg-white md:drop-shadow-[0_0px_4px_rgba(0,0,0,.3)] md:w-1/2">
                <div className="flex flex-col gap-5">
                    <div>
                        <img src="/ocbc.png" className="w-1/3 lg:w-1/6 mb-2" />
                        <h1 className="font-bold text-2xl mb-2">We're connecting you to an advisor.</h1>
                        <p><span className="font-bold">Estimated Waiting Time: </span>2 minutes</p>
                    </div>
                    <p>Our Customer Support Agents are over capacity right now. Please forgive us as we connect you to an available agent.</p>
                </div>

                {/* Future: if taking too long, ask to make appintment instead? */}
            </div>
        </div>
    )
}