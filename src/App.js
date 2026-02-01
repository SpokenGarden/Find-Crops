import React, { useState } from 'react';

const App = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [placeholderText, setPlaceholderText] = useState("Select an option...");

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        setPlaceholderText(option);
        setIsOpen(false);
    };

    return (
        <div>
            <div className="dropdown" onClick={toggleDropdown}>
                {placeholderText}
            </div>
            {isOpen && (
                <div className="dropdown-menu">
                    <div onClick={() => handleOptionClick("Option 1")}>Option 1</div>
                    <div onClick={() => handleOptionClick("Option 2")}>Option 2</div>
                    <div onClick={() => handleOptionClick("Option 3")}>Option 3</div>
                </div>
            )}
        </div>
    );
};

export default App;