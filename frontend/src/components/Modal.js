import React, { useEffect, useState } from 'react';
import '../index.css';

const Modal = ({ isOpen, onClose, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !isVisible) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'modal-visible' : ''}`}>
            <div className={`modal-container ${isOpen ? 'modal-content-visible' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default Modal;