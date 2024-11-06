import { useState } from 'react';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits, Configure } from 'react-instantsearch';
import Markdown from 'react-markdown'


const searchClient = algoliasearch("AFO67MRW1I", "9874cb69b99b02792082929c772d84d2");

const Hit = ({ hit }) => (
  <a href={`/faq-article?title=${hit.title}`} className="block p-2 hover:bg-gray-100">
    <div className="hit-title text-lg font-semibold">
      {hit.title}
    </div>
    <div className="hit-description text-gray-700">
      <Markdown>{hit.description}</Markdown>
    </div>
  </a>
);

export default function Searchbar({ showTitle }) {
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseDown = (event) => {
    event.preventDefault();
  };

  const handleMouseUp = (event) => {
    event.preventDefault();
    window.location.href = event.currentTarget.href;
  };

  return (
    <>
      <h3 className={showTitle ? "font-semibold text-lg mb-2" : "hidden"}>How can we help you today?</h3>
      <div className='bg-white rounded-xl px-5 py-3'>
        <InstantSearch searchClient={searchClient} indexName="title">
            <Configure hitsPerPage={5} />
          <div className='flex flex-row gap-3 items-center'>
            <FaMagnifyingGlass className='text-lg fill-ocbcred' />
            <SearchBox
              classNames={{
                root: 'w-full',
                input: 'w-full outline-none text-lg',
                submitIcon: 'hidden',
                resetIcon: 'hidden'
              }}
              placeholder='Example: How do I reset my password?'
              searchAsYouType={true}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          {isFocused && (
            <div>
                <div className='py-4'><hr /></div>
                <div className='flex flex-col gap-3'>
                    <Hits hitComponent={(props) => (
                    <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                        <Hit {...props} />
                    </div>
                    )} />
                </div>
            </div>
          )}
        </InstantSearch>
      </div>
    </>
  );
}