// app/api/validate-pincode/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { env } from '~/env';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pincode } = body;

    // Make the request to the external API
    const response = await fetch('https://velso.thyrocare.cloud/api/TechsoApi/PincodeAvailability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "ApiKey": env.API_KEY,
        "Pincode": pincode
      })
    });

    // Get the response data
    const data = await response.json();

    // Return the data
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error validating pincode:', error);
    return NextResponse.json({ error: 'Failed to validate pincode' }, { status: 500 });
  }
}