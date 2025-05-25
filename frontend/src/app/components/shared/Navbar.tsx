"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Menu, Home, User, Contact, LogOut, CheckCircle, 
  BookOpen, ClipboardList, ChevronDown, X, 
  Map
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    // Track scroll for navbar background
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const NavLinks = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/about', icon: BookOpen, label: 'About Us' },
    { href: '/contact', icon: Contact, label: 'Contact' }
  ];

  const ProfileLinks = [
    { href: '/dashboard', icon: User, label: 'My Profile', color: 'text-blue-700' },
    { href: '/roadmap', icon: Map, label: 'My Roadmaps', color: 'text-red-600' },
    { href: '/progress', icon: CheckCircle, label: 'Check Progress', color: 'text-blue-600' },
    { href: '/mentorship', icon: BookOpen, label: 'Mentorship', color: 'text-green-600' },
    { href: '/quizzes', icon: ClipboardList, label: 'Quizzes', color: 'text-purple-600' },
    { href: '/assignments', icon: ClipboardList, label: 'Assignments', color: 'text-orange-600' },
  ];

  return (
    <nav 
      className={`
        sticky w-full z-50 top-0 left-0 transition-all duration-300 ease-in-out
        ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-2xl' : 'bg-white/90'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Main Navigation */}
          <div className="flex items-center space-x-10">
            <Link 
              href="/" 
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              DevPathFinder
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              {NavLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="group text-gray-700 hover:text-blue-600 flex items-center space-x-2 transition duration-300 ease-in-out hover:translate-x-1 hover:scale-105"
                >
                  <link.icon 
                    className="group-hover:text-blue-600 transition duration-300" 
                    size={20} 
                  /> 
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center bg-blue-50 text-blue-800 px-4 py-2 rounded-full hover:bg-blue-100 transition duration-300 group"
            >
              <User className="mr-2 group-hover:rotate-12 transition duration-300" size={20} /> 
              Profile 
              <ChevronDown 
                className={`ml-2 transition duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                size={16} 
              />
            </button>
            
            <AnimatePresence>
              {isProfileDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-4 w-72 rounded-2xl shadow-2xl bg-white ring-2 ring-blue-100 overflow-hidden"
                >
                  <div className="py-2">
                    {ProfileLinks.map((link) => (
                      <Link 
                        key={link.href}
                        href={link.href} 
                        className={`
                          flex items-center px-6 py-3 text-sm 
                          ${link.color} hover:bg-gray-100 
                          transition duration-300 ease-in-out
                          hover:translate-x-2 hover:bg-blue-50
                        `}
                      >
                        <link.icon className="mr-3" size={18} /> 
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 my-2"></div>
                    <div
                      onClick={() => {localStorage.clear(); window.location.href = '/Auth'}}
                      className="flex items-center px-6 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 transition duration-300 hover:cursor-pointer"
                    >
                      <LogOut className="mr-3" size={18} /> 
                      <span className="font-medium">Logout</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-blue-50 text-blue-700 inline-flex items-center justify-center p-2 rounded-full hover:bg-blue-100 focus:outline-none transition duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white rounded-2xl shadow-2xl"
            >
              <div className="px-4 pt-4 pb-6 space-y-2">
                {NavLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 block px-4 py-3 rounded-xl flex items-center space-x-3 transition duration-300 ease-in-out"
                  >
                    <link.icon className="text-blue-600" size={20} /> 
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}

                {/* Mobile Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="w-full text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 block px-4 py-3 rounded-xl flex items-center justify-between transition duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <User className="text-blue-600" size={20} /> 
                      <span className="font-medium">Profile</span>
                    </div>
                    <ChevronDown 
                      className={`text-blue-600 transition duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                      size={16} 
                    />
                  </button>
                  
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-6 space-y-3 mt-2"
                      >
                        {ProfileLinks.map((link) => (
                          <Link 
                            key={link.href}
                            href={link.href} 
                            className={`
                              flex items-center text-sm 
                              ${link.color} hover:translate-x-2 
                              transition duration-300
                            `}
                          >
                            <link.icon className="mr-3" size={16} /> 
                            <span className="font-medium">{link.label}</span>
                          </Link>
                        ))}
                        <div 
                          onClick={() => {localStorage.clear(); window.location.href = '/Auth'}}
                          className="flex items-center text-sm text-red-600 hover:text-red-800 hover:translate-x-2 transition duration-300"
                        >
                          <LogOut className="mr-3" size={16} /> 
                          <span className="font-medium">Logout</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;