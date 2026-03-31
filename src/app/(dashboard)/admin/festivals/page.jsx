"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminFestivals() {
  const [festivals, setFestivals] = useState([
    {
      id: 1,
      name: "The 2026 Film and Video Poetry Symposium",
      logo: "/assets/download-1.webp",
      deadline: "2026-05-15",
      status: "open",
      location: "Los Angeles, CA",
    },
    // Add more festivals
  ]);

  const handleDelete = (id) => {
    if (confirm("Delete this festival?")) {
      setFestivals(festivals.filter(f => f.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Festivals</h1>
            <p className="text-gray-600 mt-1">Add, edit, or remove film festivals</p>
          </div>
          <Link
            href="/admin/festivals/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Festival
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {festivals.map((festival) => (
            <div key={festival.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-40 bg-gray-100 relative">
                <Image
                  src={festival.logo}
                  alt={festival.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{festival.name}</h3>
                <p className="text-sm text-gray-600 mb-1">📍 {festival.location}</p>
                <p className="text-sm text-gray-600 mb-3">📅 Deadline: {festival.deadline}</p>
                <div className="flex gap-2">
                  <button className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(festival.id)}
                    className="flex-1 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}