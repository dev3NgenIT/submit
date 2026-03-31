"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, isAuthenticated } from '@/utils/auth';

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = getToken();
            const userStr = localStorage.getItem('user');
            
            if (!token || !userStr) {
                router.push('/login');
                return;
            }
            
            try {
                const userData = JSON.parse(userStr);
                if (userData.role !== 'admin') {
                    router.push('/dashboard');
                    return;
                }
                setUser(userData);
            } catch (error) {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        
        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Admin Dashboard
                </h1>
                <p className="text-gray-600">
                    Welcome back, {user?.name}! This is the admin dashboard.
                </p>
                
                {/* Admin-specific content */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Total Users
                        </h3>
                        <p className="text-3xl font-bold text-blue-600">0</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Total Projects
                        </h3>
                        <p className="text-3xl font-bold text-green-600">0</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Active Users
                        </h3>
                        <p className="text-3xl font-bold text-purple-600">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}