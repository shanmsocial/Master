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
        const response = await fetch('https://velso.thyrocare.cloud/api/OrderSummary/OrderSummary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "ApiKey": "Md1oSsrtb7Qhav2L09Vz4D8uDiFKCK6L.EiWtce3cMB@64p2utjY0AA==",
            "OrderNo": orderId
          })
        });

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

  if (error || !orderSummary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error || 'Failed to load order summary'}</p>
        </div>
      </div>
    );
  }

  // Extract data from response
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