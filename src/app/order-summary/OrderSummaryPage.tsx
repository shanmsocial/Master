'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

interface BenMaster {
  name: string;
  id: string;
  age: string;
  gender: string;
  mobile: string;
  status: string;
  url: string | null;
  reminder: string;
  barcode: string;
}

interface OrderMaster {
  orderNo: string;
  ids: string;
  names: string;
  products: string;
  serviceType: string;
  payType: string;
  rate: string;
  bookingThrough: string;
  address: string;
  pincode: string;
  remarks: string;
  status: string;
  tsp: string;
  appointmentId: string | null;
  patinetId: string | null;
  incentive: string;
  cancelRemarks: string;
  ulc: string;
  refByDRName: string;
  cmlt: string;
  feedback: string;
  email: string;
  mobile: string;
}

interface TspMaster {
  tsp: string;
  email: string;
  landline: string;
  mobile: string;
  bctName: string;
  bctMobile: string;
}

interface LeadHistoryDate {
  leadId: string;
  date: string;
}

interface LeadHistoryMaster {
  bookedOn: LeadHistoryDate[];
  assignTspOn: LeadHistoryDate[];
  appointOn: LeadHistoryDate[];
  reappointOn: LeadHistoryDate[];
  servicedOn: LeadHistoryDate[] | null;
  reportedOn: LeadHistoryDate[] | null;
  deliverdOn: LeadHistoryDate[];
  rejectedOn: LeadHistoryDate[] | null;
}

interface OrderSummaryResponse {
  respId: string;
  response: string;
  mergedOrderNos: string | null;
  orderMaster: OrderMaster[];
  leadHistoryMaster: LeadHistoryMaster[];
  benMaster: BenMaster[];
  tspMaster: TspMaster[];
  qr: string | null;
  collectionCenters: any | null;
  phleboDetail: {
    phleboNumber: string | null;
    phleboName: string | null;
  };
}

export default function OrderSummaryPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderSummary, setOrderSummary] = useState<OrderSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderSummary() {
      if (!orderId) {
        setError('Order ID not provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/order-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({orderId})
        });
        console.log("response", response);
        if (!response.ok) {
          throw new Error('Failed to fetch order summary');
        }

        const data = await response.json();
        setOrderSummary(data);
      } catch (err) {
        setError('Error fetching order summary. Please try again later.');
        console.error('Error fetching order summary:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderSummary();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  // Check if orderSummary is null or orderMaster has length 0
  const isOrderInProcessing = !orderSummary || orderSummary.orderMaster.length === 0;

  // If orderMaster is empty, display the "in processing" view
  if (isOrderInProcessing) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="w-full border-b">
          <div className="container flex justify-between items-center py-2">
            <div className="flex items-center">
              <div className="flex flex-col">
                <Image src="https://www.thyrocare.com/NewAssets/img/NewLogo.svg" alt="Thyrocare Logo" width={150} height={150} />
              </div>
            </div>
            <div>
              <Image src="https://emailer.thyrocare.com/DM_landing_page/images/logo/aarogyam.png" alt="Aarogyam Logo" width={180} height={180} />
            </div>
          </div>
        </header>

        {/* Order Processing Content */}
        <div className="container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-blue-50 rounded-lg p-8 border border-blue-100">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20ZM13 12H17V14H11V7H13V12Z" fill="currentColor" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Added Successfully</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your booking request. Your order is being processed and you will be contacted soon by our customer service team.
              </p>
              <div className="text-blue-800 font-medium mb-6">
                Reference ID: {orderId}
              </div>
              <div className="border-t border-blue-100 pt-6 mt-2">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">What happens next?</h2>
                <ul className="text-left list-disc pl-6 space-y-2 mb-4">
                  <li className="text-gray-600">A representative will contact you to confirm your appointment details</li>
                  <li className="text-gray-600">You&apos;ll receive a confirmation email with your booking details</li>
                </ul>
              </div>
              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  For any queries, please contact: <span className="font-medium text-blue-700">09944320934</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Extract data from response for the normal order confirmation view
  const orderDetails = orderSummary.orderMaster[0];
  const beneficiary = orderSummary.benMaster[0];
  const preferredDate = orderSummary.leadHistoryMaster[0]?.appointOn[0]?.date || 'Not scheduled';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full border-b">
        <div className="container flex justify-between items-center py-2">
          <div className="flex items-center">
            <div className="flex flex-col">
              <Image src="https://www.thyrocare.com/NewAssets/img/NewLogo.svg" alt="Thyrocare Logo" width={150} height={150} />
            </div>
          </div>
          <div>
            <Image src="https://emailer.thyrocare.com/DM_landing_page/images/logo/aarogyam.png" alt="Aarogyam Logo" width={180} height={180} />
          </div>
        </div>
      </header>

      {/* Confirmation Content */}
      <div className="container py-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Booking Confirmed</h1>
          <div className="flex justify-center items-center mt-2">
            <p className="text-gray-600 mr-2">You have successfully booked your test(s)</p>
            <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM11.003 16L18.073 8.929L16.659 7.515L11.003 13.172L8.174 10.343L6.76 11.757L11.003 16Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        <div className="max-w-4xl mx-auto border border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-300">
            {/* Left column */}
            <div className="p-4">
              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-2 border-b py-2">
                  <div className="font-semibold">Order Date</div>
                  <div>{orderSummary.leadHistoryMaster[0]?.bookedOn[0]?.date?.split(' ')[0] || ''}</div>
                </div>
                <div className="grid grid-cols-2 border-b py-2">
                  <div className="font-semibold">Order Number</div>
                  <div>{orderDetails?.orderNo}</div>
                </div>
                <div className="grid grid-cols-2 border-b py-2">
                  <div className="font-semibold">Payment Mode</div>
                  <div>{orderDetails?.payType}</div>
                </div>
                <div className="grid grid-cols-2 border-b py-2">
                  <div className="font-semibold">Preferred Date and Time</div>
                  <div>{preferredDate}</div>
                </div>
                <div className="grid grid-cols-2 border-b py-2">
                  <div className="font-semibold">Rate</div>
                  <div>{orderDetails?.rate}</div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="p-4">
              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-2 border-b py-2">
                  <div className="font-semibold">Beneficiary Name</div>
                  <div>{beneficiary?.name}</div>
                </div>
                <div className="grid grid-cols-2 border-b py-2">
                  <div className="font-semibold">Test Details</div>
                  <div>{orderDetails?.products}</div>
                </div>
                <div className="grid grid-cols-2 border-b py-2">
                  <div className="font-semibold">Mobile Number</div>
                  <div>{beneficiary?.mobile}</div>
                </div>
                <div className="grid grid-cols-2 border-b py-2">
                  <div className="font-semibold">Email Address</div>
                  <div>{orderDetails?.email}</div>
                </div>
                <div className="grid grid-cols-2 border-b py-2">
                  <div className="font-semibold">Address</div>
                  <div className="break-words">{orderDetails?.address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8">
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-gray-700">You will receive an email with further information, once we assign blood collection technician.</li>
            <li className="text-gray-700">Soft copy reports will be emailed to you within 48 hours of sample collection.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}