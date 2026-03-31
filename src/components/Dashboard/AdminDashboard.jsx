"use client";

import Link from "next/link";

export default function AdminDashboard() {
  const adminStats = [
    { label: "Total Users", value: "1,234", icon: "👥", color: "blue" },
    { label: "Total Festivals", value: "45", icon: "🎬", color: "purple" },
    { label: "Total Submissions", value: "567", icon: "📄", color: "green" },
    { label: "Pending Reviews", value: "23", icon: "⏳", color: "yellow" },
  ];

  const adminSections = [
    { title: "User Management", description: "Manage all registered users", href: "/admin/users", icon: "👥", color: "blue" },
    { title: "Festival Management", description: "Add, edit, or remove festivals", href: "/admin/festivals", icon: "🎬", color: "purple" },
    { title: "All Submissions", description: "Review all project submissions", href: "/admin/submissions", icon: "📄", color: "green" },
    { title: "Analytics", description: "View platform analytics", href: "/admin/analytics", icon: "📊", color: "orange" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your platform from one central hub</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`bg-${stat.color}-50 p-3 rounded-full text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminSections.map((section, index) => (
            <Link
              key={index}
              href={section.href}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition group"
            >
              <div className="flex items-start gap-4">
                <div className={`bg-${section.color}-50 p-3 rounded-full text-2xl`}>
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}