import { NextRequest, NextResponse } from 'next/server';
import { env } from '~/env';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, date, pincode, strproducts, benCount, patients, items } = body;

    // Make the request to the external API
    const response = await fetch('https://velso.thyrocare.cloud/api/TechsoApi/GetAppointmentSlots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "ApiKey": env.API_KEY,
        "Date": date,
        "Pincode": pincode,
        "strproducts": strproducts,
        "BenCount": benCount,
        "Patients": patients,
        "Items": items
      })
    });

    // Get the response data
    const data = await response.json();

    // Return the data
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching appointment slots:', error);
    return NextResponse.json({ error: 'Failed to fetch appointment slots' }, { status: 500 });
  }
}