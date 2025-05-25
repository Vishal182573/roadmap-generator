import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Meet from '@/models/Meet';
import { getServerSession } from '@/lib/auth/AuthContext';

export async function POST(request: Request) {
  try {
    const session = await getServerSession()(request);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    await connectToDatabase();
    
    // Check if mentor is available at the requested time
    const existingMeet = await Meet.findOne({
      mentorId: body.mentorId,
      scheduledTime: {
        $gte: new Date(new Date(body.scheduledTime).getTime() - 30 * 60000), // 30 minutes before
        $lte: new Date(new Date(body.scheduledTime).getTime() + 90 * 60000), // 90 minutes after (60 min session + 30 min buffer)
      },
    });

    if (existingMeet) {
      return NextResponse.json(
        { success: false, message: 'Mentor is not available at this time' },
        { status: 400 }
      );
    }

    // Create new meet
    const meet = new Meet(body);
    await meet.save();

    return NextResponse.json({ success: true, data: meet });
  } catch (error) {
    console.error('Error in POST /api/meet:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession()(request);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = session.user?.id;
    
    await connectToDatabase();
    
    // Get all meets where user is either mentor or student
    const meets = await Meet.find({
      $or: [
        { mentorId: userId },
        { studentId: userId }
      ]
    })
    .populate('mentorId', 'name email')
    .populate('studentId', 'name email')
    .sort({ scheduledTime: 1 });

    return NextResponse.json({ success: true, data: meets });
  } catch (error) {
    console.error('Error in GET /api/meet:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 