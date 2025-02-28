import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Google Sheets API endpoint
    // You'll need to create a Google Apps Script Web App that acts as a proxy
    // and publishes the submitted data to your Google Sheet
    const GOOGLE_SHEETS_API_URL = process.env.GOOGLE_SHEETS_API_URL;
    
    if (!GOOGLE_SHEETS_API_URL) {
      throw new Error('Google Sheets API URL not configured');
    }
    
    // The data we want to log to Google Sheets
    const { 
      orderNo,
      orderDate,
      paymentMode,
      preferredDateTime,
      rate,
      beneficiaryName,
      testDetails,
      mobileNumber,
      emailAddress,
      address,
      timestamp 
    } = body;
    
    // Send the data to Google Sheets through the Apps Script Web App
    const response = await fetch(GOOGLE_SHEETS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderNo,
        orderDate,
        paymentMode,
        preferredDateTime,
        rate,
        beneficiaryName,
        testDetails,
        mobileNumber, 
        emailAddress,
        address,
        timestamp
      })
    });
    
    const data = await response.json();
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error logging to Google Sheets:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to log order to Google Sheets' 
    }, { status: 500 });
  }
}