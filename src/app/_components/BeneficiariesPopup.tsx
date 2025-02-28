"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { X } from "lucide-react";

interface Beneficiary {
  id?: string;
  name: string;
  gender: string;
  age: string;
}

interface BeneficiariesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBeneficiaries: (beneficiaries: Beneficiary[]) => void;
  quantity: number;
  initialBeneficiaries?: Beneficiary[];
}

export default function BeneficiariesPopup({ 
  isOpen, 
  onClose, 
  onAddBeneficiaries, 
  quantity,
  initialBeneficiaries = [] 
}: BeneficiariesPopupProps) {
  // Initialize beneficiaries array
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(
    initialBeneficiaries.length > 0 
      ? initialBeneficiaries 
      : [{ id: '1', name: '', gender: '', age: '' }]
  );

  // Ensure we have the right number of beneficiaries when quantity changes
  useEffect(() => {
    if (beneficiaries.length < quantity) {
      const newBens = [...beneficiaries];
      for (let i = beneficiaries.length; i < quantity; i++) {
        newBens.push({ 
          id: (i+1).toString(), 
          name: '', 
          gender: '', 
          age: '' 
        });
      }
      setBeneficiaries(newBens);
    } else if (beneficiaries.length > quantity) {
      setBeneficiaries(beneficiaries.slice(0, quantity));
    }
  }, [quantity]);

  const handleInputChange = (index: number, field: keyof Beneficiary, value: string) => {
    const updatedBeneficiaries = [...beneficiaries];
    updatedBeneficiaries[index] = {
      ...updatedBeneficiaries[index]!,
      [field]: value
    };
    setBeneficiaries(updatedBeneficiaries);
  };

  const addBeneficiaryRow = () => {
      const newBeneficiary = { 
        id: Date.now().toString(), 
        name: '', 
        gender: '', 
        age: '' 
      };
      setBeneficiaries([...beneficiaries, newBeneficiary]);
  };

  const removeBeneficiaryRow = (index: number) => {
    if (beneficiaries.length > 1) {
      const updatedBeneficiaries = beneficiaries.filter((_, i) => i !== index);
      setBeneficiaries(updatedBeneficiaries);
    }
  };

  const handleSubmit = () => {
    onAddBeneficiaries(beneficiaries);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden bg-white rounded-lg border-0 shadow-xl max-w-md mx-auto">
        <DialogHeader className="p-4 bg-white border-b">
          <DialogTitle className="text-center text-lg font-medium">Add Beneficiaries</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
          {beneficiaries.map((ben, index) => (
            <div key={ben.id || index} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6">
                <Input
                  placeholder="Enter Name Here"
                  value={ben.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                  className="w-full border-gray-300 rounded"
                />
              </div>
              <div className="col-span-3">
                <Select
                  value={ben.gender}
                  onValueChange={(value) => handleInputChange(index, 'gender', value)}
                >
                  <SelectTrigger className="border-gray-300 rounded">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Input
                  placeholder="Age"
                  type="text"
                  value={ben.age}
                  onChange={(e) => handleInputChange(index, 'age', e.target.value)}
                  className="w-full border-gray-300 rounded"
                />
              </div>
              <div className="col-span-1 flex justify-center">
                {index === beneficiaries.length - 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 w-10 p-0 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={addBeneficiaryRow}
                    // disabled={beneficiaries.length >= quantity}
                  >
                    +
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 w-10 p-0 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => removeBeneficiaryRow(index)}
                  >
                    -
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex border-t">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="flex-1 m-0 rounded-none h-12 text-gray-700 font-normal hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex-1 m-0 rounded-none bg-blue-600 hover:bg-blue-700 text-white h-12 font-normal"
          >
            Add beneficiary
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}