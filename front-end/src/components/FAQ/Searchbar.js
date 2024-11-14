import { useState } from 'react';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits, Configure, Highlight} from 'react-instantsearch';


const searchClient = algoliasearch("AFO67MRW1I", "9874cb69b99b02792082929c772d84d2");

const Hit = ({ hit }) => (
  <a href={`/individualfaqpage?title=${hit.title}`} className="block p-2 hover:bg-gray-100">
    <div className="hit-title text-lg font-semibold">
      <Highlight attribute="title" hit={hit} />
    </div>
  </a>
);

export default function Searchbar() {
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseDown = (event) => {
    event.preventDefault();
  };

  const handleMouseUp = (event) => {
    event.preventDefault();
    window.location.href = event.currentTarget.href;
  };

  return (
    <div className="relative mt-12 mb-12 max-w-4xl mx-auto">
        <InstantSearch searchClient={searchClient} indexName="title">
            <Configure hitsPerPage={5} />

            <div className="relative">
              <SearchBox
                classNames={{
                    root: "w-full",
                    input: "w-full rounded-full bg-[#F9F9F9] text-[#454040] text-xl px-6 py-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D00E35]",
                    submitIcon: "hidden",
                    resetIcon: "hidden",
                    loadingIcon: "hidden"
                }}
                placeholder="Example: I'm having problems signing in to my account"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                //searchAsYouType={true} //uncomment when demoing
              />
                <span className="absolute right-4 top-2/4 transform -translate-y-2/4 text-[#454040]">
                    <FaMagnifyingGlass className="w-6 h-6" />
                </span>
            </div>

            {/* Display search suggestions when focused */}
            {isFocused && (
                <div className="absolute top-full left-0 w-full mt-2 p-3 bg-white z-10 shadow-lg rounded-lg text-black">
                    <div className="flex flex-col gap-3 text-left">
                        <Hits
                            hitComponent={(props) => (
                                <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                                    <Hit {...props} />
                                </div>
                            )}
                        />
                    </div>
                </div>
            )}
        </InstantSearch>
    </div>
  );
}