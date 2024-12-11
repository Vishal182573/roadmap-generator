import React from 'react';
import Link from 'next/link';
import { Twitter, Linkedin, Github, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-16">
      <div className="container mx-auto max-w-6xl grid md:grid-cols-3 gap-12 px-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Send className="text-blue-400" size={28} />
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              RoadmapPro
            </h3>
          </div>
          <p className="text-gray-300 leading-relaxed">
            Create, share, and collaborate on your learning and project roadmaps with intuitive tools designed to accelerate your personal and professional growth.
          </p>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-blue-300 border-b border-blue-800 pb-3">Quick Links</h4>
          <ul className="space-y-4">
            {[
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
              { href: "/privacy", label: "Privacy Policy" }
            ].map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className="text-gray-200 hover:text-blue-300 hover:translate-x-2 transition duration-300 flex items-center space-x-2 group"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <span className="font-medium">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-blue-300 border-b border-blue-800 pb-3">Connect</h4>
          <div className="flex space-x-6">
            {[
              { icon: Twitter, href: "/X.com", color: "text-blue-400 hover:text-blue-300" },
              { icon: Linkedin, href: "linkdin.com", color: "text-blue-500 hover:text-blue-400" },
              { icon: Github, href: "github.com", color: "text-gray-300 hover:text-white" }
            ].map((social) => (
              <a 
                key={social.href} 
                href={social.href} 
                className={`${social.color} transition duration-300 transform hover:-translate-y-1 hover:scale-110`}
              >
                <social.icon size={28} />
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-center mt-12 pt-8 border-t border-gray-800">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} RoadmapPro. All rights reserved.
          <span className="block text-xs text-gray-500 mt-2">
            Empowering learners, one roadmap at a time.
          </span>
        </p>
      </div>
    </footer>
  );
}