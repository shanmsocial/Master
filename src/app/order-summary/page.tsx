import { Suspense } from 'react';
import OrderSummaryPage from './OrderSummaryPage';

export const metadata = {
  title: 'Order Summary - Thyrocare',
  description: 'View your Thyrocare order summary and booking details',
};

function LoadingState(){
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
        </div>
      );
}

export default function OrderSummaryRoute() {
  return ( 
    <Suspense fallback={<LoadingState />}>
  <OrderSummaryPage />
  </Suspense>
);
}