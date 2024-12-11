import React from 'react';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import AssignmentPage from '../components/shared/Assignment';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="w-full">
          <AssignmentPage/>
      </main>
      
      <Footer />
    </div>
  );
}