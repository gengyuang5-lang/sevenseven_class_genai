'use client';

import { Wallet, CreditCard, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function WalletPage() {
  const transactions = [
    {
      id: '1',
      type: 'tip_sent',
      amount: -0.10,
      title: 'Tip to Alex Rivera',
      post: 'The 3-Minute Focus Reset',
      date: '2024-01-15',
    },
    {
      id: '2',
      type: 'subscription',
      amount: -3.0,
      title: 'Subscription to Sam Chen',
      date: '2024-01-14',
    },
    {
      id: '3',
      type: 'tip_received',
      amount: 0.50,
      title: 'Tip from @johndoe',
      post: 'Your Video Post',
      date: '2024-01-12',
    },
    {
      id: '4',
      type: 'tip_received',
      amount: 0.05,
      title: 'Tip from @jane_creator',
      post: 'Your Article',
      date: '2024-01-11',
    },
    {
      id: '5',
      type: 'add_funds',
      amount: 20.0,
      title: 'Added funds',
      date: '2024-01-10',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Wallet</h1>
          <p className="text-muted-foreground">Manage your balance and transactions</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-4">$17.45</p>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Funds
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-accent" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                  <div className="h-10 w-16 rounded bg-background flex items-center justify-center">
                    <span className="text-xs font-bold">VISA</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">•••• 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/25</p>
                  </div>
                  <Badge variant="secondary">Default</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent wallet activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((tx) => {
                const isIncoming = tx.amount > 0;
                const Icon = isIncoming ? ArrowDownRight : ArrowUpRight;
                const color = isIncoming ? 'text-emerald-500' : 'text-muted-foreground';

                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <div className={`h-10 w-10 rounded-full bg-background flex items-center justify-center ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{tx.title}</p>
                      {tx.post && (
                        <p className="text-sm text-muted-foreground">{tx.post}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{tx.date}</p>
                    </div>
                    <p className={`font-semibold ${isIncoming ? 'text-emerald-500' : 'text-foreground'}`}>
                      {isIncoming ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
