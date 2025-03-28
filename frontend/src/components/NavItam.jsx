import React, {useState, useEffect, useRef} from 'react'
import { BsCaretDown, BsCaretUpFill } from "react-icons/bs";

export const NavItem = ({text = '', children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const navItemRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navItemRef.current && !navItemRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClick = () => {
        if (children) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="relative nav-item" ref={navItemRef}>
            <div 
                className="flex items-center space-x-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                onClick={handleClick}
            >
                <span className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                    {text}
                </span>
                {children && (
                    <span className="text-slate-400">
                        {isOpen ? 
                            <BsCaretUpFill className="w-4 h-4"/> : 
                            <BsCaretDown className="w-4 h-4"/>
                        }
                    </span>
                )}
            </div>
            {isOpen && children}
        </div>
    )
}