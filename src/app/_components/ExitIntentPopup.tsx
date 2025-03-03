"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Phone } from "lucide-react";

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "09944320934";
  const hasShownPopup = useRef(false);
  const mouseOutTimer = useRef<number | null>(null);
  
  useEffect(() => {
    // Only track exit intent if we haven't shown the popup yet
    const handleMouseOut = (e: MouseEvent) => {
        if (!hasShownPopup.current && e.clientY < 5 && e.relatedTarget === null) {
          mouseOutTimer.current = window.setTimeout(() => {
            setIsOpen(true);
            hasShownPopup.current = true;
          }, 100);
        }
      };
    
    // Clear the timer if they move back into the page quickly
    const handleMouseMove = () => {
      if (mouseOutTimer.current) {
        clearTimeout(mouseOutTimer.current);
        mouseOutTimer.current = null;
      }
    };
    
    // Add event listeners
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousemove', handleMouseMove);
    
    // Set a backup timer to trigger popup after inactivity (optional)
    const inactivityTimer = setTimeout(() => {
      if (!hasShownPopup.current) {
        const visibilityHandler = () => {
          if (document.visibilityState === 'hidden' && !hasShownPopup.current) {
            // They switched tabs - show popup when they return
            const showOnReturn = () => {
              setIsOpen(true);
              hasShownPopup.current = true;
              document.removeEventListener('visibilitychange', showOnReturn);
            };
            
            document.addEventListener('visibilitychange', showOnReturn);
          }
        };
        
        document.addEventListener('visibilitychange', visibilityHandler);
      }
    }, 60000); // 1 minute
    
    return () => {
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(inactivityTimer);
      if (mouseOutTimer.current) {
        clearTimeout(mouseOutTimer.current);
      }
    };
  }, []);

  const handleCallClick = () => {
    window.location.href = `tel:${phoneNumber}`;
    setIsOpen(false);
  };
  
  // Allow closing the popup manually
  const handleClosePopup = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClosePopup}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white rounded-lg">
        <DialogHeader className="px-6 pt-6 pb-0 relative">
          <DialogTitle className="text-xl text-center font-bold text-[#2b569a]">
            Need Assistance?
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          {/* Assistance Message */}
          <div className="text-center">
            <p className="text-gray-700 mb-4">
              Have questions about our health packages or need help with booking?
            </p>
            <p className="text-gray-700 mb-4">
              Our health experts are standing by to assist you!
            </p>
          </div>
          
          {/* Phone Number Display */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm text-gray-600">Call us now</span>
              <div className="flex items-center justify-center space-x-2">
                <Phone className="h-5 w-5 text-[#2b569a]" />
                <span className="text-xl font-bold text-[#2b569a]">{phoneNumber}</span>
              </div>
              <span className="text-xs text-gray-500">Mon-Sat: 8:00 AM to 8:00 PM</span>
            </div>
          </div>
          
          {/* Benefits of calling */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900">Our experts can help you with:</h4>
            <ul className="space-y-1">
              <li className="flex items-start space-x-2 text-sm">
                <svg className="h-5 w-5 text-[#2b569a] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Selecting the right health package for you</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <svg className="h-5 w-5 text-[#2b569a] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Understanding test requirements</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <svg className="h-5 w-5 text-[#2b569a] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Scheduling your home collection</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <svg className="h-5 w-5 text-[#2b569a] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Special offers and discounts</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t p-4">
          <Button 
            onClick={handleCallClick} 
            className="w-full bg-[#2b569a] hover:bg-blue-800 text-white h-10 font-medium flex items-center justify-center space-x-2"
          >
            <Phone className="h-4 w-4" />
            <span>Call {phoneNumber}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}