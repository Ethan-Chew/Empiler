import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import NavigationBar from "../components/Navbar";
import { useSearchParams } from 'react-router-dom';
import Markdown from 'react-markdown'

function FaqIndivPage() {
    const [faqDetail, setFaqDetail] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const title = searchParams.get('title');

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/faq/detail/${title}`);
                const data = await response.json();
                setFaqDetail(data.detail[0]);
            } catch (error) {
                console.error('Error fetching faq detail:', error);
            }
        };

        if (title) {
            fetchDetail();
        }
    }, [title]);

    return (
        <>
            <NavigationBar />
            <div className='bg-gray-100'>

                <div className="bg-red-100 p-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold">{title}</h1>
                        <p className="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                </div>

                <div className="bg-white w-11/12 mx-auto m-10 p-6 rounded-lg shadow-lg">
                    <div className="text-gray-700 mb-4 markdown">
                    {faqDetail ? (
                            <Markdown>{faqDetail.description}</Markdown>
                        ) : (
                            <p>{'Loading...'}</p>
                        )}
                    </div>

                    <div className="border-gray-300 border-t-3 pt-4 flex text-left space-x-4 ">
                        <p className="text-gray-700 pt-3">Was this information useful?</p>
                        <button className="bg-white text-red-500 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white w-20">
                            Yes
                        </button>
                        <button className="bg-white text-red-500 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white w-20">
                            No
                        </button>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default FaqIndivPage;