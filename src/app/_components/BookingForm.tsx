"use client";

import React from 'react'
import { useState, useEffect } from "react";
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
import { useRouter } from 'next/navigation';

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

interface FormErrors {
  name?: string;
  age?: string;
  address?: string;
  email?: string;
  mobile?: string;
}

interface TimeSlot {
  id: string;
  slotMasterId: string;
  slot: string;
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
    authorized: true,
    beneficiaries: []
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isPincodeValid, setIsPincodeValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isBeneficiariesOpen, setIsBeneficiariesOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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

      // if (!isValid) {
      //   toast({
      //     title: "Invalid Pincode",
      //     description: "Service is not available at this pincode.",
      //     variant: "destructive",
      //   });
      // }
    } catch (error) {
      console.error("Error validating pincode:", error);
      setIsPincodeValid(false);
      // toast({
      //   title: "Validation Error",
      //   description: "Could not validate pincode. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsValidating(false);
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow digits and max 6 characters
    if (/^\d{0,6}$/.test(value)) {
      setFormState(prev => ({ ...prev, pincode: value }));

      if (value.length === 6) {
        validatePincode(value);
      } else if (value.length > 0) {
        setIsPincodeValid(null);
      }
    }
  };

  // Calendar functions to disable past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day

  const isPastDate = (date: Date) => {
    return date < today;
  };

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name should contain only alphabets";
    return undefined;
  };

  const validateAge = (age: string): string | undefined => {
    if (!age.trim()) return "Age is required";
    if (!/^\d{1,3}$/.test(age)) return "Age should be a number (max 3 digits)";
    const ageNum = parseInt(age);
    if (ageNum <= 0 || ageNum > 120) return "Age should be between 1 and 120";
    return undefined;
  };

  const validateAddress = (address: string): string | undefined => {
    if (!address.trim()) return "Address is required";
    if (address.trim().length < 25) return "Address should be at least 25 characters";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validateMobile = (mobile: string): string | undefined => {
    if (!mobile.trim()) return "Mobile number is required";
    if (!/^\d{10}$/.test(mobile)) return "Mobile number should be 10 digits";
    return undefined;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Special handling for mobile field
    if (name === 'mobile') {
      // Only allow digits and max 10 characters for mobile
      if (/^\d{0,10}$/.test(value)) {
        setFormState(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateField = (name: string, value: string) => {
    let error;
    switch (name) {
      case 'name':
        error = validateName(value);
        break;
      case 'age':
        error = validateAge(value);
        break;
      case 'address':
        error = validateAddress(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'mobile':
        error = validateMobile(value);
        break;
    }

    if (error) {
      setFormErrors(prev => ({ ...prev, [name]: error }));
      return false;
    }
    return true;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
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

      // Validate the newly set fields
      validateField('name', primaryBeneficiary?.name!);
      validateField('age', primaryBeneficiary?.age!);
    }

    toast({
      title: "Beneficiaries Added",
      description: `${beneficiaries.length} beneficiary information added successfully.`
    });
  };

  const validateForm = (): boolean => {
    const nameError = validateName(formState.name);
    const ageError = validateAge(formState.age);
    const addressError = validateAddress(formState.address);
    const emailError = validateEmail(formState.email);
    const mobileError = validateMobile(formState.mobile);

    const newErrors: FormErrors = {
      name: nameError,
      age: ageError,
      address: addressError,
      email: emailError,
      mobile: mobileError
    };

    setFormErrors(newErrors);

    return !nameError && !ageError && !addressError && !emailError && !mobileError;
  };

  // Check if required fields are filled for appointment date selection
  const areRequiredFieldsFilledForAppointment = (): boolean => {
    if (!formState.pincode) {
      toast({
        title: "Pincode Required",
        description: "Please enter a pincode first.",
        variant: "destructive",
      });
      return false;
    }

    if (!formState.name) {
      toast({
        title: "Name Required",
        description: "Please enter your name before selecting a date.",
        variant: "destructive",
      });
      return false;
    }

    if (!formState.package) {
      toast({
        title: "Package Required",
        description: "Please select a package before choosing a date.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Extract package code from package value
  const getPackageCode = (): string => {
    if (!formState.package) return "";
    const parts = formState.package.split('~');
    return parts.length >= 3 ? parts[2]! : "";
  };

  // Fetch appointment slots
  const fetchAppointmentSlots = async (selectedDate: Date) => {
    if (!areRequiredFieldsFilledForAppointment()) {
      return;
    }

    setIsLoadingSlots(true);
    setAvailableSlots([]);

    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const packageCode = getPackageCode();

      // If pincode is invalid, provide generic time slots
      if (!isPincodeValid) {
        // Set generic time periods for invalid pincodes
        const genericSlots = [
          { id: "1", slotMasterId: "1", slot: "Morning (6:00 AM - 9:00 AM)" },
          { id: "2", slotMasterId: "2", slot: "Afternoon (11:00 AM - 2:00 PM)" },
          { id: "3", slotMasterId: "3", slot: "Evening (4:00 PM - 6:00 PM)" },
          { id: "4", slotMasterId: "4", slot: "Night (7:00 PM - 9:00 PM)" }
        ];
        setAvailableSlots(genericSlots);
        setIsLoadingSlots(false);
        return;
      }

      // Prepare patients array, always starting with the main person
      const patients = [{
        Id: 1,
        Name: formState.name,
        Age: parseInt(formState.age || "0"),
        Gender: formState.gender.charAt(0).toUpperCase()
      }];

      // Add additional beneficiaries if any
      if (formState.beneficiaries.length > 0) {
        formState.beneficiaries.forEach((ben, index) => {
          // Skip if this is duplicating the main person
          if (ben.name === formState.name && ben.age === formState.age && ben.gender === formState.gender) {
            return;
          }

          patients.push({
            Id: index + 2, // Start from 2 since the main person is Id 1
            Name: ben.name,
            Age: parseInt(ben.age),
            Gender: ben.gender.charAt(0).toUpperCase()
          });
        });
      }

      const response = await fetch('/api/get-appointment-slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formattedDate,
          pincode: formState.pincode,
          strproducts: formState.package,
          benCount: parseInt(formState.quantity),
          patients: patients,
          items: [{
            Id: packageCode,
            PatientQuantity: parseInt(formState.quantity),
            PatientIds: Array.from({ length: parseInt(formState.quantity) }, (_, i) => i + 1)
          }]
        })
      });

      const data = await response.json();

      if (data?.lSlotDataRes && Array.isArray(data.lSlotDataRes)) {
        const slots = data.lSlotDataRes.map((slot: any) => ({
          id: slot.id,
          slotMasterId: slot.slotMasterId,
          slot: slot.slot
        }));

        setAvailableSlots(slots);

        if (slots.length === 0) {
          toast({
            title: "No Slots Available",
            description: "No appointment slots available for the selected date. Please try another date.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error Fetching Slots",
          description: "Could not retrieve available slots. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching appointment slots:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to fetch appointment slots. Please try again later.",
      //   variant: "destructive",
      // });
      const genericSlots = [
        { id: "1", slotMasterId: "1", slot: "Morning (6:00 AM - 9:00 AM)" },
        { id: "2", slotMasterId: "2", slot: "Afternoon (11:00 AM - 2:00 PM)" },
        { id: "3", slotMasterId: "3", slot: "Evening (4:00 PM - 6:00 PM)" },
        { id: "4", slotMasterId: "4", slot: "Night (7:00 PM - 9:00 PM)" }
      ];
      setAvailableSlots(genericSlots);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setFormState(prev => ({ ...prev, appointmentDate: selectedDate }));

    if (selectedDate) {
      fetchAppointmentSlots(selectedDate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const isValid = validateForm();

    if (!isValid) {
      toast({
        title: "Form Validation Error",
        description: "Please check the form for errors and try again.",
        variant: "destructive",
      });
      return;
    }

    // if (!isPincodeValid) {
    //   toast({
    //     title: "Invalid Pincode",
    //     description: "Please enter a valid pincode before submitting.",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    // Check if we have enough beneficiaries (minus the main person who's always included)
    // So if quantity is 3, we need 2 additional beneficiaries (plus the main person)
    if (parseInt(formState.quantity) > 1 && formState.beneficiaries.length < parseInt(formState.quantity) - 1) {
      toast({
        title: "Incomplete Information",
        description: `Please add all ${parseInt(formState.quantity) - 1} additional beneficiaries before submitting.`,
        variant: "destructive",
      });
      return;
    }

    // Format date for API
    const formattedDate = formState.appointmentDate ?
      `${format(formState.appointmentDate, "yyyy-MM-dd")} ${formState.slot.split(' - ')[0]}` : "";

    // Get product code from package
    const packageCode = getPackageCode();

    // Format beneficiaries data, always including the main person first
    const benData = [{
      name: formState.name,
      age: formState.age,
      gender: formState.gender.charAt(0).toUpperCase() + formState.gender.slice(1)
    }];

    // Then add any additional beneficiaries 
    if (formState.beneficiaries.length > 0) {
      // Filter out any beneficiary that might be duplicating the main person
      // (in case the main person was also added as first beneficiary)
      const additionalBeneficiaries = formState.beneficiaries.filter(ben =>
        !(ben.name === formState.name && ben.age === formState.age && ben.gender === formState.gender)
      );

      // Add the additional beneficiaries to the benData array
      additionalBeneficiaries.forEach(ben => {
        benData.push({
          name: ben.name,
          age: ben.age,
          gender: ben.gender.charAt(0).toUpperCase() + ben.gender.slice(1)
        });
      });
    }

    try {
      // Generate a unique reference order ID
      const refOrderId = `ORD${Date.now()}`;

      // Create order payload
      const orderPayload = {
        "ref_order_id": refOrderId,
        "email": formState.email,
        "mobile": formState.mobile,
        "address": formState.address,
        "appt_date": formattedDate,
        "order_by": formState.name,
        "passon": 0,
        "pay_type": "POSTPAID",
        "pincode": formState.pincode,
        "products": "PROJ1024559",
        // "products": packageCode,
        "ref_code": "8122206688",
        "remarks": `${formState.package.split('~')[0]} booking`,
        "reports": formState.printedReports ? "Y" : "N",
        "service_type": "HOME",
        "ben_data": benData,
        "coupon": "",
        "order_mode": "DSA-BOOKING-API",
        "collection_type": "",
        "source": "THYROCARELANDINGPAGE"
      };


      // Show loading state
      toast({
        title: "Processing",
        description: "Your booking is being processed...",
      });

      // If pincode is invalid, log to a different sheet and show success without actual API call
      if (!isPincodeValid) {
        // Log to special sheet for manual handling
        await fetch('/api/log-to-sheets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sheetName: "FailedOrders",
            orderDate: new Date().toISOString().split('T')[0],
            paymentMode: "POSTPAID",
            preferredDateTime: formattedDate,
            beneficiaryName: formState.name,
            testDetails: formState.package.split('~')[0] || "",
            mobileNumber: formState.mobile,
            emailAddress: formState.email,
            address: formState.address,
            pincode: formState.pincode,
            errorMessage: "Invalid Pincode",
            timestamp: new Date().toISOString()
          })
        });

        await fetch('/api/send-error-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject: "Booking Form Error",
            errorMessage: "Invalid Pincode",
            orderDetails: {
              name: formState.name,
              email: formState.email,
              mobile: formState.mobile,
              package: formState.package.split('~')[0] || "",
              pincode: formState.pincode,
            }
          })
        });

        // Show success message
        toast({
          title: "Booking Successful",
          description: "Your test booking has been confirmed.",
        });

        // Redirect to a fake order summary with the reference ID
        router.push(`/order-summary?orderId=${refOrderId}`);
        return;
      }

      // Submit the order
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (data.response_status === 1) {
        toast({
          title: "Booking Successful",
          description: "Your test booking has been confirmed.",
        });

        const orderId = data.order_no || "";

        // Fetch order summary data to log to Google Sheets
        try {
          const summaryResponse = await fetch('/api/order-summary', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId })
          });

          const summaryData = await summaryResponse.json();

          if (summaryData) {
            // Extract the data we want to log
            const orderDetails = summaryData.orderMaster[0];
            const beneficiary = summaryData.benMaster[0];
            const preferredDate = summaryData.leadHistoryMaster[0]?.appointOn[0]?.date || 'Not scheduled';
            const orderDate = summaryData.leadHistoryMaster[0]?.bookedOn[0]?.date?.split(' ')[0] || '';

            // Log the order data to Google Sheets
            await fetch('/api/log-to-sheets', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderNo: orderDetails?.orderNo,
                orderDate: orderDate,
                paymentMode: orderDetails?.payType,
                preferredDateTime: preferredDate,
                rate: orderDetails?.rate,
                beneficiaryName: beneficiary?.name,
                testDetails: orderDetails?.products,
                mobileNumber: beneficiary?.mobile,
                emailAddress: orderDetails?.email,
                address: orderDetails?.address,
                timestamp: new Date().toISOString()
              })
            });

            console.log("Order logged to Google Sheets");
          }
        } catch (error) {
          console.error("Error logging to Google Sheets:", error);
          // Continue with redirect even if logging fails
        }
        router.push(`/order-summary?orderId=${orderId}`);

        // Reset form or redirect to success page
        // setFormState(initialFormState);
      } else {
        toast({
          title: "Booking Failed",
          description: data.message || "Failed to create your booking. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Booking Successful",
        description: "Your test booking has been confirmed.",
      });

      // Log the error for internal tracking
      console.error("Error creating order:", error);
      const err = error as Error;

      // Generate a fake order ID
      const fakeOrderId = `ORD${Date.now()}`;

      // Log to the special sheet
      try {
        await fetch('/api/log-to-sheets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sheetName: "FailedOrders",
            orderDate: new Date().toISOString().split('T')[0],
            paymentMode: "POSTPAID",
            preferredDateTime: formattedDate,
            beneficiaryName: formState.name,
            testDetails: formState.package.split('~')[0] || "",
            mobileNumber: formState.mobile,
            emailAddress: formState.email,
            address: formState.address,
            pincode: formState.pincode,
            errorMessage: err.message.toString(),
            timestamp: new Date().toISOString()
          })
        });


        await fetch('/api/send-error-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject: "Booking Form Error",
            errorMessage: err.message.toString(),
            orderDetails: {
              name: formState.name,
              email: formState.email,
              mobile: formState.mobile,
              package: formState.package.split('~')[0] || "",
              pincode: formState.pincode,
            }
          })
        });
      } catch (logError) {
        console.error("Error logging to sheets:", logError);
      }

      // Still redirect to fake order summary
      router.push(`/order-summary?orderId=${fakeOrderId}`);
    }
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
                    isPincodeValid === false ? "border-green-500 pr-10" : "",
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
                  // <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  //   <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  //   </svg>
                  // </div>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="relative">
                <Input
                  placeholder="Enter Name*"
                  className={cn(
                    "h-8 text-sm",
                    formErrors.name ? "border-red-500" : ""
                  )}
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs -bottom-5">{formErrors.name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="relative">
                <Input
                  placeholder="Enter Mobile No*"
                  className={cn(
                    "h-8 text-sm",
                    formErrors.mobile ? "border-red-500" : ""
                  )}
                  name="mobile"
                  value={formState.mobile}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {formErrors.mobile && (
                  <p className="text-red-500 text-xs -bottom-5">{formErrors.mobile}</p>
                )}
              </div>
              <div className="relative">
                <Input
                  placeholder="Email*"
                  className={cn(
                    "h-8 text-sm",
                    formErrors.email ? "border-red-500" : ""
                  )}
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs -bottom-5">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="relative">
                <Input
                  placeholder="Age*"
                  className={cn(
                    "h-8 text-sm",
                    formErrors.age ? "border-red-500" : ""
                  )}
                  name="age"
                  value={formState.age}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {formErrors.age && (
                  <p className="text-red-500 text-xs -bottom-5">{formErrors.age}</p>
                )}
              </div>
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

            <div className="mb-3 relative">
              <Textarea
                placeholder="Address (at least 25 characters)*"
                className={cn(
                  "min-h-[60px] text-sm resize-none",
                  formErrors.address ? "border-red-500" : ""
                )}
                name="address"
                value={formState.address}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              {formErrors.address && (
                <p className="text-red-500 text-xs -bottom-5">{formErrors.address}</p>
              )}
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
                  min="0"
                  className="h-8 text-sm pr-8"
                  name="quantity"
                  value={formState.beneficiaries.length}
                  onChange={handleQuantityChange}
                  onClick={() => setIsBeneficiariesOpen(true)}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setIsBeneficiariesOpen(true)}>
                  <Users className="h-4 w-4 text-gray-500" />
                </div>

                {formState.beneficiaries.length > 0 && (
                  <div className="-bottom-5 right-0 text-xs text-green-600">
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
                    // disabled={!isPincodeValid}
                    onClick={() => {
                      if (!areRequiredFieldsFilledForAppointment()) {
                        // Prevent opening the calendar if required fields are missing
                        return;
                      }
                    }}
                  >
                    {date ? format(date, "PPP") : "Select Appointment Date*"}
                    <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={isPastDate}
                    initialFocus
                    fromDate={today}
                  />
                </PopoverContent>
              </Popover>
              <Select
                value={formState.slot}
                onValueChange={(value) => setFormState(prev => ({ ...prev, slot: value }))}
                disabled={availableSlots.length === 0 || isLoadingSlots}
              >
                <SelectTrigger className={cn(
                  "h-8 text-sm",
                  (availableSlots.length === 0) && "opacity-50 cursor-not-allowed"
                )}>
                  <SelectValue placeholder={isLoadingSlots ? "Loading slots..." : "Select Slot"} />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots.map((slot) => (
                    <SelectItem key={slot.id} value={slot.slot}>{slot.slot}</SelectItem>
                  ))}
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
              {/* <Checkbox
                id="authorize"
                className="mt-1 h-3 w-3"
                checked={formState.authorized}
                onCheckedChange={(checked) =>
                  setFormState(prev => ({ ...prev, authorized: checked === true }))
                }
              /> */}
              <label
                htmlFor="authorize"
                className="text-xs text-center leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                By clicking &apos;Book&apos;, I consent to being contacted by a Thyrocare representative, even if my number is registered under DND. I understand this authorization overrides DND status.
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-1 h-8"
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