import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { env } from '~/env';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { subject, errorMessage, orderDetails } = body;

        // Configure your email transport
        const transporter = nodemailer.createTransport({
            host: env.EMAIL_HOST,
            port: parseInt(env.EMAIL_PORT || '587'),
            secure: env.EMAIL_SECURE === 'true',
            auth: {
                user: env.EMAIL_USER,
                pass: env.EMAIL_PASSWORD,
            },
        });

        // Create the email content
        const emailContent = `
      <h1>Booking Form Error</h1>
      <p><strong>Error Message:</strong> ${errorMessage}</p>
      <h2>Order Details:</h2>
      <ul>
        <li><strong>Name:</strong> ${orderDetails.name}</li>
        <li><strong>Email:</strong> ${orderDetails.email}</li>
        <li><strong>Mobile:</strong> ${orderDetails.mobile}</li>
        <li><strong>Package:</strong> ${orderDetails.package}</li>
        <li><strong>Pincode:</strong> ${orderDetails.pincode}</li>
      </ul>
      <p>This order has been logged to the FailedOrders Sheet for manual processing.</p>
    `;

        // Send the email
        await transporter.sendMail({
            from: env.EMAIL_FROM,
            to: env.EMAIL_TO, // Your email address
            subject: subject,
            html: emailContent,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
    }
}