"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const Login = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            try {
                const userData = JSON.parse(user);
                // Redirect based on role
                if (userData.role === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                router.push('/dashboard');
            }
        }
    }, [router]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            console.log('Sending login request to:', `${API_URL}/api/auth/login`);
            console.log('Request body:', { email: formData.email, password: '***' });
            
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (data.success) {
                // Store the token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // If remember me is checked, set a flag
                if (formData.rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }
                
                console.log('Login successful! User role:', data.user.role);
                
                // Redirect based on user role
                if (data.user.role === 'admin') {
                    console.log('Redirecting to admin dashboard...');
                    router.push('/admin/dashboard');
                } else {
                    console.log('Redirecting to user dashboard...');
                    router.push('/dashboard');
                }
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please make sure the server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="py-6 px-4">
                <div className="grid lg:grid-cols-2 items-center gap-6 max-w-6xl w-full">
                    <div className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-lg:mx-auto">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="mb-12">
                                <h1 className="text-slate-900 text-3xl font-semibold">Sign in</h1>
                                <p className="text-slate-600 text-[15px] mt-6 leading-relaxed">
                                    Sign in to your account and explore a world of possibilities. Your journey begins here.
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Success Message */}
                            {successMessage && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-green-600 text-sm">{successMessage}</p>
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block">
                                    Email Address
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600 focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your email address"
                                        disabled={isLoading}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                                        <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                        <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block">
                                    Password
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600 focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 focus:outline-none"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px]" viewBox="0 0 128 128">
                                            <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="rememberMe"
                                        type="checkbox"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                    />
                                    <label className="ml-3 block text-sm text-slate-900">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <Link href="/forgot-password" className="text-blue-600 hover:underline font-medium">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="!mt-12">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Signing in...
                                        </span>
                                    ) : (
                                        'Sign in'
                                    )}
                                </button>

                                <p className="text-sm !mt-6 text-center text-slate-600">
                                    Don't have an account?
                                    <Link href="/register" className="text-blue-600 font-medium hover:underline ml-1 whitespace-nowrap">
                                        Register here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    <div className="max-lg:mt-8">
                        <img
                            src="https://readymadeui.com/login-image.webp"
                            className="w-full aspect-[71/50] max-lg:w-4/5 mx-auto block object-cover"
                            alt="login illustration"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;