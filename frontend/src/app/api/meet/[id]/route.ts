// Fixed API route handlers for /api/meet/[id]/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Meet from '@/models/Meet';
import User from '@/models/User';
import mongoose from 'mongoose';
import { getServerSession } from '@/lib/auth/serverAuth';

// Updated RouteContext type for Next.js 13+ App Router
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    // Await the params Promise to get the actual parameters
    const params = await context.params;
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Meet ID is required' },
        { status: 400 }
      );
    }

    // First ensure both models are initialized
    await Promise.all([
      mongoose.models.User || mongoose.model('User', User.schema),
      mongoose.models.Meet || mongoose.model('Meet', Meet.schema)
    ]);

    const meet = await Meet.findOne({ meetId: id })
      .populate('mentorId', 'name email')
      .populate('studentId', 'name email');
    
    if (!meet) {
      return NextResponse.json(
        { success: false, message: 'Meet not found' },
        { status: 404 }
      );
    }

    // Add the current user's ID to the response for client-side comparison
    const responseData = {
      ...meet.toObject(),
      currentUserId: session.user?.id
    };

    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    console.error('Error in GET /api/meet/[id]:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Await the params Promise to get the actual parameters
    const params = await context.params;
    const id = params.id;
    const body = await request.json();
    
    await connectToDatabase();
    
    const meet = await Meet.findOneAndUpdate(
      { meetId: id },
      { $set: body },
      { new: true }
    );
    
    if (!meet) {
      return NextResponse.json(
        { success: false, message: 'Meet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: meet });
  } catch (error) {
    console.error('Error in PUT /api/meet/[id]:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}