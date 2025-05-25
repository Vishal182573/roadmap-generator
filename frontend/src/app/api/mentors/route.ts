import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Mentor } from '@/models/User';
import User from '@/models/User'; // Import the base User model too

export async function GET(req: NextRequest) {
  try {
    console.log('🔄 Starting mentors API request...');
    await connectToDatabase();
    console.log('✅ Connected to database successfully');
    
    // Debug: Check what models are available
    console.log('📋 Available mongoose models:', Object.keys(require('mongoose').models));
    
    // Debug: Check total users in the database
    const totalUsers = await User.countDocuments();
    console.log('👥 Total users in database:', totalUsers);
    
    // Debug: Check users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    console.log('📊 Users by role:', usersByRole);
    
    // Debug: Check for mentors using base User model
    const mentorsFromUser = await User.find({ role: 'mentor' }).countDocuments();
    console.log('🎓 Mentors found using User model:', mentorsFromUser);
    
    // Debug: Check discriminator key in some documents
    const sampleUsers = await User.find().limit(3).select('role name email');
    console.log('📄 Sample users:', sampleUsers);
    
    // Get search parameters
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('search') || '';
    const expertise = url.searchParams.get('expertise') || '';
    const sortBy = url.searchParams.get('sortBy') || 'rating';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '9');
    
    console.log('🔍 Search params:', { searchTerm, expertise, sortBy, page, limit });
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Build query - try both approaches
    let query: any = {};
    
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { expertise: { $in: [new RegExp(searchTerm, 'i')] } }
      ];
    }
    
    if (expertise && expertise !== 'all') {
      query.expertise = { $in: [expertise] };
    }
    
    console.log('🔎 MongoDB query:', JSON.stringify(query, null, 2));
    
    // Try different approaches to get mentors
    console.log('🧪 Testing different query approaches...');
    
    // Approach 1: Using Mentor discriminator model
    const mentorCount1 = await Mentor.countDocuments(query);
    console.log('📈 Approach 1 - Mentor.countDocuments():', mentorCount1);
    
    // Approach 2: Using base User model with role filter
    const mentorQuery = { ...query, role: 'mentor' };
    const mentorCount2 = await User.countDocuments(mentorQuery);
    console.log('📈 Approach 2 - User.countDocuments({role: "mentor"}):', mentorCount2);
    
    let mentors: any[] = [];
    let total = 0;
    
    if (mentorCount1 > 0) {
      // Use discriminator model
      console.log('✅ Using Mentor discriminator model');
      total = mentorCount1;
      mentors = await Mentor.find(query)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .lean();
    } else if (mentorCount2 > 0) {
      // Use base model with role filter
      console.log('✅ Using User model with role filter');
      total = mentorCount2;
      mentors = await User.find(mentorQuery)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .lean();
    } else {
      console.log('⚠️ No mentors found with either approach');
      
      // Final debug: check if there are any users at all
      const anyUsers = await User.find().limit(5);
      console.log('🔍 First 5 users in database:', anyUsers.map(u => ({
        id: u._id,
        name: u.name,
        role: u.role,
        hasExpertise: !!(u as any).expertise
      })));
    }
    
    console.log('🎯 Final mentors found:', mentors.length);
    
    // Sort results if we have any
    if (mentors.length > 0) {
      const sortFn = (a: any, b: any) => {
        switch (sortBy) {
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'students':
            return (b.studentsmentored || 0) - (a.studentsmentored || 0);
          case 'rate':
            return (a.hourlyRate || 0) - (b.hourlyRate || 0);
          default:
            return (b.rating || 0) - (a.rating || 0);
        }
      };
      
      mentors.sort(sortFn);
    }
    
    const response = { 
      success: true, 
      data: mentors,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      debug: {
        totalUsers,
        usersByRole,
        mentorsFromUser,
        mentorCount1,
        mentorCount2,
        availableModels: Object.keys(require('mongoose').models)
      }
    };
    
    console.log('📤 Sending response:', {
      success: true,
      total,
      mentorsCount: mentors.length,
      page,
      totalPages: Math.ceil(total / limit)
    });
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('❌ Error fetching mentors:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Get a specific mentor by ID
export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Mentor ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    console.log('🔍 Looking for mentor with ID:', id);
    
    // Try both approaches
    let mentor = await Mentor.findById(id).select('-password').lean();
    
    if (!mentor) {
      console.log('🔄 Mentor not found with discriminator, trying User model...');
      mentor = await User.findOne({ _id: id, role: 'mentor' }).select('-password').lean() as any;
    }
    
    if (!mentor) {
      console.log('❌ Mentor not found with either approach');
      return NextResponse.json(
        { success: false, message: 'Mentor not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Mentor found:', { id: mentor._id, name: mentor.name, role: mentor.role });
    
    return NextResponse.json({ success: true, data: mentor });
  } catch (error: any) {
    console.error('❌ Error fetching mentor:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}