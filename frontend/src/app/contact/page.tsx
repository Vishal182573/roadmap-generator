"use client";
import React from "react";
import Navbar from "@/app/components/shared/Navbar";
import Footer from "@/app/components/shared/Footer";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full bg-white/90 rounded-3xl shadow-2xl p-8 grid md:grid-cols-2 gap-12 items-center">
          {/* Images Section */}
          <div className="flex flex-col items-center space-y-6">
            <img src="/contact-illustration-1.png" alt="Contact Us" className="w-48 h-48 object-contain rounded-xl shadow-lg" />
            <img src="/contact-illustration-2.png" alt="Support" className="w-32 h-32 object-contain rounded-xl shadow-md" />
          </div>
          {/* Form Section */}
          <form className="space-y-6 w-full">
            <h2 className="text-3xl font-bold text-blue-700 mb-2">Contact Us</h2>
            <p className="text-gray-500 mb-4">Have a question or feedback? Fill out the form below and we'll get back to you soon.</p>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="name" name="name" required className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" required className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" name="message" rows={4} required className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <button type="submit" className="w-full py-3 px-6 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition duration-300">Send Message</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
