"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { BeneficiaryModal } from "./BeneficiaryModal";

interface Beneficiary {
  id: number;
  name: string;
  gender: string;
  age: string;
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

  const handleSave = (savedBeneficiaries: Beneficiary[]) => {
    setBeneficiaries(savedBeneficiaries);
    console.log("Saved beneficiaries:", savedBeneficiaries);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Beneficiaries Management</h1>
      
      <Button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700">
        Open Beneficiaries Modal
      </Button>
      
      <BeneficiaryModal
        open={isOpen}
        onOpenChange={setIsOpen}
        onSave={handleSave}
        initialBeneficiaries={beneficiaries}
      />
      
      {beneficiaries.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Current Beneficiaries</h2>
          <div className="space-y-2">
            {beneficiaries.map((beneficiary) => (
              <div key={beneficiary.id} className="p-3 bg-gray-100 rounded-md">
                <p><strong>ID:</strong> {beneficiary.id}</p>
                <p><strong>Name:</strong> {beneficiary.name}</p>
                <p><strong>Gender:</strong> {beneficiary.gender}</p>
                <p><strong>Age:</strong> {beneficiary.age}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}