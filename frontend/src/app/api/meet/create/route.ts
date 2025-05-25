import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Meet from '@/models/Meet';
import { getServerSession } from '@/lib/auth/serverAuth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.mentorId || !body.meetDate || !body.meetTime) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Create new meet
    const meet = await Meet.create({
      meetId: uuidv4(),
      mentorId: body.mentorId,
      studentId: session.user.id, // From the authenticated session
      meetDate: new Date(body.meetDate),
      meetTime: body.meetTime,
      status: body.status || 'scheduled',
      meetType: body.meetType || 'one-on-one',
      hourlyRate: body.hourlyRate,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      data: meet,
      message: 'Meeting scheduled successfully' 
    });
  } catch (error) {
    console.error('Error in POST /api/meet/create:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 