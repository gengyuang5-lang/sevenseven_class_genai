'use client';

import { useState } from 'react';
import { Heart, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TipModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => Promise<void>;
  articleTitle: string;
  authorName: string;
  presetAmount?: number;
}

export default function TipModal({
  open,
  onClose,
  onConfirm,
  articleTitle,
  authorName,
  presetAmount,
}: TipModalProps) {
  const [selectedAmount, setSelectedAmount] = useState(presetAmount || 10);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const presetAmounts = [5, 10, 50];

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const amount = customAmount ? Math.round(parseFloat(customAmount) * 100) : selectedAmount;
      await onConfirm(amount);
      onClose();
    } catch (error) {
      console.error('Tip failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Support the Creator
          </DialogTitle>
          <DialogDescription>
            Tip {authorName} for "{articleTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Choose an amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount && !customAmount ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className="rounded-full"
                >
                  ${(amount / 100).toFixed(2)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-amount">Or enter a custom amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="custom-amount"
                type="number"
                step="0.01"
                min="0.05"
                placeholder="1.00"
                className="pl-7"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 p-3 rounded-lg">
            <Lock className="h-4 w-4 flex-shrink-0" />
            <span>Secured by PCI-compliant processor</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-primary hover:bg-primary/90"
            disabled={isLoading || (!customAmount && !selectedAmount)}
          >
            {isLoading ? 'Processing...' : `Tip $${customAmount || (selectedAmount / 100).toFixed(2)}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
