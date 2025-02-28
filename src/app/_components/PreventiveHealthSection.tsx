import React from 'react';
import Image from 'next/image';

const PreventiveHealthSection = () => {
    return (
        <div className='w-full relative'>
            <div className="flex flex-col md:flex-row w-full pb-16">
                {/* Left side - Laboratory Image */}
                <div className="w-full md:w-1/2 bg-gray-100">
                    <Image
                        src="https://emailer.thyrocare.com/DM_landing_page/images/others/features.jpg"
                        alt="Thyrocare Laboratory"
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right side - Content */}
                <div className="w-full md:w-1/2 bg-white p-6 md:p-12">
                    <div className="max-w-2xl mx-auto">
                        {/* Heading */}
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                            Why do we need Preventive Health Checkup?
                        </h2>

                        {/* Paragraph */}
                        <p className="text-gray-600 mb-12 leading-relaxed">
                            &quot;Prevention is better than cure&quot;, &quot;A stitch in time saves nine&quot; are well-known adages. Today more emphasis is placed on the prevention of
                            diseases and promoting health awareness. Growing sedentary lifestyles, increasing stress levels at work place, tempting and enticing food
                            displays, growing disposable incomes, increased addictions to automobiles, all indicate that we give to our body more than what it needs. This
                            has given rise to obesity, diabetes, high blood pressure and a host for many other lifestyle disorders. With advanced tests and technologies,
                            clinical laboratories can help in identifying various disorders accurately which can be treated completely or at least the progress can be
                            delayed.
                        </p>

                        {/* USP Section */}
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                            Our USP
                        </h3>

                        {/* Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="bg-white rounded-md shadow-md p-6 flex flex-col items-center justify-center text-center">
                                <div className="text-4xl text-gray-700 mb-4">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 7 12 7s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                                    </svg>
                                </div>
                                <p className="text-gray-700 text-sm">
                                    Avaliable in all Major Cities and Towns
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white rounded-md shadow-md p-6 flex flex-col items-center justify-center text-center">
                                <div className="text-4xl text-gray-700 mb-4">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
                                    </svg>
                                </div>
                                <p className="text-gray-700 text-sm">
                                    Takes just 5 mins for collection
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white rounded-md shadow-md p-6 flex flex-col items-center justify-center text-center">
                                <div className="text-4xl text-gray-700 mb-4">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                                        <path d="M13.66 7c-.56-1.18-1.76-2-3.16-2H6V3h12v2h-3.26c.48.58.84 1.26 1.05 2H18v2h-2.02c-.25 2.8-2.61 5-5.48 5h-.73l6.73 7h-2.77L7 14v-2h3.5c1.76 0 3.22-1.3 3.46-3H6V7h7.66z" />
                                    </svg>
                                </div>
                                <p className="text-gray-700 text-sm">
                                    Save tax upto Rs. 5000 under section 80D of Income tax act 1961
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <div className="w-full bg-blue-800 text-white text-center py-4 fixed absolute bottom-0 left-0 right-0">
                <p className="text-sm">Copyright © 2025 Thyrocare Technologies Ltd. All rights reserved.</p>
            </div>
        </div>
    );
};

export default PreventiveHealthSection;