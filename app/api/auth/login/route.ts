import { NextRequest, NextResponse } from 'next/server';
import { LoginRequest, LoginResponse, User } from '@/app/utils/type';

// Mock user database - replace with actual database
const mockUsers = [
  { id: 1, username: 'admin', password: 'admin123', email: 'admin@example.com', role: 'admin' as const },
  { id: 2, username: 'user', password: 'user123', email: 'user@example.com', role: 'user' as const },
  { id: 3, username: 'support', password: 'support123', email: 'support@example.com', role: 'support' as const },
];

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body: LoginRequest = await request.json();

    // Validate input
    if (!body.username || !body.password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user in mock database
    const user = mockUsers.find(
      (u) => u.username === body.username && u.password === body.password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    const response: LoginResponse = {
      success: true,
      message: 'Login successful',
      user: userWithoutPassword as User,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
