import React from 'react'; // Assuming React is used based on the component structure
import { NavLink } from 'react-router-dom';
// It's good practice to import useEffect and useState if you plan to add interactivity later
// import { useEffect, useState } from 'react';

// You might need to import a Link component if using a framework like Next.js or React Router
// import Link from 'next/link'; // Example for Next.js

export default function Landing() {

    // Placeholder for potential future state or effects (e.g., for mobile menu toggle)
    // const [isMenuOpen, setIsMenuOpen] = useState(false);
    // useEffect(() => {
    //  // Logic to handle accordion/mobile menu interactions if needed,
    //  // potentially using a library like Flowbite's JS or custom logic.
    // }, []);

    return (
        <div className="bg-white text-gray-800"> {/* Set base colors */}
            {/* Header: Updated Branding and CTAs */}
            <header className="fixed w-full z-50"> {/* Added z-index */}
                <nav className="bg-white border-gray-200 py-2.5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
                        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse"> {/* Added space-x */}
                            {/* Placeholder Logo - Replace src with your actual logo */}
                            <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900">SentraVault</span> {/* Increased text size */}
                        </a>
                        <div className="flex items-center lg:order-2">
                            <div className="hidden mr-4 sm:inline-block">
                                {/* Use Link component if using React Router/Next.js */}
                                <a href="/login" className="text-gray-600 hover:text-gray-700 px-4 py-2 text-sm font-medium">Login</a>
                            </div>

                            <NavLink to="/register"
                                className="inline-flex items-center justify-center w-full px-5 py-3 text-base font-medium text-center text-white bg-gray-700 rounded-lg sm:w-auto hover:bg-gray-800 focus:ring-4 focus:ring-gray-300">
                                Register
                            </NavLink>
                            {/* Mobile Menu Button - Needs JS to function */}
                            <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="mobile-menu-2" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                {/* Hamburger Icon */}
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                                {/* Close Icon (hidden by default) */}
                                <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                        </div>
                        {/* Mobile Menu Content - Needs JS to show/hide */}
                        <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                                <li>
                                    <a href="#features" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-700 lg:p-0">Features</a>
                                </li>
                                <li>
                                    <a href="#security" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-700 lg:p-0">Security</a>
                                </li>
                                <li>
                                    <a href="#use-cases" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-700 lg:p-0">Use Cases</a>
                                </li>
                                {/* Add other relevant links */}
                                <li>
                                    <a href="#faq" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-700 lg:p-0">FAQ</a>
                                </li>
                                <li>
                                    <a href="#contact" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-700 lg:p-0">Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Hero Section: Re-written for SentraVault */}
            <section className="bg-white pt-24 lg:pt-32"> {/* Adjusted padding top */}
                <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
                    <div className="mr-auto place-self-center lg:col-span-7">
                        <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl text-gray-900">
                            Secure, Context-Aware AI for Your Enterprise Data
                        </h1>
                        <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">
                            SentraVault delivers accurate, RAG-powered answers from your private multimodal data. Integrate seamlessly with Notion, Dropbox, and GDrive, ensure strict access control, and enhance user experience with dynamic UI responses.
                        </p>
                        <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                            <NavLink to="/register"
                                className="inline-flex items-center justify-center w-full px-5 py-3 text-base font-medium text-center text-white bg-gray-700 rounded-lg sm:w-auto hover:bg-gray-800 focus:ring-4 focus:ring-gray-300">
                                Register
                            </NavLink>
                            <a href="#features"
                                className="inline-flex items-center justify-center w-full px-5 py-3 mb-2 mr-2 text-base font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:w-auto focus:outline-none hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-4 focus:ring-gray-200">
                                Learn More
                            </a>
                        </div>
                    </div>
                    <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                        {/* Replace with a relevant image showcasing secure data/AI interaction */}
                        <img src="https://amaris.com/wp-content/uploads/2020/07/Business-applications-processes.png" />
                    </div>
                </div>
            </section>

            {/* Removed Client Logos Section */}

            {/* Features Section: Re-written for SentraVault */}
            <section id="features" className="bg-gray-50"> {/* Light background for contrast */}
                <div className="max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:py-24 lg:px-6">

                    {/* Feature 1: Data Ingestion & Integration */}
                    <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
                        <div className="text-gray-600 sm:text-lg">
                            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900">
                                Unified Data Ingestion & Integration
                            </h2>
                            <p className="mb-8 font-light lg:text-xl">
                                Connect SentraVault directly to your existing knowledge hubs like Notion, Dropbox, and Google Drive. Seamlessly ingest and index diverse data types—PDFs, documents, images, and more—to build a comprehensive, centralized knowledge base.
                            </p>
                            <ul role="list" className="pt-8 space-y-5 border-t border-gray-200 my-7">
                                <li className="flex space-x-3">
                                    <svg className="flex-shrink-0 w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                    <span className="text-base font-medium leading-tight text-gray-900">Direct 3rd-Party Integrations (Notion, Dropbox, GDrive)</span>
                                </li>
                                <li className="flex space-x-3">
                                    <svg className="flex-shrink-0 w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                    <span className="text-base font-medium leading-tight text-gray-900">Multimodal Data Support (Text, PDF, Images, etc.)</span>
                                </li>
                                <li className="flex space-x-3">
                                    <svg className="flex-shrink-0 w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                    <span className="text-base font-medium leading-tight text-gray-900">Admin Controls for Knowledge Base Management</span>
                                </li>
                            </ul>
                            <p className="font-light lg:text-xl">
                                Users can contribute data, while administrators maintain full control over the knowledge base integrity and relevance.
                            </p>
                        </div>
                        {/* Replace with a relevant image showing data sources connecting to a central hub */}
                        <img className="hidden w-full mb-4 rounded-lg lg:mb-0 lg:flex shadow-lg" src="https://images.unsplash.com/photo-1587614295999-6c1c13675117?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Data Integration Feature" />
                    </div>

                    {/* Feature 2: Secure RAG & Enhanced UI */}
                    <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
                        <img className="hidden w-full mb-4 rounded-lg lg:mb-0 lg:flex shadow-lg" src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80" alt="Secure AI Chat Feature" />
                        <div className="text-gray-600 sm:text-lg">
                            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900">
                                Intelligent RAG with Enhanced UI & Security
                            </h2>
                            <p className="mb-8 font-light lg:text-xl">
                                Leverage a sophisticated RAG pipeline that retrieves the most relevant information chunks to generate accurate, context-rich answers. Our automated permission model ensures users only access data they're authorized to see.
                            </p>
                            <ul role="list" className="pt-8 space-y-5 border-t border-gray-200 my-7">
                                <li className="flex space-x-3">
                                    <svg className="flex-shrink-0 w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                    <span className="text-base font-medium leading-tight text-gray-900">Automated Role-Based Permission Control</span>
                                </li>
                                <li className="flex space-x-3">
                                    <svg className="flex-shrink-0 w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                    <span className="text-base font-medium leading-tight text-gray-900">Context-Rich, Domain-Specific Answers</span>
                                </li>
                                <li className="flex space-x-3">
                                    <svg className="flex-shrink-0 w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                    <span className="text-base font-medium leading-tight text-gray-900">Dynamic, Interactive UI Responses (Beyond Text)</span>
                                </li>
                                <li className="flex space-x-3"> {/* Bonus Feature Highlight */}
                                    <svg className="flex-shrink-0 w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                    <span className="text-base font-medium leading-tight text-gray-900">Generative Document Synthesis & Auto-Suggested Actions</span>
                                </li>
                            </ul>
                            <p className="font-light lg:text-xl">
                                Go beyond simple answers. SentraVault presents information interactively and suggests relevant next steps to streamline workflows.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security Section: Re-framed */}
            <section id="security" className="bg-white">
                <div
                    className="items-center max-w-screen-xl px-4 py-8 mx-auto lg:grid lg:grid-cols-4 lg:gap-16 xl:gap-24 lg:py-24 lg:px-6">
                    <div className="col-span-2 mb-8">
                        <p className="text-lg font-medium text-gray-600">Enterprise-Grade Security</p>
                        <h2 className="mt-3 mb-4 text-3xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
                            Built for Security and Compliance
                        </h2>
                        <p className="font-light text-gray-500 sm:text-xl">
                            Our rigorous security standards are at the heart of SentraVault. We employ automated permission controls and robust data protection measures to ensure your sensitive enterprise information remains secure and accessible only to authorized personnel.
                        </p>
                        <div className="pt-6 mt-6 space-y-4 border-t border-gray-200">
                            <div>
                                <a href="/security-center" // Example Link
                                    className="inline-flex items-center text-base font-medium text-gray-600 hover:text-gray-800">
                                    Visit our Security Center
                                    <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </a>
                            </div>
                            {/* Add more relevant links if needed */}
                        </div>
                    </div>
                    <div className="col-span-2 space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0">
                        <div>
                            <svg className="w-10 h-10 mb-2 text-gray-600 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            <h3 className="mb-2 text-2xl font-bold text-gray-900">Access Control</h3>
                            <p className="font-light text-gray-500">Automated permission model based on role, sensitivity, and history.</p>
                        </div>
                        <div>
                            <svg className="w-10 h-10 mb-2 text-gray-600 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            <h3 className="mb-2 text-2xl font-bold text-gray-900">Data Privacy</h3>
                            <p className="font-light text-gray-500">Designed to handle sensitive information with robust privacy measures.</p>
                        </div>
                        <div>
                            <svg className="w-10 h-10 mb-2 text-gray-600 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            <h3 className="mb-2 text-2xl font-bold text-gray-900">Audit Trails</h3>
                            <p className="font-light text-gray-500">Track usage and access for compliance and monitoring (optional).</p>
                        </div>
                        <div>
                            <svg className="w-10 h-10 mb-2 text-gray-600 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                            <h3 className="mb-2 text-2xl font-bold text-gray-900">Scalable Infra</h3>
                            <p className="font-light text-gray-500">Secure and scalable infrastructure to meet enterprise demands.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial Section: Re-written */}
            <section id="use-cases" className="bg-gray-50"> {/* Light background */}
                <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-24 lg:px-6">
                    <figure className="max-w-screen-md mx-auto">
                        <svg className="h-12 mx-auto mb-3 text-gray-400" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" fill="currentColor" />
                        </svg>
                        <blockquote>
                            <p className="text-xl font-medium text-gray-900 md:text-2xl">
                                "SentraVault revolutionized how our team accesses internal knowledge. The RAG system delivers incredibly accurate answers from our technical docs and reports, and the permission controls give us peace of mind. The interactive UI is a huge plus!"
                            </p>
                        </blockquote>
                        <figcaption className="flex items-center justify-center mt-6 space-x-3">
                            {/* Placeholder Avatar */}
                            <img className="w-6 h-6 rounded-full" src="https://randomuser.me/api/portraits/men/75.jpg" alt="profile picture" />
                            <div className="flex items-center divide-x-2 divide-gray-500">
                                <div className="pr-3 font-medium text-gray-900">Alex Thompson</div>
                                <div className="pl-3 text-sm font-light text-gray-500">Head of Knowledge Management, Global Corp</div>
                            </div>
                        </figcaption>
                    </figure>
                </div>
            </section>

            {/* Pricing Section: Simplified */}
            <section id="pricing" className="bg-white">
                <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-24 lg:px-6">
                    <div className="max-w-screen-md mx-auto mb-8 text-center lg:mb-12">
                        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900">Tailored Solutions for Your Enterprise</h2>
                        <p className="mb-5 font-light text-gray-500 sm:text-xl">SentraVault offers flexible pricing plans designed to meet the unique needs and scale of your organization. Contact us for a custom quote.</p>
                        <a href="/request-demo"
                            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-300">
                            Get Custom Pricing
                        </a>
                    </div>
                    {/* Removed the 3-tier pricing cards */}
                </div>
            </section>

            {/* FAQ Section: Re-written */}
            <section id="faq" className="bg-gray-50"> {/* Light background */}
                <div className="max-w-screen-xl px-4 pb-8 mx-auto lg:pb-24 lg:px-6 ">
                    <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-center text-gray-900 lg:mb-8 lg:text-3xl">
                        Frequently Asked Questions
                    </h2>
                    <div className="max-w-screen-md mx-auto">
                        {/* Accordion needs JS (like Flowbite's) to function */}
                        <div id="accordion-flush" data-accordion="collapse"
                            data-active-classes="bg-white text-gray-900"
                            data-inactive-classes="text-gray-500">
                            {/* FAQ 1 */}
                            <h3 id="accordion-flush-heading-1">
                                <button type="button" className="flex items-center justify-between w-full py-5 font-medium text-left text-gray-900 bg-white border-b border-gray-200" data-accordion-target="#accordion-flush-body-1" aria-expanded="true" aria-controls="accordion-flush-body-1">
                                    <span>What data sources and types does SentraVault support?</span>
                                    <svg data-accordion-icon="" className="w-6 h-6 rotate-180 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </h3>
                            <div id="accordion-flush-body-1" className="" aria-labelledby="accordion-flush-heading-1">
                                <div className="py-5 border-b border-gray-200">
                                    <p className="mb-2 text-gray-500">SentraVault offers direct integrations with popular platforms like Notion, Dropbox, and Google Drive. It supports ingestion of various multimodal data, including text documents (e.g., .txt, .docx), PDFs, and image files (e.g., .jpg, .png). We are continuously expanding our supported formats and integrations.</p>
                                </div>
                            </div>
                            {/* FAQ 2 */}
                            <h3 id="accordion-flush-heading-2">
                                <button type="button" className="flex items-center justify-between w-full py-5 font-medium text-left text-gray-500 border-b border-gray-200" data-accordion-target="#accordion-flush-body-2" aria-expanded="false" aria-controls="accordion-flush-body-2">
                                    <span>How does SentraVault handle data security and access control?</span>
                                    <svg data-accordion-icon="" className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </h3>
                            <div id="accordion-flush-body-2" className="hidden" aria-labelledby="accordion-flush-heading-2">
                                <div className="py-5 border-b border-gray-200">
                                    <p className="mb-2 text-gray-500">Security is paramount. SentraVault features an automated permission classification model that evaluates each user query against defined policies (user role, data sensitivity, etc.) *before* retrieving data. Unauthorized requests are blocked or flagged. Admins have granular control over the knowledge base and user permissions via a dedicated dashboard.</p>
                                </div>
                            </div>
                            {/* FAQ 3 */}
                            <h3 id="accordion-flush-heading-3">
                                <button type="button" className="flex items-center justify-between w-full py-5 font-medium text-left text-gray-500 border-b border-gray-200" data-accordion-target="#accordion-flush-body-3" aria-expanded="false" aria-controls="accordion-flush-body-3">
                                    <span>What does "Enhanced Chatbot UI" mean?</span>
                                    <svg data-accordion-icon="" className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </h3>
                            <div id="accordion-flush-body-3" className="hidden" aria-labelledby="accordion-flush-heading-3">
                                <div className="py-5 border-b border-gray-200">
                                    <p className="mb-2 text-gray-500">Instead of just plain text responses, SentraVault can deliver answers using dynamic UI elements. This could include interactive charts, tables, formatted snippets from documents, image previews, or buttons for suggested actions. This makes information more digestible and actionable for the user.</p>
                                </div>
                            </div>
                            {/* FAQ 4 */}
                            <h3 id="accordion-flush-heading-4">
                                <button type="button" className="flex items-center justify-between w-full py-5 font-medium text-left text-gray-500 border-b border-gray-200" data-accordion-target="#accordion-flush-body-4" aria-expanded="false" aria-controls="accordion-flush-body-4">
                                    <span>Can we use our preferred Large Language Model (LLM)?</span>
                                    <svg data-accordion-icon="" className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </h3>
                            <div id="accordion-flush-body-4" className="hidden" aria-labelledby="accordion-flush-heading-4">
                                <div className="py-5 border-b border-gray-200">
                                    <p className="mb-2 text-gray-500">SentraVault is designed for flexibility. While we offer optimized configurations, our platform can often be integrated with various leading LLMs, including potentially hosting private models depending on your enterprise requirements and infrastructure. Please contact us to discuss specific LLM integration needs.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section: Re-written */}
            <section id="contact" className="bg-white">
                <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
                    <div className="max-w-screen-sm mx-auto text-center">
                        <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900">
                            Ready to Unlock Your Enterprise Knowledge?
                        </h2>
                        <p className="mb-6 font-light text-gray-500 md:text-lg">
                            See SentraVault in action. Request a personalized demo to discover how our secure RAG solution can transform data access for your organization.
                        </p>
                        <a href="/request-demo"
                            className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">
                            Request a Demo
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer: Updated */}
            <footer className="bg-gray-100"> {/* Slightly different background */}
                <div className="max-w-screen-xl p-4 py-6 mx-auto lg:py-16 md:p-8 lg:p-10">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
                        <div>
                            <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Company</h3>
                            <ul className="text-gray-500">
                                <li className="mb-4"><a href="#" className="hover:underline">About Us</a></li>
                                {/* <li className="mb-4"><a href="#" className="hover:underline">Careers</a></li> */}
                                <li className="mb-4"><a href="#" className="hover:underline">Contact Us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Resources</h3>
                            <ul className="text-gray-500">
                                <li className="mb-4"><a href="#features" className="hover:underline">Features</a></li>
                                <li className="mb-4"><a href="#security" className="hover:underline">Security</a></li>
                                <li className="mb-4"><a href="#faq" className="hover:underline">FAQ</a></li>
                                {/* Add link to documentation if available */}
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Legal</h3>
                            <ul className="text-gray-500">
                                <li className="mb-4"><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
                                <li className="mb-4"><a href="/terms" className="hover:underline">Terms of Service</a></li>
                            </ul>
                        </div>
                        {/* Add more columns if needed */}
                        <div></div> {/* Placeholder for alignment */}
                        <div></div> {/* Placeholder for alignment */}
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
                    <div className="text-center">
                        <a href="#" className="flex items-center justify-center mb-5 text-2xl font-semibold text-gray-900 space-x-3">
                            <svg className="h-8 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"></path></svg>
                            <span>SentraVault</span>
                        </a>
                        <span className="block text-sm text-center text-gray-500">
                            © {new Date().getFullYear()} SentraVault™. All Rights Reserved.
                        </span>
                        {/* Optional: Add social links if relevant */}
                        {/* <ul className="flex justify-center mt-5 space-x-5"> ... social icons ... </ul> */}
                    </div>
                </div>
            </footer>
        </div>
    );
}