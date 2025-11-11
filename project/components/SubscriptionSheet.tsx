'use client';

import { useState } from 'react';
import { Lock, Users, CheckCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { Community } from '@/lib/types';

interface SubscriptionSheetProps {
  open: boolean;
  onClose: () => void;
  community: Community | null;
  onConfirm: (communityId: string, trial: boolean) => Promise<void>;
}

export default function SubscriptionSheet({
  open,
  onClose,
  community,
  onConfirm,
}: SubscriptionSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [enableTrial, setEnableTrial] = useState(true);

  if (!community) return null;

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await onConfirm(community.id, enableTrial);
      onClose();
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-auto max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Join Community
          </SheetTitle>
          <SheetDescription>
            Subscribe to get exclusive access
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-6">
          <div className="space-y-3">
            <img
              src={community.cover_url}
              alt={community.name}
              className="w-full h-32 rounded-lg object-cover"
            />
            <h3 className="font-semibold text-lg">{community.name}</h3>
            <p className="text-sm text-muted-foreground">{community.description}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{community.members_count.toLocaleString()} members</span>
            </div>
          </div>

          <div className="bg-secondary/50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Monthly Subscription</span>
              <span className="font-semibold text-lg">
                ${(community.monthly_price_cents / 100).toFixed(2)}/mo
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="trial-toggle" className="text-sm font-medium">
                  Start with free trial
                </Label>
                <p className="text-xs text-muted-foreground">
                  7 days free, then ${(community.monthly_price_cents / 100).toFixed(2)}/month
                </p>
              </div>
              <Switch
                id="trial-toggle"
                checked={enableTrial}
                onCheckedChange={setEnableTrial}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">What's included:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Access to all exclusive community content</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Weekly live Q&A sessions with creators</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Members-only discussion forum</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Cancel anytime, no questions asked</span>
              </li>
            </ul>
          </div>

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
            onClick={handleSubscribe}
            className="flex-1 bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading
              ? 'Processing...'
              : enableTrial
              ? 'Start Free Trial'
              : 'Subscribe Now'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
