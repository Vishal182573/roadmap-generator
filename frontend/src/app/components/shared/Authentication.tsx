"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AuthMode = 'signup' | 'login';
type UserType = 'student' | 'mentor';

const AuthForm: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [userType, setUserType] = useState<UserType>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    expertise: '',
    institution: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Form Submitted', { authMode, userType, formData });
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signup' ? 'login' : 'signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {authMode === 'signup' ? 'Sign Up' : 'Log In'}
          </CardTitle>
          <div className="flex justify-center mt-4 space-x-4">
            <Button
              variant={userType === 'student' ? 'default' : 'outline'}
              onClick={() => setUserType('student')}
            >
              Student
            </Button>
            <Button
              variant={userType === 'mentor' ? 'default' : 'outline'}
              onClick={() => setUserType('mentor')}
            >
              Mentor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </div>

            {userType === 'student' && authMode === 'signup' && (
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  name="studentId"
                  type="text"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  placeholder="Enter your student ID"
                />
              </div>
            )}

            {userType === 'mentor' && authMode === 'signup' && (
              <>
                <div>
                  <Label htmlFor="expertise">Area of Expertise</Label>
                  <Input
                    id="expertise"
                    name="expertise"
                    type="text"
                    value={formData.expertise}
                    onChange={handleInputChange}
                    placeholder="Your professional expertise"
                  />
                </div>
                <div>
                  <Label htmlFor="institution">Institution/Company</Label>
                  <Input
                    id="institution"
                    name="institution"
                    type="text"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="Your workplace or institution"
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
              />
            </div>

            {authMode === 'signup' && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <Button type="submit" className="w-full">
              {authMode === 'signup' ? 'Create Account' : 'Log In'}
            </Button>

            <div className="text-center mt-4">
              <Button 
                type="button" 
                variant="link"
                onClick={toggleAuthMode}
              >
                {authMode === 'signup' 
                  ? 'Already have an account? Log In' 
                  : 'Don\'t have an account? Sign Up'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;