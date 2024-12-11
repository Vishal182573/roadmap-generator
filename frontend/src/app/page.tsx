import React from 'react';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import RoadmapBuilder from './components/shared/RoadmapBuilder';
import RoadmapLibrary from './components/shared/RoadmapLibrary';
import CollaborationSpace from './components/shared/CollaborationSpace';
import RoadmapAnalytics from './components/shared/RoadmapAnalytics';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="w-full ">
          <RoadmapBuilder />
        </div>
        
        <div className="mt-12">
          <CollaborationSpace />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}