'use client';

import { useState } from 'react';
import { Lock, ShoppingCart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import type { Article } from '@/lib/types';

interface PurchaseSheetProps {
  open: boolean;
  onClose: () => void;
  article: Article | null;
  onConfirm: (articleId: string) => Promise<void>;
  hasPaymentMethod: boolean;
}

export default function PurchaseSheet({
  open,
  onClose,
  article,
  onConfirm,
  hasPaymentMethod,
}: PurchaseSheetProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!article) return null;

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      await onConfirm(article.id);
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Purchase Article
          </SheetTitle>
          <SheetDescription>
            Get instant access to this article
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-6">
          <div className="flex gap-4">
            <img
              src={article.thumbnail_url}
              alt={article.title}
              className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-2">{article.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                by {article.author.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {article.read_minutes} min read
              </p>
            </div>
          </div>

          <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Article Price</span>
              <span className="font-semibold text-lg">
                ${(article.price_cents / 100).toFixed(2)}
              </span>
            </div>
          </div>

          {!hasPaymentMethod && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm">
              <p className="text-yellow-800">
                You'll need to add a payment method to complete this purchase.
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Secured by PCI-compliant processor</span>
          </div>
        </div>

        <div className="flex gap-3 pb-4">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            className="flex-1 bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : hasPaymentMethod ? 'Buy Now' : 'Add Payment & Buy'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
