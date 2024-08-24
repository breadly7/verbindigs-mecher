import { useState } from 'react';

const Accordion = ({ title, itemCount, rightText, isSpecificDay, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="border-b border-gray-200">
            <button
                className="w-full text-left py-4 px-6 bg-blue-200 hover:bg-blue-300 focus:outline-none"
                onClick={toggleAccordion}
            >
                <div className="flex justify-between items-center">
                    <span>{title} {itemCount && `(${itemCount})`}</span>
                    <span>{rightText ? (<span className={"mr-2"}>{rightText}</span>) : ""}{isOpen ? '-' : '+'}</span>
                </div>
            </button>
            {isOpen && (
                <div className={"px-6 py-1 " + (isSpecificDay ? "bg-gray-200" : "bg-gray-50")}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default Accordion;