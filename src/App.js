import React, { useState, useEffect } from 'react';
import UserList from './components/UserList';
import './index.css';

const App = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`app ${darkMode ? 'dark' : ''}`}>
            <button 
                className="dark-mode-toggle" 
                onClick={toggleDarkMode}
            >
                {darkMode ? '☀️' : '🌙'}
            </button>
            <UserList />
        </div>
    );
};

export default App;