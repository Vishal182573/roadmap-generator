import React from 'react';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import RoadmapAnalytics from '../components/shared/RoadmapAnalytics';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
          <RoadmapAnalytics />
      </main>
      
      <Footer />
    </div>
  );
}