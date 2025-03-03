import React from 'react';
import BookingForm from './_components/BookingForm';
import Image from 'next/image';
import PreventiveHealthSection from './_components/PreventiveHealthSection';
import WellnessPackagesComparison from './_components/WellnessPackagesComparison';
import ContactBanner from './_components/ContactBanner';
import ExitIntentPopup from './_components/ExitIntentPopup';
import OfferPopup from './_components/OfferPopup';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Popups */}
      <OfferPopup />
      <ExitIntentPopup />

      <ContactBanner />
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
          <div className="text-sm font-bold hidden lg:block">
            Have a Query? Give a Call on : <span className="text-blue-700 font-medium">09944320934</span>
          </div>
          <div className="text-sm font-bold block lg:hidden">
            <span className="text-blue-700 font-medium">09944320934</span>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Image and Booking Form */}
      <div className="relative w-full">
        {/* Desktop Version with Background Image and Form on right side */}
        <div className="hidden md:block relative w-full"
          style={{
            backgroundImage: "url('https://b2capi.thyrocare.com/wellness/Emailer/DM_landing_page/images/bg/PROJ1052742,PROJ1052743,PROJ1052746,PROJ1052744,PROJ1052745_banner.jpg')",
            overflow: "hidden",
            padding: "44px 0 44px",
            height: "620px",
            backgroundClip: "initial",
            backgroundColor: "rgba(0, 0, 0, 0)",
            backgroundOrigin: "initial",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",
            zIndex: "0"
          }}>
          <div className="container h-full relative">
            {/* Right side with form */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 max-w-md w-full p-4">
              <BookingForm />
            </div>
          </div>
        </div>

        {/* Mobile Version with Image (not background) */}
        <div className="block md:hidden w-full">
          <div className="w-full">
            <Image
              src="https://b2capi.thyrocare.com/wellness/Emailer/DM_landing_page/images/bg/PROJ1052742,PROJ1052743,PROJ1052746,PROJ1052744,PROJ1052745_mob.jpg"
              alt="Health Checkup Banner"
              width={800}
              height={400}
              layout="responsive"
            />
          </div>


          <BookingForm />

        </div>
      </div>
      <WellnessPackagesComparison />
      <PreventiveHealthSection />
    </div>
  );
}