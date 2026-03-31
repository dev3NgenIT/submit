"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, isAuthenticated, removeToken } from '@/utils/auth';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalProjects: 0,
        completedTasks: 0,
        pendingTasks: 0,
        contributions: 0
    });

    // Get backend URL and ensure no double /api
    let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    // Remove trailing /api if present
    API_URL = API_URL.replace(/\/api$/, '');

    console.log('API_URL:', API_URL); // Should show http://localhost:5000

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!isAuthenticated()) {
                    router.push('/login');
                    return;
                }

                const token = getToken();
                if (!token) {
                    router.push('/login');
                    return;
                }

                console.log('Fetching from:', `${API_URL}/api/users/profile`);

                // Fetch user profile
                const profileResponse = await fetch(`${API_URL}/api/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Response status:', profileResponse.status);

                if (!profileResponse.ok) {
                    if (profileResponse.status === 401) {
                        removeToken();
                        router.push('/login');
                        return;
                    }
                    const errorData = await profileResponse.json();
                    throw new Error(errorData.message || 'Failed to fetch user data');
                }

                const profileData = await profileResponse.json();
                console.log('Profile data:', profileData);

                // Transform user data
                const userData = {
                    id: profileData.user._id,
                    username: profileData.user.name,
                    fullName: profileData.user.name,
                    email: profileData.user.email,
                    avatar: profileData.user.profileImage,
                    role: profileData.user.role,
                    isActive: profileData.user.isActive
                };

                setUser(userData);

                // Fetch user stats
                const statsResponse = await fetch(`${API_URL}/api/users/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (statsResponse.ok) {
                    const statsData = await statsResponse.json();
                    setStats(statsData.data);
                }

            } catch (err) {
                setError(err.message);
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-2xl">
                    <div className="text-red-600 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-600 mb-4">{error}</p>

                    {/* Debug Information */}
                    <div className="mt-4 p-4 bg-gray-100 rounded text-left">
                        <h3 className="font-bold mb-2">Debug Information:</h3>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(debug, null, 2)}
                        </pre>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <p>No user data found. Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Welcome back, {user.fullName || user.username}!
                    </h2>
                    <p className="text-gray-600">
                        Here's what's happening with your account today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
                            </div>
                            <div className="bg-blue-100 rounded-full p-3">
                                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.completedTasks}</p>
                            </div>
                            <div className="bg-green-100 rounded-full p-3">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.pendingTasks}</p>
                            </div>
                            <div className="bg-yellow-100 rounded-full p-3">
                                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Contributions</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.contributions}</p>
                            </div>
                            <div className="bg-purple-100 rounded-full p-3">
                                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                            <span className="text-sm font-medium text-gray-600">Username</span>
                            <span className="text-sm text-gray-900">{user.username}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                            <span className="text-sm font-medium text-gray-600">Email</span>
                            <span className="text-sm text-gray-900">{user.email}</span>
                        </div>
                        {user.fullName && (
                            <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                                <span className="text-sm font-medium text-gray-600">Full Name</span>
                                <span className="text-sm text-gray-900">{user.fullName}</span>
                            </div>
                        )}
                        {user.role && (
                            <div className="flex flex-col sm:flex-row sm:justify-between py-2">
                                <span className="text-sm font-medium text-gray-600">Role</span>
                                <span className="text-sm text-gray-900 capitalize">{user.role}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}