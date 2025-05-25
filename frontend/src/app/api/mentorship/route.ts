// app/api/mentorship/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Student, Mentor } from '@/models/User';
import { requireAuth } from '@/lib/auth';
import mongoose from 'mongoose';

// Create a new mentorship relationship
export async function POST(req: NextRequest) {
  try {
    // Check if the user is authenticated
    const authResult = requireAuth(req);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }
    
    // Get the request data
    const { mentorId } = await req.json();
    if (!authResult.user) {
      return NextResponse.json(
        { success: false, message: 'User information is missing from authentication result' },
        { status: 401 }
      );
    }
    const studentId = typeof authResult.user === 'object' && 'id' in authResult.user ? (authResult.user as any).id : undefined;
    
    if (!mentorId) {
      return NextResponse.json(
        { success: false, message: 'Mentor ID is required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Validate that both users exist and have correct roles
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student not found or you are not a student' },
        { status: 404 }
      );
    }
    
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return NextResponse.json(
        { success: false, message: 'Mentor not found' },
        { status: 404 }
      );
    }
    
    // Check if the relationship already exists
    if (student.mentors?.includes(new mongoose.Types.ObjectId(mentorId))) {
      return NextResponse.json(
        { success: false, message: 'You are already mentored by this mentor' },
        { status: 409 }
      );
    }
    
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Add the mentor to the student's mentors list
      if (!student.mentors) {
        student.mentors = [];
      }
      student.mentors.push(new mongoose.Types.ObjectId(mentorId));
      await student.save({ session });
      
      // Add the student to the mentor's students list
      if (!mentor.students) {
        mentor.students = [];
      }
      mentor.students.push(new mongoose.Types.ObjectId(studentId));
      mentor.studentsmentored += 1;
      await mentor.save({ session });
      
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      
      return NextResponse.json({
        success: true,
        message: 'Mentorship relationship established successfully'
      });
    } catch (error) {
      // Abort the transaction on error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error: any) {
    console.error('Error creating mentorship relationship:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// Get mentorship details
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
    
    const userId = typeof authResult.user === 'object' && 'id' in authResult.user ? (authResult.user as any).id : undefined;
    const userRole = typeof authResult.user === 'object' && 'role' in authResult.user ? (authResult.user as any).role : undefined;
    
    if (userRole === 'student') {
      // Get all mentors for this student
      const student = await Student.findById(userId)
        .populate('mentors', 'name email expertise qualifications institution hourlyRate rating profileImage description')
        .select('mentors');
      
      if (!student) {
        return NextResponse.json(
          { success: false, message: 'Student not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: {
          mentors: student.mentors || []
        }
      });
    } else if (userRole === 'mentor') {
      // Get all students for this mentor
      const mentor = await Mentor.findById(userId)
        .populate('students', 'name email studentId')
        .select('students studentsmentored');
      
      if (!mentor) {
        return NextResponse.json(
          { success: false, message: 'Mentor not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: {
          students: mentor.students || [],
          studentsmentored: mentor.studentsmentored
        }
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid user role' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error fetching mentorship details:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// Remove a mentorship relationship
export async function DELETE(req: NextRequest) {
  try {
    // Check if the user is authenticated
    const authResult = requireAuth(req);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }
    
    // Get the request data
    const url = new URL(req.url);
    const targetId = url.searchParams.get('id');
    
    if (!targetId) {
      return NextResponse.json(
        { success: false, message: 'Target ID is required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    const userId = typeof authResult.user === 'object' && 'id' in authResult.user ? (authResult.user as any).id : undefined;
    const userRole = typeof authResult.user === 'object' && 'role' in authResult.user ? (authResult.user as any).role : undefined;
    
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      if (userRole === 'student') {
        // Student removing a mentor
        const student = await Student.findById(userId);
        if (!student) {
          await session.abortTransaction();
          session.endSession();
          return NextResponse.json(
            { success: false, message: 'Student not found' },
            { status: 404 }
          );
        }
        
        // Remove mentor from student's list
        if (student.mentors) {
          student.mentors = student.mentors.filter(
            (mentorId) => mentorId.toString() !== targetId
          );
          await student.save({ session });
        }
        
        // Remove student from mentor's list
        const mentor = await Mentor.findById(targetId);
        if (mentor && mentor.students) {
          mentor.students = mentor.students.filter(
            (studentId) => studentId.toString() !== userId
          );
          // We don't decrement studentsmentored as it's a historical count
          await mentor.save({ session });
        }
      } else if (userRole === 'mentor') {
        // Mentor removing a student
        const mentor = await Mentor.findById(userId);
        if (!mentor) {
          await session.abortTransaction();
          session.endSession();
          return NextResponse.json(
            { success: false, message: 'Mentor not found' },
            { status: 404 }
          );
        }
        
        // Remove student from mentor's list
        if (mentor.students) {
          mentor.students = mentor.students.filter(
            (studentId) => studentId.toString() !== targetId
          );
          await mentor.save({ session });
        }
        
        // Remove mentor from student's list
        const student = await Student.findById(targetId);
        if (student && student.mentors) {
          student.mentors = student.mentors.filter(
            (mentorId) => mentorId.toString() !== userId
          );
          await student.save({ session });
        }
      } else {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json(
          { success: false, message: 'Invalid user role' },
          { status: 400 }
        );
      }
      
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      
      return NextResponse.json({
        success: true,
        message: 'Mentorship relationship removed successfully'
      });
    } catch (error) {
      // Abort the transaction on error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error: any) {
    console.error('Error removing mentorship relationship:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}