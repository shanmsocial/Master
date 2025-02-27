"use client";

import React from 'react'
import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Users } from "lucide-react";
import { cn } from "~/lib/utils";
import { useToast } from "~/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import BeneficiariesPopup from "./BeneficiariesPopup";

interface Beneficiary {
  id?: string;
  name: string;
  gender: string;
  age: string;
}

interface FormState {
  pincode: string;
  name: string;
  mobile: string;
  email: string;
  age: string;
  gender: string;
  address: string;
  package: string;
  quantity: string;
  appointmentDate: Date | undefined;
  slot: string;
  printedReports: boolean;
  contactPreferences: {
    whatsapp: boolean;
    call: boolean;
    email: boolean;
    sms: boolean;
  };
  authorized: boolean;
  beneficiaries: Beneficiary[];
}

export default function BookingForm() {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [formState, setFormState] = useState<FormState>({
      pincode: "",
      name: "",
      mobile: "",
      email: "",
      age: "",
      gender: "",
      address: "",
      package: "",
      quantity: "1",
      appointmentDate: undefined,
      slot: "",
      printedReports: false,
      contactPreferences: {
        whatsapp: true,
        call: true,
        email: true,
        sms: true,
      },
      authorized: false,
      beneficiaries: []
    });
    const [isPincodeValid, setIsPincodeValid] = useState<boolean | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [isBeneficiariesOpen, setIsBeneficiariesOpen] = useState(false);
    const { toast } = useToast();

    const validatePincode = async (pincode: string) => {
      if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
        setIsPincodeValid(false);
        return;
      }
      setIsValidating(true);
      try {
        const response = await fetch('/api/validate-pincode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pincode })
        });
    
        const data = await response.json();
        const isValid = data && data.status === "Y"; 
        setIsPincodeValid(isValid);
    
        if (!isValid) {
          toast({
            title: "Invalid Pincode",
            description: "Service is not available at this pincode.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error validating pincode:", error);
        setIsPincodeValid(false);
        toast({
          title: "Validation Error",
          description: "Could not validate pincode. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsValidating(false);
      }
    };
  
    const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormState(prev => ({ ...prev, pincode: value }));
      
      if (value.length === 6) {
        validatePincode(value);
      } else if (value.length > 0) {
        setIsPincodeValid(null);
      }
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormState(prev => ({ ...prev, [name]: value }));
    };
  
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormState(prev => ({ ...prev, quantity: value }));
      
      // Open beneficiaries popup when quantity changes
      if (parseInt(value) > 0) {
        setIsBeneficiariesOpen(true);
      }
    };
    
    const handleAddBeneficiaries = (beneficiaries: Beneficiary[]) => {
      setFormState(prev => ({ ...prev, beneficiaries }));
      
      // Also update primary beneficiary info if this is the first one
      if (beneficiaries.length > 0 && !formState.name) {
        const primaryBeneficiary = beneficiaries[0];
        setFormState(prev => ({
          ...prev,
          name: primaryBeneficiary?.name!,
          gender: primaryBeneficiary?.gender!,
          age: primaryBeneficiary?.age!
        }));
      }
      
      toast({
        title: "Beneficiaries Added",
        description: `${beneficiaries.length} beneficiary information added successfully.`
      });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
   
      if (!isPincodeValid) {
        toast({
          title: "Invalid Pincode",
          description: "Please enter a valid pincode before submitting.",
          variant: "destructive",
        });
        return;
      }
      
      if (parseInt(formState.quantity) > 0 && formState.beneficiaries.length !== parseInt(formState.quantity)) {
        toast({
          title: "Incomplete Information",
          description: `Please add all ${formState.quantity} beneficiaries before submitting.`,
          variant: "destructive",
        });
        return;
      }
  
      console.log("Form submitted:", formState);
      toast({
        title: "Booking Submitted",
        description: "Your test booking has been received.",
      });
    };
    
  return (
    <div className="w-full flex justify-center">
      <Card className="w-full max-w-[550px] shadow-lg">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit}>
            <h1 className="text-center text-xl font-bold text-[#2b569a] mb-1">
              Book Your Test Now
            </h1>
            <h2 className="text-center text-sm mb-3">Fill Out The Form</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="relative">
                <Input 
                  placeholder="Enter Pin Code*" 
                  className={cn(
                    "h-8 text-sm",
                    isPincodeValid === false ? "border-red-500 pr-10" : "",
                    isPincodeValid === true ? "border-green-500 pr-10" : ""
                  )}
                  name="pincode"
                  value={formState.pincode}
                  onChange={handlePincodeChange}
                  onBlur={() => formState.pincode && validatePincode(formState.pincode)}
                />
                {isValidating && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
                  </div>
                )}
                {isPincodeValid === true && !isValidating && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {isPincodeValid === false && !isValidating && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>
              <Input 
                placeholder="Enter Name*" 
                className="h-8 text-sm" 
                name="name"
                value={formState.name}
                onChange={handleInputChange}
              />
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <Input 
                placeholder="Enter Mobile No*" 
                className="h-8 text-sm" 
                name="mobile"
                value={formState.mobile}
                onChange={handleInputChange}
              />
              <Input 
                placeholder="Email*" 
                className="h-8 text-sm" 
                name="email"
                value={formState.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <Input 
                placeholder="Age*" 
                className="h-8 text-sm" 
                name="age"
                value={formState.age}
                onChange={handleInputChange}
              />
              <Select 
                value={formState.gender} 
                onValueChange={(value) => setFormState(prev => ({ ...prev, gender: value }))}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Gender*" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-3">
              <Textarea 
                placeholder="Address (atleast 25 characters)*" 
                className="min-h-[60px] text-sm resize-none"
                name="address"
                value={formState.address}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <Select 
                value={formState.package} 
                onValueChange={(value) => setFormState(prev => ({ ...prev, package: value }))}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select Package*" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ESSENTIAL PACKAGE~999~PROJ1052742~280~1~10~1~0">Essential Package</SelectItem>
                  <SelectItem value="COMPREHENSIVE PACKAGE~1499~PROJ1052743~480~1~10~1~0">Comprehensive Package</SelectItem>
                  <SelectItem value="COUPLE PACKAGE~1575~PROJ1052746~585~2~2~2~0">Couple Package</SelectItem>
                  <SelectItem value="MALE FULL CHECKUP~2200~PROJ1052744~760~1~10~1~0">Male Full Checkup</SelectItem>
                  <SelectItem value="FEMALE FULL CHECKUP~2400~PROJ1052745~840~1~10~1~0">Female Full Checkup</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative">
                <Input 
                  placeholder="1" 
                  type="number" 
                  min="1" 
                  className="h-8 text-sm pr-8" 
                  name="quantity"
                  value={formState.quantity}
                  onChange={handleQuantityChange}
                  onClick={() => setIsBeneficiariesOpen(true)}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                     onClick={() => setIsBeneficiariesOpen(true)}>
                  <Users className="h-4 w-4 text-gray-500" />
                </div>
                
                {formState.beneficiaries.length > 0 && (
                  <div className="absolute -bottom-5 right-0 text-xs text-green-600">
                    {formState.beneficiaries.length} beneficiary added
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal h-8 text-sm text-gray-500"
                    type="button"
                  >
                    {date ? format(date, "PPP") : "Select Appointment Date*"}
                    <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setFormState(prev => ({ ...prev, appointmentDate: newDate }));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Select 
                value={formState.slot} 
                onValueChange={(value) => setFormState(prev => ({ ...prev, slot: value }))}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select Slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 mb-2 justify-center">
              <Checkbox 
                id="printed-reports" 
                checked={formState.printedReports}
                onCheckedChange={(checked) => 
                  setFormState(prev => ({ ...prev, printedReports: checked === true }))
                }
              />
              <label
                htmlFor="printed-reports"
                className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Additional Rs. 75 for Printed Reports
              </label>
            </div>
            
            <div className="mb-2">
              <div className="flex items-center justify-center mb-1 text-sm">Reach me on :</div>
              <div className="flex flex-wrap justify-center gap-2">
                <div className="flex items-center space-x-1">
                  <Checkbox 
                    id="whatsapp"
                    className="h-3 w-3"
                    checked={formState.contactPreferences.whatsapp}
                    onCheckedChange={(checked) => 
                      setFormState(prev => ({ 
                        ...prev, 
                        contactPreferences: {
                          ...prev.contactPreferences,
                          whatsapp: checked === true
                        }
                      }))
                    }
                  />
                  <label
                    htmlFor="whatsapp"
                    className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Whatsapp
                  </label>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Checkbox 
                    id="call"
                    className="h-3 w-3"
                    checked={formState.contactPreferences.call}
                    onCheckedChange={(checked) => 
                      setFormState(prev => ({ 
                        ...prev, 
                        contactPreferences: {
                          ...prev.contactPreferences,
                          call: checked === true
                        }
                      }))
                    }
                  />
                  <label
                    htmlFor="call"
                    className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Call
                  </label>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Checkbox 
                    id="email"
                    className="h-3 w-3"
                    checked={formState.contactPreferences.email}
                    onCheckedChange={(checked) => 
                      setFormState(prev => ({ 
                        ...prev, 
                        contactPreferences: {
                          ...prev.contactPreferences,
                          email: checked === true
                        }
                      }))
                    }
                  />
                  <label
                    htmlFor="email"
                    className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Checkbox 
                    id="sms"
                    className="h-3 w-3"
                    checked={formState.contactPreferences.sms}
                    onCheckedChange={(checked) => 
                      setFormState(prev => ({ 
                        ...prev, 
                        contactPreferences: {
                          ...prev.contactPreferences,
                          sms: checked === true
                        }
                      }))
                    }
                  />
                  <label
                    htmlFor="sms"
                    className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    SMS
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 mb-3 px-2">
              <Checkbox 
                id="authorize" 
                className="mt-1 h-3 w-3"
                checked={formState.authorized}
                onCheckedChange={(checked) => 
                  setFormState(prev => ({ ...prev, authorized: checked === true }))
                }
              />
              <label
                htmlFor="authorize"
                className="text-xs text-center leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I authorize Thyrocare representative to contact me. I understand that this will override the DND status on my mobile number.*
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-1 h-8"
              disabled={!isPincodeValid}
            >
              Book
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Beneficiaries Popup */}
      <BeneficiariesPopup
        isOpen={isBeneficiariesOpen}
        onClose={() => setIsBeneficiariesOpen(false)}
        onAddBeneficiaries={handleAddBeneficiaries}
        quantity={parseInt(formState.quantity)}
      />
    </div>
  )
}