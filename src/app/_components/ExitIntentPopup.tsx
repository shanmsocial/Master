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
import { Input } from "~/components/ui/input"; // Add Input import
import { useToast } from "~/components/ui/use-toast"; // Add Toast import

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState(""); // Add state for phone number
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state
  const phoneNumber = "09944320934";
  const hasShownPopup = useRef(false);
  const mouseOutTimer = useRef<number | null>(null);
  const { toast } = useToast(); // Add toast

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

  // Add function to handle phone number input change
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow up to 10 digits
    if (/^\d{0,10}$/.test(value)) {
      setUserPhoneNumber(value);
    }
  };

  // Add function to submit the phone number
  const handleSubmitPhoneNumber = async () => {
    if (userPhoneNumber.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/log-to-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sheetName: "PhoneNumbers",
          phoneNumber: userPhoneNumber,
          timestamp: new Date().toISOString(),
          source: "ExitIntentPopup"
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Thank You!",
          description: "We'll contact you shortly.",
        });
        setIsOpen(false);
      } else {
        throw new Error("Failed to save phone number");
      }
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      console.error("Error saving phone number:", error);
    } finally {
      setIsSubmitting(false);
    }
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

          {/* Phone Number Input - New Section */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex flex-col items-center space-y-3">
              <span className="text-sm text-gray-600">Enter your phone number for a callback</span>
              <Input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={userPhoneNumber}
                onChange={handlePhoneNumberChange}
                className="h-10 text-center font-medium text-[#2b569a]"
                maxLength={10}
              />
              <Button
                onClick={handleSubmitPhoneNumber}
                className="w-full bg-[#2b569a] hover:bg-blue-800 text-white h-9 font-medium"
                disabled={isSubmitting || userPhoneNumber.length !== 10}
              >
                {isSubmitting ? "Submitting..." : "Request Callback"}
              </Button>
            </div>
          </div>

          {/* Or call us section */}
          <div className="flex items-center justify-center">
            <div className="border-t border-gray-200 w-1/3"></div>
            <div className="text-xs text-gray-500 px-2">OR</div>
            <div className="border-t border-gray-200 w-1/3"></div>
          </div>

          {/* Phone Number Display */}
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm text-gray-600">Call us now</span>
              <div className="flex items-center justify-center space-x-2">
                <Phone className="h-5 w-5 text-[#2b569a]" />
                <span className="text-xl font-bold text-[#2b569a]">{phoneNumber}</span>
              </div>
              <span className="text-xs text-gray-500">Mon-Sat: 8:00 AM to 8:00 PM</span>
            </div>
          </div>

          {/* Rest of the existing benefits section... */}
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