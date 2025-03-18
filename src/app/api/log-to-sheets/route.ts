import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("body", body);

    // Google Sheets API endpoint
    const GOOGLE_SHEETS_API_URL = process.env.GOOGLE_SHEETS_API_URL;

    if (!GOOGLE_SHEETS_API_URL) {
      throw new Error('Google Sheets API URL not configured');
    }

    // Determine which sheet to use
    const sheetName = body.sheetName || "Orders";

    // Prepare the payload based on the sheet type
    let payload;

    if (sheetName === "PhoneNumbers") {
      // New case for phone numbers
      payload = {
        sheetName: "PhoneNumbers",
        timestamp: body.timestamp,
        phoneNumber: body.phoneNumber,
        source: body.source || "ExitIntentPopup"
      };
    } else if (sheetName === "FailedOrders") {
      payload = {
        sheetName: "FailedOrders",
        timestamp: body.timestamp,
        orderDate: body.orderDate,
        paymentMode: body.paymentMode,
        preferredDateTime: body.preferredDateTime,
        beneficiaryName: body.beneficiaryName,
        testDetails: body.testDetails,
        mobileNumber: body.mobileNumber,
        emailAddress: body.emailAddress,
        address: body.address,
        pincode: body.pincode,
        errorMessage: body.errorMessage
      };
    } else {
      // Default for Orders sheet
      payload = {
        sheetName: "Orders",
        timestamp: body.timestamp,
        orderNo: body.orderNo,
        orderDate: body.orderDate,
        paymentMode: body.paymentMode,
        preferredDateTime: body.preferredDateTime,
        rate: body.rate,
        beneficiaryName: body.beneficiaryName,
        testDetails: body.testDetails,
        mobileNumber: body.mobileNumber,
        emailAddress: body.emailAddress,
        address: body.address
      };
    }

    console.log("payload", payload);

    // Send the data to Google Sheets through the Apps Script Web App
    const response = await fetch(GOOGLE_SHEETS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error logging to Google Sheets:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to log data to Google Sheets'
    }, { status: 500 });
  }
}