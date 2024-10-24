import { useState, useEffect } from 'react';
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function Searchbar({ showTitle }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    return (
        <>
            <h3 className={showTitle ? "font-semibold text-lg mb-2" : "hidden"}>How can we help you today?</h3>
            <div className='bg-white rounded-xl px-5 py-3'>
                <div className='flex flex-row gap-3 items-center'>
                    <FaMagnifyingGlass className='fill-ocbcred' />
                    <input 
                        className='w-full outline-none'
                        placeholder='Example: How do I reset my password?'
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                </div>
                {isFocused &&
                    <div>
                        <div className='py-4'><hr /></div>
                        <div className='flex flex-col gap-3'>
                            <a>Item 1</a>
                            <a>Item 2</a>
                            <a>Item 3</a>
                            <a>Item 4</a>
                            <a>Item 5</a>
                            <a>Item 6</a>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}