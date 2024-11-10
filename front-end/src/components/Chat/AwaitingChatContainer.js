import { useRef, useState, useEffect } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BsDashSquareFill } from "react-icons/bs";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

// Component acts as a popup that displays when a user is waiting for a chat to be accepted by a staff member
export default function AwaitChatContainer({ joinChat, hideAwaitCustomerList, waitingCustomers }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [faqSections, setFaqSections] = useState([]);
    const [searchCategory, setSearchCategory] = useState('All');
    const [searchCategoryDropdown, setSearchCategoryDropdown] = useState(false);
    const boxRef = useRef(null);

    const selectOption = (category) => {
        setSearchCategory(category);
        setSearchCategoryDropdown(false);
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            e.preventDefault();
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                hideAwaitCustomerList();
            }
        }
        const fetchFaqs = async () => {
            try {
              const response = await fetch('http://localhost:8080/api/faq/section');
              const data = await response.json();
              const sections = data.sections.map((section) => section.title);
              setFaqSections(['All', ...sections, 'Others']);
            } catch (error) {
              console.error('Error fetching faq sections:', error);
            }
        };
      
        // document.addEventListener('mousedown', handleClickOutside);
        fetchFaqs();
        // return () => {
        //     document.removeEventListener('mousedown', handleClickOutside);
        // };
    }, []);

    return (
        <div ref={boxRef} className="md:m-10 max-h-screen md:max-h-[90vh] md:rounded-xl md:border-3 border-neutral-400 bg-neutral-100 flex flex-col items-start">
            <div id="header" className="p-5 bg-white border-b-3 border-neutral-400 rounded-t-xl">
                <div className="flex flex-row items-center">
                    <h2 className="text-3xl font-semibold mb-1">Waiting Customers</h2>
                    <button className="ml-auto" onClick={() => hideAwaitCustomerList()}>
                        <BsDashSquareFill className="fill-chatred hover:fill-red-500 text-xl" />
                    </button>
                </div>
                <a className="text-neutral-600">Customers who have requested a live chat; Join and Manage up to 7 Live Chats simultaneously.</a>

                <div className="flex flex-row justify-between mt-5 gap-3">
                    <div id="search-bar" className="z-20 w-1/2 flex flex-row items-center gap-2 py-1 px-3 rounded-md border-2 border-neutral-400">
                        <FaMagnifyingGlass className="fill-neutral-400" />
                        <input
                            placeholder="Search for Questions..."
                            className="outline-none w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative inline-block">
                        <div className="flex items-center h-full border-2 border-neutral-400 rounded-md overflow-hidden">
                            {/* Category Label */}
                            <div className="px-4 py-2 h-full bg-gray-100 text-gray-700 font-medium">
                                Category
                            </div>
                            
                            {/* Selected Option with Dropdown Toggle */}
                            <div
                                className="flex flex-row gap-2 items-center px-4 py-2 text-gray-700 cursor-pointer"
                                onClick={() => setSearchCategoryDropdown(!searchCategoryDropdown)}
                            >
                                <span>{searchCategory}</span>
                                {searchCategoryDropdown ? (
                                    <IoChevronUp className="fill-gray-700" />
                                ) : (
                                    <IoChevronDown className="fill-gray-700" />
                                )}
                            </div>
                        </div>

                        {/* Dropdown Menu */}
                        <div id="dropdownMenu" className={`${ searchCategoryDropdown ? "absolute" : "hidden" } mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg`}>
                            <ul>
                                {faqSections.map((section) => (
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" key={section} onClick={() => selectOption(section)}>
                                        { section }
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div id="customer-list" className="mb-3 w-full overflow-y-scroll">
                {Object.keys(waitingCustomers).length === 0 && (
                    <div className="p-4 text-xl font-semibold">
                        <p>There are no waiting customers.</p>
                    </div>
                )}
                {Object.keys(waitingCustomers).length > 0 && Object.keys(waitingCustomers).map((section) => {
                    const filteredRequests = waitingCustomers[section].filter((request) => {
                        const matchesSearchTerm = request.faqQuestion.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesCategory = searchCategory === "All" || request.faqSection === searchCategory;
                        return matchesSearchTerm && matchesCategory;
                    });

                    // Only render the section if there are any filtered requests
                    return filteredRequests.length > 0 ? (
                        <FAQSectionCustomer 
                            key={section} 
                            section={section} 
                            requests={filteredRequests}  // Fixing the prop to pass the filtered requests
                            joinChat={joinChat} 
                        />
                    ) : null;
                })}
            </div>
        </div>
    )
}

function FAQSectionCustomer({ section, requests, joinChat }) {
    useState(() => {
        console.log(section)
        console.log(requests)
    }, [])
    return (
        <div className="w-full">
            <h3 className="ml-10 mr-5 py-2 text-lg font-bold text-neutral-600">{ section }</h3>
            {requests.map((request, index) => (
                <CustomerRequestContainer key={index} index={index} request={request} joinChat={joinChat} />
            ))}
        </div>
    )
}

function CustomerRequestContainer({ index, request, joinChat }) {
    const [buttonText, setButtonText] = useState("Join Chat");

    const handleJoin = async () => {
        setButtonText("Joining...");
        const addRequest = await joinChat(request.customerSessionIdentifier);
        if (addRequest) {
            setButtonText("Joined!");
        } else {
            alert("You cannot join more than 7 chats at a time.");
        }

    }

    return (
        <div className={`${index === 0 && "border-t-2"} border-b-2 px-5 py-2 border-neutral-400 flex flex-row items-center justify-between`}>
            <p className="font-semibold">{ request.faqQuestion }</p>
            <button className="px-4 py-1 bg-chatred text-white rounded-md hover:bg-red-500" onClick={handleJoin}>
                { buttonText }
            </button>
        </div>
    )
}