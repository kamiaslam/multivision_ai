import { NextRequest, NextResponse } from 'next/server';

const SIM_AI_URL = process.env.SIM_AI_URL || 'http://localhost:3000';
const SIM_AI_API_URL = `${SIM_AI_URL}/api`;

/**
 * Proxy handler for SIM AI API requests
 * This allows VoiceCake to communicate with SIM AI backend
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'PATCH');
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    // Construct the target URL
    const path = pathSegments.join('/');
    const targetUrl = `${SIM_AI_API_URL}/${path}`;
    
    // Get the search params
    const searchParams = request.nextUrl.searchParams.toString();
    const urlWithParams = searchParams ? `${targetUrl}?${searchParams}` : targetUrl;

    // Forward headers
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      // Skip host and content-length headers
      if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'content-length') {
        headers.set(key, value);
      }
    });

    // Add custom headers for integration
    headers.set('X-VoiceCake-Proxy', 'true');
    headers.set('X-VoiceCake-Auth', 'true'); // This tells SIM AI to authenticate automatically
    headers.set('X-Original-Host', request.headers.get('host') || 'localhost');

    // Get the session/auth token if available
    const authToken = request.cookies.get('auth-token')?.value;
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers,
    };

    // Add body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const body = await request.json();
        requestOptions.body = JSON.stringify(body);
      } else if (contentType?.includes('multipart/form-data')) {
        // Handle form data
        const formData = await request.formData();
        requestOptions.body = formData as any;
      } else {
        // Handle raw body
        const body = await request.text();
        requestOptions.body = body;
      }
    }

    // Make the request to SIM AI
    const response = await fetch(urlWithParams, requestOptions);

    // Get response body
    const contentType = response.headers.get('content-type');
    let responseBody;
    
    if (contentType?.includes('application/json')) {
      responseBody = await response.json();
    } else if (contentType?.includes('text')) {
      responseBody = await response.text();
    } else {
      // Handle binary data
      const buffer = await response.arrayBuffer();
      responseBody = Buffer.from(buffer);
    }

    // Create response with appropriate headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Skip some headers that shouldn't be forwarded
      if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    // Return the proxied response
    if (Buffer.isBuffer(responseBody)) {
      return new NextResponse(responseBody, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } else if (typeof responseBody === 'string') {
      return new NextResponse(responseBody, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } else {
      return NextResponse.json(responseBody, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to proxy request to SIM AI',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}