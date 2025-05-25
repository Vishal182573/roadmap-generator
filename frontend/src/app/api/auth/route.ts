import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User, { Student, Mentor, IStudent, IMentor } from '@/models/User';
import { generateToken } from '@/lib/auth';

// Helper to parse and validate request data
async function parseRequestData(req: NextRequest) {
  try {
    return await req.json();
  } catch (error) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if it's a login or signup request
    const url = new URL(req.url);
    const authType = url.searchParams.get('type');
    
    if (!authType || (authType !== 'login' && authType !== 'signup')) {
      return NextResponse.json(
        { success: false, message: 'Invalid auth type. Use login or signup.' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    const data = await parseRequestData(req);
    
    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Handle login
    if (authType === 'login') {
      return handleLogin(data);
    }
    
    // Handle signup
    return handleSignup(data);
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

async function handleLogin(data: any) {
  const { email, password } = data;
  
  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: 'Email and password are required' },
      { status: 400 }
    );
  }
  
  // Find the user by email
  const user = await User.findOne({ email });
  
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    );
  }
  
  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    );
  }
  
  // Generate JWT token
  const token = generateToken(user);
  
  // Return user data and token
  return NextResponse.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }
  });
}

async function handleSignup(data: any) {
  const { name, email, password, confirmPassword, role } = data;
  console.log('Signup data:', data);
  
  // Basic validation
  if (!name || !email || !password || !confirmPassword || !role) {
    return NextResponse.json(
      { success: false, message: 'All fields are required' },
      { status: 400 }
    );
  }
  
  if (password !== confirmPassword) {
    return NextResponse.json(
      { success: false, message: 'Passwords do not match' },
      { status: 400 }
    );
  }
  
  if (role !== 'student' && role !== 'mentor') {
    return NextResponse.json(
      { success: false, message: 'Invalid user role' },
      { status: 400 }
    );
  }
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  
  if (existingUser) {
    return NextResponse.json(
      { success: false, message: 'Email already in use' },
      { status: 409 }
    );
  }
  
  try {
    // Create base user data - don't specify role here, let the model handle it
    const baseUserData = {
      name,
      email,
      password
    };

    // Add role-specific fields
    let userData: any = { ...baseUserData };
    let newUser;
    
    if (role === 'student') {
      const { studentId } = data;
      userData = {
        ...userData,
        studentId
      };
      // Create student with the student model
      newUser = new Student(userData);
    } else { // mentor
      const { expertise, qualifications, institution, description, hourlyRate = 0 } = data;
      
      // Validate mentor-specific fields
      if (!expertise || !qualifications || !institution || !description) {
        return NextResponse.json(
          { success: false, message: 'All mentor fields are required' },
          { status: 400 }
        );
      }
      
      userData = {
        ...userData,
        expertise: Array.isArray(expertise) ? expertise : [expertise],
        qualifications: Array.isArray(qualifications) ? qualifications : [qualifications],
        institution,
        description,
        hourlyRate: parseFloat(hourlyRate),
        profileImage: data.profileImage || '/api/placeholder/200/200',
        rating: 0,
        studentsmentored: 0,
        students: []
      };
      // Create mentor with the mentor model
      newUser = new Mentor(userData);
    }
    
    // Save the new user
    await newUser.save();
    
    // Generate JWT token
    const token = generateToken(newUser);
    
    // Return user data and token
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        },
        token
      }
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Registration failed',
        error: error.toString()
      },
      { status: 500 }
    );
  }
}