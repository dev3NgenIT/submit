"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const AvatarDropdown = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const dropdownRef = useRef(null);

    // Get user data from localStorage
    useEffect(() => {
        const getUserData = () => {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const userData = JSON.parse(userStr);
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error getting user data:', error);
            }
        };

        getUserData();
    }, []);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Get initials from name (supports 2 words)
    const getInitials = (name) => {
        if (!name) return 'U';
        
        const nameParts = name.trim().split(' ');
        if (nameParts.length >= 2) {
            // Get first letter of first word and first letter of last word
            return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
        }
        // If only one word, take first two letters or just first letter
        return nameParts[0].substring(0, 2).toUpperCase();
    };

    // Generate random background color based on name
    const getAvatarColor = (name) => {
        if (!name) return 'from-blue-500 to-purple-600';
        
        const colors = [
            'from-blue-500 to-blue-600',
            'from-green-500 to-green-600',
            'from-purple-500 to-purple-600',
            'from-red-500 to-red-600',
            'from-yellow-500 to-yellow-600',
            'from-pink-500 to-pink-600',
            'from-indigo-500 to-indigo-600',
            'from-teal-500 to-teal-600'
        ];
        
        // Use name to consistently get same color
        const index = name.length % colors.length;
        return colors[index];
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Optional: Call logout API to invalidate token on server
            if (token) {
                try {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/logout`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                } catch (error) {
                    console.error('Logout API error:', error);
                    // Continue with logout even if API fails
                }
            }
            
            // Clear all auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('rememberMe');
            
            // Close dropdown
            setIsOpen(false);
            
            // Redirect to login page
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Force redirect even if there's an error
            router.push('/login');
        }
    };

    const menuItems = [
        { name: "Dashboard", href: "/dashboard", icon: "📊" },
        { name: "Profile", href: "/profile", icon: "👤" },
        { name: "Settings", href: "/settings", icon: "⚙️" },
    ];

    // Get user display name
    const displayName = user?.name || user?.fullName || user?.username || 'User';
    const userEmail = user?.email || '';
    const userAvatar = user?.avatar || user?.profileImage;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 focus:outline-none group"
            >
                {/* Avatar */}
                {userAvatar ? (
                    <div className="w-8 h-8 rounded-full ring-2 ring-gray-200 group-hover:ring-blue-400 transition-all overflow-hidden">
                        <Image
                            src={userAvatar}
                            alt={displayName}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className={`w-8 h-8 rounded-full ring-2 ring-gray-200 group-hover:ring-blue-400 transition-all bg-gradient-to-r ${getAvatarColor(displayName)} flex items-center justify-center`}>
                        <span className="text-white text-sm font-medium">
                            {getInitials(displayName)}
                        </span>
                    </div>
                )}
                
                {/* Dropdown Arrow */}
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {displayName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {userEmail}
                        </p>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                    
                    {/* Logout Button */}
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <span className="text-lg">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default AvatarDropdown;