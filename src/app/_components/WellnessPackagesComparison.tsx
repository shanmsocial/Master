'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WellnessPackagesComparison = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [packagesPerPage, setPackagesPerPage] = useState(4);
  
  // Update packages per page based on screen size
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setPackagesPerPage(1); // Mobile: 1 package
      } else if (window.innerWidth < 1024) {
        setPackagesPerPage(2); // Tablet: A2 packages
      } else {
        setPackagesPerPage(4); // Desktop: 4 packages
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Package data
  const packages = [
    {
      name: "ESSENTIAL PACKAGE",
      price: "999/-",
      originalPrice: "₹1199/-",
      discount: "17%",
      tests: 66,
      components: [
        { name: "COMPLETE HEMOGRAM", count: 28 },
        { name: "LIVER", count: 12 },
        { name: "LIPID", count: 10 },
        { name: "DIABETES", count: 2 },
        { name: "THYROID", count: 1 },
        { name: "IRON DEFICIENCY", count: 4 },
        { name: "RENAL", count: 7 },
        { name: "VITAMINS", count: 2 },
      ]
    },
    {
      name: "COMPREHENSIVE PACKAGE",
      price: "1499/-",
      originalPrice: "₹1699/-",
      discount: "12%",
      tests: 78,
      components: [
        { name: "COMPLETE HEMOGRAM", count: 28 },
        { name: "LIVER", count: 12 },
        { name: "DIABETES", count: 4 },
        { name: "THYROID", count: 3 },
        { name: "LIPID", count: 10 },
        { name: "IRON DEFICIENCY", count: 4 },
        { name: "RENAL", count: 8 },
        { name: "VITAMINS", count: 2 },
        { name: "CARDIAC RISK MARKERS", count: 5 },
        { name: "ELEMENTS", count: 2 },
      ]
    },
    {
      name: "COUPLE PACKAGE",
      price: "3150/-",
      originalPrice: "₹3300/-",
      discount: "5%",
      tests: 98,
      components: [
        { name: "COMPLETE HEMOGRAM", count: 28 },
        { name: "DIABETES", count: 3 },
        { name: "LIVER", count: 12 },
        { name: "THYROID", count: 3 },
        { name: "LIPID", count: 10 },
        { name: "COMPLETE URINE ANALYSIS", count: 24 },
        { name: "ELECTROLYTES", count: 3 },
        { name: "IRON DEFICIENCY", count: 4 },
        { name: "INFECTIOUS DISEASES", count: 1 },
        { name: "RENAL", count: 7 },
        { name: "VITAMINS", count: 2 },
        { name: "OTHER COUNTS", count: 1 },
      ]
    },
    {
      name: "MALE FULL CHECKUP",
      price: "2200/-",
      originalPrice: "₹2400/-",
      discount: "8%",
      tests: 103,
      components: [
        { name: "COMPLETE HEMOGRAM", count: 28 },
        { name: "LIVER", count: 12 },
        { name: "TOXIC ELEMENTS", count: 22 },
        { name: "PANCREATIC", count: 1 },
        { name: "VITAMIN", count: 1 },
        { name: "THYROID", count: 3 },
        { name: "LIPID", count: 10 },
        { name: "DIABETES", count: 2 },
        { name: "ELECTROLYTES", count: 3 },
        { name: "IRON DEFICIENCY", count: 4 },
        { name: "RENAL", count: 7 },
        { name: "VITAMINS", count: 2 },
        { name: "CARDIAC RISK MARKERS", count: 5 },
        { name: "PANCREATIC", count: 1 },
        { name: "CANCER MARKERS", count: 1 },
        { name: "HORMONE", count: 1 },
      ]
    },
    {
      name: "FEMALE FULL CHECKUP",
      price: "2400/-",
      originalPrice: "₹2600/-",
      discount: "8%",
      tests: 108,
      components: [
        { name: "COMPLETE HEMOGRAM", count: 28 },
        { name: "LIVER", count: 12 },
        { name: "TOXIC ELEMENTS", count: 22 },
        { name: "PANCREATIC", count: 1 },
        { name: "VITAMIN", count: 1 },
        { name: "THYROID", count: 3 },
        { name: "LIPID", count: 10 },
        { name: "DIABETES", count: 2 },
        { name: "ELECTROLYTES", count: 3 },
        { name: "IRON DEFICIENCY", count: 4 },
        { name: "RENAL", count: 7 },
        { name: "VITAMINS", count: 2 },
        { name: "CARDIAC RISK MARKERS", count: 5 },
        { name: "CANCER MARKERS", count: 2 },
        { name: "HORMONE", count: 6 },
      ]
    }
  ];

  // Calculate total pages - this will update when packagesPerPage changes
  const totalPages = Math.ceil(packages.length / packagesPerPage);
  
  // Ensure current page is valid when total pages changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Get current packages
  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = packages.slice(indexOfFirstPackage, indexOfLastPackage);

  // Change page
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Calculate number of items to show in pagination
  const getPageNumbers = () => {
    // Default to desktop (5 buttons)
    const maxPageButtons = 5;
    
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Always include first, last, and current page
    const pageNumbers = new Set([1, totalPages, currentPage]);
    
    // Add pages before and after current page
    let before = currentPage - 1;
    let after = currentPage + 1;
    
    // Keep adding pages until we have enough
    while (pageNumbers.size < maxPageButtons && (before >= 1 || after <= totalPages)) {
      if (before >= 1) pageNumbers.add(before--);
      if (pageNumbers.size < maxPageButtons && after <= totalPages) pageNumbers.add(after++);
    }
    
    return Array.from(pageNumbers).sort((a, b) => a - b);
  };

  return (
    <div className="w-full px-4 py-8 bg-gray-50 mt-8">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Compare Wellness Packages</h1>
      
      <div className="relative">
        {/* Packages Container */}
        <div className="flex flex-wrap -mx-2">
          {currentPackages.map((pkg, index) => (
            <div key={index} className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
              <div className="bg-white rounded-md shadow-sm flex flex-col">
                {/* Package Header */}
                <div className="text-center py-3 bg-gray-100 border-b">
                  <h3 className="text-sm font-semibold text-blue-800">{pkg.name}</h3>
                </div>
                
                {/* Price Section with Discount */}
                <div className="relative bg-gradient-to-r from-[#2b569a] to-[#9cbced] text-white p-4 flex flex-col items-center justify-center">
                  {pkg.discount && (
                    <div className="absolute top-2 left-2 bg-[#9cbced] rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold">
                      -{pkg.discount}
                    </div>
                  )}
                  <div className="text-xl font-bold">{pkg.price}</div>
                  <div className="text-sm line-through opacity-80">{pkg.originalPrice}</div>
                  <div className="text-xs mt-1">({pkg.tests} tests)</div>
                </div>
                
                {/* Test Components - No scrolling, fixed display */}
                <div className="divide-y flex-grow">
                  {pkg.components.map((component, idx) => (
                    <div key={idx} className="py-2 px-4 text-gray-700 text-sm flex justify-between items-center bg-gray-50 hover:bg-gray-100">
                      <span>{component.name}</span>
                      <span className="text-gray-500 ml-2">({component.count})</span>
                    </div>
                  ))}
                </div>
                
                {/* Book Now Button */}
                <div className="p-4 flex justify-center mt-auto">
                  <button className="bg-[#2b569a] hover:bg-blue-800 text-white font-medium py-2 px-6 rounded">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows - Make them more prominent on mobile */}
        <div className="flex justify-between mt-4 sm:mt-0">
          {/* Left Arrow */}
          <button 
            onClick={goToPrevPage}
            className={`bg-white rounded-full p-2 shadow-md ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            aria-label="Previous page"
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-5 w-5 text-blue-700" />
          </button>
          
          {/* Right Arrow */}
          <button 
            onClick={goToNextPage}
            className={`bg-white rounded-full p-2 shadow-md ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            aria-label="Next page"
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-5 w-5 text-blue-700" />
          </button>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 flex-wrap">
        {getPageNumbers().map((page, index, array) => (
          <React.Fragment key={page}>
            {index > 0 && array[index - 1] !== page - 1 && (
              <span className="mx-1 text-gray-500">...</span>
            )}
            <button
              onClick={() => goToPage(page)}
              className={`mx-1 w-8 h-8 rounded-full flex items-center justify-center ${
                currentPage === page
                  ? 'bg-blue-700 text-white'
                  : 'bg-white text-blue-700 border border-blue-700'
              }`}
            >
              {page}
            </button>
          </React.Fragment>
        ))}
      </div>
      
      {/* Page indicator for mobile */}
      <div className="text-center mt-4 text-sm text-gray-500 sm:hidden">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default WellnessPackagesComparison;