"use client";
import React from "react";
import Navbar from "@/app/components/shared/Navbar";
import Footer from "@/app/components/shared/Footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-blue-50">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full bg-white/90 rounded-3xl shadow-2xl p-10 grid md:grid-cols-2 gap-12 items-center">
          {/* Images Section */}
          <div className="flex flex-col items-center space-y-6">
            <img src="/about-illustration-1.png" alt="Our Team" className="w-48 h-48 object-contain rounded-xl shadow-lg" />
            <img src="/about-illustration-2.png" alt="Our Mission" className="w-32 h-32 object-contain rounded-xl shadow-md" />
          </div>
          {/* Content Section */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-blue-700 mb-2">About Us</h2>
            <p className="text-lg text-gray-700">
              <span className="font-semibold text-blue-600">RoadmapPro</span> is dedicated to empowering learners and professionals by providing intuitive tools to create, share, and collaborate on personalized learning and project roadmaps. Our mission is to make growth accessible, structured, and enjoyable for everyone.
            </p>
            <p className="text-gray-600">
              Founded by a passionate team of educators, developers, and designers, we believe in the power of community-driven learning. Whether you're a student, mentor, or lifelong learner, our platform is designed to help you achieve your goals efficiently.
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Personalized learning paths</li>
              <li>Collaborative project planning</li>
              <li>Mentorship and peer support</li>
              <li>Progress tracking and analytics</li>
            </ul>
            <p className="text-gray-600">
              Join us on our journey to revolutionize the way people learn and grow. Together, we can build a brighter future—one roadmap at a time.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
