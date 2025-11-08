import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

interface DropdownItem {
    icon: string;
    label: string;
    onClick: () => void;
    className?: string;
}

interface DropdownMenuProps {
    items: DropdownItem[];
    trigger?: React.ReactNode;
    className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
    items,
    trigger,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleItemClick = (item: DropdownItem, event: React.MouseEvent) => {
        event.stopPropagation();
        item.onClick();
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isOpen]);

    const defaultTrigger = (
        <button 
            className="w-8 h-8 p-1 border rounded-full border-gray-300 hover:bg-gray-100 hover:text-primary-01 flex items-center justify-center transition-colors"
            onClick={handleToggle}
        >
            <Icon name="more" className="w-4 h-4" />
        </button>
    );

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {trigger ? (
                <div onClick={handleToggle}>
                    {trigger}
                </div>
            ) : (
                defaultTrigger
            )}
            
            {isOpen && (
                <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                        {items.map((item, index) => (
                            <button
                                key={index}
                                className={`w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 ${item.className || ''}`}
                                onClick={(e) => handleItemClick(item, e)}
                            >
                                <Icon name={item.icon} className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
