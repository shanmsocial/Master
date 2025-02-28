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
import { X } from 'lucide-react';

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
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    if (beneficiaries.length > quantity) {
      setBeneficiaries(beneficiaries.slice(0, quantity));
    }
  }, [quantity]);

  useEffect(() => {
    if (beneficiaries[currentIndex]) {
      setName(beneficiaries[currentIndex]?.name ?? '');
      setGender(beneficiaries[currentIndex]?.gender ?? '');
      setAge(beneficiaries[currentIndex]?.age ?? '');
    } else {
      setName('');
      setGender('');
      setAge('');
    }
  }, [currentIndex, beneficiaries]);

  useEffect(() => {
    if (beneficiaries[currentIndex]) {
      const updatedBeneficiaries = [...beneficiaries];
      updatedBeneficiaries[currentIndex] = {
        ...updatedBeneficiaries[currentIndex],
        name,
        gender,
        age
      };
      setBeneficiaries(updatedBeneficiaries);
    }
  }, [name, gender, age]);

  const addBeneficiary = () => {
    if (beneficiaries.length < quantity) {
      const newId = Date.now().toString();
      const newBeneficiaries = [...beneficiaries, { id: newId, name: '', gender: '', age: '' }];
      setBeneficiaries(newBeneficiaries);
      setCurrentIndex(newBeneficiaries.length - 1);
    }
  };

  const removeBeneficiary = (index: number) => {
    if (beneficiaries.length > 1) {
      const newBeneficiaries = [...beneficiaries];
      newBeneficiaries.splice(index, 1);
      setBeneficiaries(newBeneficiaries);
      setCurrentIndex(Math.min(currentIndex, newBeneficiaries.length - 1));
    }
  };

  const handleSubmit = () => {
    onAddBeneficiaries(beneficiaries);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white rounded-none sm:rounded-md">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-center text-lg font-semibold">Add Beneficiaries</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          {/* List of added beneficiaries */}
          <div className="space-y-2">
            {beneficiaries.map((beneficiary, index) => (
              <div key={beneficiary.id} className="flex justify-between items-center p-2 border rounded-md">
                <div>
                  <p className="font-medium">{beneficiary.name}</p>
                  <p className="text-sm text-gray-500">{beneficiary.gender}, {beneficiary.age} years</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="p-2"
                  onClick={() => removeBeneficiary(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Current beneficiary input fields */}
          <div className="space-y-4">
            <Input
              className="h-12 rounded-md border-gray-300 px-4"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={gender}
                onValueChange={setGender}
              >
                <SelectTrigger className="h-12 rounded-md border-gray-300 px-4">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                className="h-12 rounded-md border-gray-300 px-4"
                placeholder="Age"
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>
          
          {/* Add/Remove buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              className="bg-blue-200 hover:bg-blue-300 text-blue-700 rounded-md h-10 w-10 p-0 flex items-center justify-center"
              onClick={addBeneficiary}
              disabled={beneficiaries.length >= quantity}
            >
              +
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="bg-blue-200 hover:bg-blue-300 text-blue-700 rounded-md h-10 w-10 p-0 flex items-center justify-center"
              onClick={() => removeBeneficiary(currentIndex)}
              disabled={beneficiaries.length <= 1}
            >
              -
            </Button>
          </div>
        </div>
        
        <div className="flex border-t">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="flex-1 m-0 rounded-none h-12 font-normal hover:bg-gray-50"
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