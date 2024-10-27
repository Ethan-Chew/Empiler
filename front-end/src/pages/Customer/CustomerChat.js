import NavigationBar from "../../components/Navbar";
import { useSearchParams } from "react-router-dom";
import { FaArrowCircleUp } from "react-icons/fa";
import { useState } from "react";

export default function CustomerChat() {
    const [searchParams, setSearchParams] = useSearchParams();  
    const caseID = searchParams.get("caseID");

    useState(() => {
        console.log(caseID);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <NavigationBar />

            <div className="flex-grow flex flex-col p-0 md:p-10">
                {/* Live Chat Info Window */}
                <div id="support-header" className="w-full p-4 rounded-xl flex flex-row bg-white drop-shadow-[0_0px_4px_rgba(0,0,0,.3)]">
                    <div className="flex flex-col">
                        <a className="text-lg font-bold">You are now connected to our Customer Support Representative.</a>
                        <a className="text-sm text-neutral-400">Case ID: { caseID }</a>
                    </div>

                    <button className="ml-auto">
                        End Chat
                    </button>
                </div>

                {/* Live Chat Container */}
                <div id="live-chat" className="flex-grow mt-10 h-full w-full rounded-xl flex flex-col bg-white drop-shadow-[0_0px_4px_rgba(0,0,0,.3)]">
                    <div className="flex-grow p-4">
                        <a>You are now chatting with [insert name].</a>
                        
                        {/* Messages Area */}
                        <div id="chat-messages" className="h-full my-4">
                            
                        </div>
                    </div>

                    {/* Message Field */}
                    <div className="px-10 py-4 w-full rounded-b-xl flex flex-row justify-between">
                        <input 
                            className="p-3 border-2 w-full rounded-xl outline-none mr-5"
                            placeholder="Enter a Message.."
                        />
                        <button className="border-2 rounded-xl px-4 hover:border-neutral-500 duration-200">
                            <FaArrowCircleUp className="text-2xl text-neutral-400 hover:text-neutral-500" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}