"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react";

export default function OfferPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after a short delay when the page loads
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-6 pb-0 relative">
          <DialogTitle className="text-xl text-center font-bold text-[#2b569a]">
            Limited Time Offer!
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          {/* Offer Image */}
          <div className="relative w-full h-48 bg-blue-50 rounded-md overflow-hidden border-2 border-[#2b569a]">
            <Image
              src="https://emailer.thyrocare.com/DM_landing_page/images/logo/aarogyam.png"
              alt="Aarogyam Offer"
              fill
              className="object-contain p-4"
            />
          </div>
          
          {/* Offer Details */}
          <DialogDescription className="text-center">
            <div className="text-base text-gray-900 font-medium mb-2">
              Get up to <span className="text-lg font-bold text-[#2b569a]">20% OFF</span> on all Health Packages!
            </div>
            <div className="text-sm text-gray-700">
              Book your appointment today and save on comprehensive health checkups.
            </div>
          </DialogDescription>
          
          {/* Offer Benefits */}
          <div className="space-y-2 pt-2">
            <h4 className="text-sm font-semibold text-gray-900">Special Benefits:</h4>
            <ul className="space-y-1">
              <li className="flex items-start space-x-2 text-sm">
                <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Free home sample collection</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Reports within 24-48 hours</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Doctor consultation available</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Tax benefits under Section 80D</span>
              </li>
            </ul>
          </div>
          
          {/* Promotional Tag */}
          <div className="bg-blue-50 p-3 rounded-md border border-blue-100 text-center">
            <p className="text-[#2b569a] text-sm font-medium">Use code: <span className="font-bold">THYRO20</span></p>
            <p className="text-xs text-gray-500 mt-1">Valid until March 31, 2025</p>
          </div>
        </div>
        
        <div className="border-t flex">
          <Button 
            variant="ghost" 
            onClick={() => setIsOpen(false)} 
            className="flex-1 m-0 rounded-none h-12 font-normal hover:bg-gray-50"
          >
            Maybe Later
          </Button>
          <Button 
            onClick={() => setIsOpen(false)} 
            className="flex-1 m-0 rounded-none bg-[#2b569a] hover:bg-blue-800 text-white h-12 font-normal"
          >
            Book Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}