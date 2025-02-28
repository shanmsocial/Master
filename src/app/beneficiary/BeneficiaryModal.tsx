// app/components/BeneficiaryModal.tsx
"use client";

import { useState, useEffect } from "react";
import { PlusCircle, MinusCircle, X } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface Beneficiary {
  id: number;
  name: string;
  gender: string;
  age: string;
}

interface BeneficiaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (beneficiaries: Beneficiary[]) => void;
  initialBeneficiaries?: Beneficiary[];
}

export function BeneficiaryModal({
  open,
  onOpenChange,
  onSave,
  initialBeneficiaries = [],
}: BeneficiaryModalProps) {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);
  const [currentName, setCurrentName] = useState<string>("");
  const [currentGender, setCurrentGender] = useState<string>("");
  const [currentAge, setCurrentAge] = useState<string>("");

  // Reset data when modal opens
  useEffect(() => {
    if (open) {
      setBeneficiaries(initialBeneficiaries);
      resetCurrentInputs();
    }
  }, [open, initialBeneficiaries]);

  const resetCurrentInputs = () => {
    setCurrentName("");
    setCurrentGender("");
    setCurrentAge("");
  };

  const addBeneficiary = () => {
    if (currentName.trim() && currentGender && currentAge) {
      const nextId = beneficiaries.length > 0 
        ? Math.max(...beneficiaries.map(b => b.id)) + 1 
        : 1;
        
      setBeneficiaries([
        ...beneficiaries,
        {
          id: nextId,
          name: currentName,
          gender: currentGender,
          age: currentAge,
        },
      ]);
      resetCurrentInputs();
    }
  };

  const removeBeneficiary = (id: number) => {
    setBeneficiaries(beneficiaries.filter(b => b.id !== id));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(beneficiaries);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Beneficiaries</DialogTitle>
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {beneficiaries.map((beneficiary) => (
            <div key={beneficiary.id} className="flex items-center gap-2">
              <Input
                value={beneficiary.name}
                readOnly
                className="flex-1"
              />
              
              <Select disabled value={beneficiary.gender}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                value={beneficiary.age}
                readOnly
                className="w-20"
                placeholder="Age"
              />
              
              <Button
                variant="default"
                size="icon"
                className="bg-blue-600 hover:bg-blue-700"
                type="button"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
              
              <Button
                variant="default"
                size="icon" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => removeBeneficiary(beneficiary.id)}
                type="button"
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex items-center gap-2">
            <Input
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              placeholder="Name"
              className="flex-1"
            />
            
            <Select 
              value={currentGender} 
              onValueChange={setCurrentGender}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              value={currentAge}
              onChange={(e) => setCurrentAge(e.target.value)}
              placeholder="Age"
              className="w-20"
              type="number"
            />
            
            <Button
              variant="default"
              size="icon"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={addBeneficiary}
              type="button"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
            
            <Button
              variant="default"
              size="icon"
              className="bg-blue-600 hover:bg-blue-700"
              type="button"
              disabled={!currentName}
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between gap-2">
          <Button 
            type="button" 
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 w-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            variant="default"
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 w-full"
          >
            Add beneficiary
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}