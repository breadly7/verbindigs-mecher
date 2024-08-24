import { useState } from 'react';

const Accordion = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="border-b border-gray-200">
            <button
                className="w-full text-left py-4 px-6 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                onClick={toggleAccordion}
            >
                <div className="flex justify-between items-center">
                    <span>{title}</span>
                    <span>{isOpen ? '-' : '+'}</span>
                </div>
            </button>
            {isOpen && (
                <div className="px-6 py-4 bg-white">
                    {children}
                </div>
            )}
        </div>
    );
};

export default Accordion;