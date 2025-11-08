import { NextRequest, NextResponse } from 'next/server';
import config from '@/lib/config';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const path = params.path.join('/');
    const queryString = searchParams.toString();
    
    // Build the backend URL
    const backendUrl = `${config.api.baseURL}/voice-preview/${path}${queryString ? `?${queryString}` : ''}`;
    
    // Forward the request to your backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward any authorization headers if needed
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        }),
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Backend request failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Voice preview API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
