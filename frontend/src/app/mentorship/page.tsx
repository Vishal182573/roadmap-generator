import React from 'react';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import MentorPage from '../components/shared/MentorPage';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="w-full">
        <div className="w-full ">
          <MentorPage/>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}