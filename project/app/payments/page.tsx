'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getPaymentMethods, addPaymentMethod } from '@/lib/api';
import type { PaymentMethod } from '@/lib/types';

export default function PaymentsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  async function loadPaymentMethods() {
    try {
      const data = await getPaymentMethods();
      setMethods(data);
    } catch (error) {
      console.error('Failed to load payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMethod(brand: string, last4: string) {
    try {
      const newMethod = await addPaymentMethod(brand, last4);
      setMethods([...methods, newMethod]);
      setAddDialogOpen(false);
      toast.success('Payment method added successfully');
    } catch (error) {
      toast.error('Failed to add payment method');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Payment Methods</h1>
            <p className="text-muted-foreground">Manage your payment methods</p>
          </div>
          <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Method
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : methods.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No payment methods</CardTitle>
              <CardDescription>Add a payment method to make purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Method
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {methods.map(method => (
              <Card key={method.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium capitalize">{method.brand}</p>
                        {method.is_default && (
                          <Check className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {method.last4 ? `•••• ${method.last4}` : 'Payment method'}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AddPaymentDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onAdd={handleAddMethod}
        />
      </div>
    </div>
  );
}

function AddPaymentDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (brand: string, last4: string) => void;
}) {
  const [brand, setBrand] = useState('visa');
  const [last4, setLast4] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd(brand, last4);
    setBrand('visa');
    setLast4('');
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a new payment method for purchases
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Card Type</Label>
            <select
              id="brand"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              <option value="visa">Visa</option>
              <option value="mc">Mastercard</option>
              <option value="amex">American Express</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="last4">Last 4 digits</Label>
            <Input
              id="last4"
              placeholder="1234"
              maxLength={4}
              value={last4}
              onChange={(e) => setLast4(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Method
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
