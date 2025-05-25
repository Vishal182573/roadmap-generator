// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User, { Student, Mentor } from '@/models/User';
import { requireAuth } from '@/lib/auth';
import bcrypt from 'bcrypt';

// Get user profile
export async function GET(req: NextRequest) {
  try {
    // Check if the user is authenticated
    const authResult = requireAuth(req);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    if (!authResult.user) {
      return NextResponse.json(
        { success: false, message: 'User information not found in authentication result' },
        { status: 401 }
      );
    }
    const userId = typeof authResult.user === 'string'
      ? authResult.user
      : (authResult.user && 'id' in authResult.user ? (authResult.user as any).id : undefined);
    
    // Find the user by ID
    const user = await User.findById(userId)
      .select('-password')
      .lean();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return user data
    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(req: NextRequest) {
  try {
    // Check if the user is authenticated
    const authResult = requireAuth(req);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    if (!authResult.user) {
      return NextResponse.json(
        { success: false, message: 'User information not found in authentication result' },
        { status: 401 }
      );
    }
    const userId = typeof authResult.user === 'string'
      ? authResult.user
      : (authResult.user && 'id' in authResult.user ? (authResult.user as any).id : undefined);
    const userRole = typeof authResult.user === 'object' && authResult.user !== null && 'role' in authResult.user
      ? (authResult.user as any).role
      : undefined;
    
    // Get request data
    const updateData = await req.json();
    
    // Prepare update object based on role
    const updateObj: any = {};
    
    // Common fields that can be updated
    if (updateData.name) updateObj.name = updateData.name;
    if (updateData.email) {
      // Check if email is already in use
      const existingUser = await User.findOne({ 
        email: updateData.email,
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'Email already in use' },
          { status: 409 }
        );
      }
      
      updateObj.email = updateData.email;
    }
    
    // Handle password update
    if (updateData.currentPassword && updateData.newPassword) {
      // Verify current password
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }
      
      const isPasswordValid = await user.comparePassword(updateData.currentPassword);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'Current password is incorrect' },
          { status: 401 }
        );
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      updateObj.password = await bcrypt.hash(updateData.newPassword, salt);
    }
    
    // Role-specific updates
    if (userRole === 'student') {
      if (updateData.studentId) updateObj.studentId = updateData.studentId;
    } else if (userRole === 'mentor') {
      if (updateData.expertise) updateObj.expertise = updateData.expertise;
      if (updateData.qualifications) updateObj.qualifications = updateData.qualifications;
      if (updateData.institution) updateObj.institution = updateData.institution;
      if (updateData.description) updateObj.description = updateData.description;
      if (updateData.hourlyRate) updateObj.hourlyRate = parseFloat(updateData.hourlyRate);
      if (updateData.profileImage) updateObj.profileImage = updateData.profileImage;
    }
    
    // Update the user document
    let updatedUser;
    if (userRole === 'student') {
      updatedUser = await Student.findByIdAndUpdate(
        userId,
        { $set: updateObj },
        { new: true }
      ).select('-password');
    } else if (userRole === 'mentor') {
      updatedUser = await Mentor.findByIdAndUpdate(
        userId,
        { $set: updateObj },
        { new: true }
      ).select('-password');
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateObj },
        { new: true }
      ).select('-password');
    }
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}