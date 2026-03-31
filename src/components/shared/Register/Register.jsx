"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const Register = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: 'John Doe',           // Demo data
        email: 'john@example.com',   // Demo data
        password: 'password123',     // Demo data
        confirmPassword: 'password123', // Demo data
        acceptTerms: true            // Demo data
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [useDemo, setUseDemo] = useState(true); // Auto-fill demo data
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/dashboard');
        }
    }, [router]);

    // Fill with demo data
    const fillDemoData = () => {
        setFormData({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            confirmPassword: 'password123',
            acceptTerms: true
        });
    };

    // Fill with another demo user
    const fillAlternateDemo = () => {
        setFormData({
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password456',
            confirmPassword: 'password456',
            acceptTerms: true
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
        if (useDemo) setUseDemo(false);
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (!formData.acceptTerms) {
            setError('Please accept the Terms and Conditions');
            return false;
        }

        return true;
    };

    // Register.jsx
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (data.success) {
                // Store the REAL token from backend
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirect to dashboard
                router.push('/dashboard');
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white">
            <div className="grid lg:grid-cols-2 items-center gap-8 max-w-6xl max-lg:max-w-lg w-full">
                <form onSubmit={handleSubmit} className="lg:max-w-md w-full">
                    <h1 className="text-slate-900 text-3xl font-semibold mb-8">Create an account</h1>

                    {/* Demo Data Buttons */}
                    <div className="mb-6 flex gap-3">
                        <button
                            type="button"
                            onClick={fillDemoData}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded transition"
                        >
                            📝 Fill Demo Data
                        </button>
                        <button
                            type="button"
                            onClick={fillAlternateDemo}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded transition"
                        >
                            👤 Alternate User
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-green-600 text-sm">{successMessage}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="text-slate-900 text-sm mb-2 block font-medium">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="bg-gray-50 w-full text-slate-900 text-sm px-4 py-3 focus:bg-transparent border border-gray-200 focus:border-blue-500 outline-none transition-all rounded-lg"
                                placeholder="Enter your full name"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="text-slate-900 text-sm mb-2 block font-medium">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-gray-50 w-full text-slate-900 text-sm px-4 py-3 focus:bg-transparent border border-gray-200 focus:border-blue-500 outline-none transition-all rounded-lg"
                                placeholder="Enter your email"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="text-slate-900 text-sm mb-2 block font-medium">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="bg-gray-50 w-full text-slate-900 text-sm px-4 py-3 pr-12 focus:bg-transparent border border-gray-200 focus:border-blue-500 outline-none transition-all rounded-lg"
                                    placeholder="Create a password (min. 6 characters)"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="text-slate-900 text-sm mb-2 block font-medium">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="bg-gray-50 w-full text-slate-900 text-sm px-4 py-3 pr-12 focus:bg-transparent border border-gray-200 focus:border-blue-500 outline-none transition-all rounded-lg"
                                    placeholder="Confirm your password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start gap-2">
                            <input
                                id="acceptTerms"
                                name="acceptTerms"
                                type="checkbox"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                className="h-4 w-4 shrink-0 border-gray-300 rounded mt-0.5 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="acceptTerms" className="text-sm text-slate-600">
                                I accept the{' '}
                                <Link href="/terms" className="text-blue-600 font-semibold hover:underline">
                                    Terms and Conditions
                                </Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-blue-600 font-semibold hover:underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-6 text-sm font-medium tracking-wide text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </div>

                    <p className="text-sm text-slate-600 mt-6 text-center">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 font-semibold hover:underline ml-1">
                            Login here
                        </Link>
                    </p>
                </form>

                <div className="h-full">
                    <img
                        src="https://readymadeui.com/login-image.webp"
                        className="w-full h-full object-contain aspect-[628/516]"
                        alt="Registration illustration"
                    />
                </div>
            </div>
        </div>
    );
};

export default Register;