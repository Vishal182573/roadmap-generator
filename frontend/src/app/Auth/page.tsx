import React from 'react';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import AuthForm from '../components/shared/Authentication';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="w-full ">
          < AuthForm/>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}