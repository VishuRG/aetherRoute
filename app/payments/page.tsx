'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, IndianRupee, CheckCircle2, XCircle, Clock,
  Download, ArrowRight, Wallet, Building2, Smartphone,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  method: string;
  status: 'success' | 'pending' | 'failed';
  date: string;
}

const demoTransactions: Transaction[] = [
  { id: 'tx1', description: 'Metro Ticket — DU to Noida', amount: 40, method: 'UPI', status: 'success', date: '2026-09-26' },
  { id: 'tx2', description: 'Metro Ticket — RC to Gurgaon', amount: 60, method: 'UPI', status: 'success', date: '2026-09-25' },
  { id: 'tx3', description: 'Bus Ticket — AV to RC', amount: 25, method: 'Card', status: 'success', date: '2026-09-23' },
  { id: 'tx4', description: 'Metro Ticket — Dwarka to CP', amount: 50, method: 'Net Banking', status: 'pending', date: '2026-09-20' },
  { id: 'tx5', description: 'Metro Ticket Refund', amount: -40, method: 'UPI', status: 'success', date: '2026-09-19' },
];

const statusMeta = {
  success: { label: 'Success', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', icon: CheckCircle2 },
  pending: { label: 'Pending', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', icon: Clock },
  failed: { label: 'Failed', color: 'bg-red-500/10 text-red-600 dark:text-red-400', icon: XCircle },
};

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(demoTransactions);
  const [method, setMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const newTx: Transaction = {
        id: `tx${Date.now()}`,
        description: 'Metro Ticket — Connaught Place to Saket',
        amount: 50,
        method: method === 'upi' ? 'UPI' : method === 'card' ? 'Card' : 'Net Banking',
        status: 'success',
        date: new Date().toISOString().slice(0, 10),
      };
      setTransactions([newTx, ...transactions]);
      toast.success('Payment successful!', {
        description: `Transaction ID: ECR-TX-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      });
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Payments</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pay for tickets and view transaction history</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Payment form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Metro Ticket</span>
                  <Badge variant="secondary" className="text-xs">Demo Payment</Badge>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium">Connaught Place</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm font-medium">Saket</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-display text-2xl font-bold">₹50</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Payment Method</Label>
                <RadioGroup value={method} onValueChange={setMethod}>
                  <div className="space-y-2">
                    <label className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${method === 'upi' ? 'border-emerald-500 bg-emerald-500/5' : 'border-border/40 hover:bg-accent/30'}`}>
                      <RadioGroupItem value="upi" />
                      <Smartphone className="h-5 w-5 text-violet-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">UPI</div>
                        <div className="text-xs text-muted-foreground">Pay via any UPI app</div>
                      </div>
                    </label>
                    <label className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${method === 'card' ? 'border-emerald-500 bg-emerald-500/5' : 'border-border/40 hover:bg-accent/30'}`}>
                      <RadioGroupItem value="card" />
                      <CreditCard className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Card</div>
                        <div className="text-xs text-muted-foreground">Credit / Debit card</div>
                      </div>
                    </label>
                    <label className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${method === 'netbanking' ? 'border-emerald-500 bg-emerald-500/5' : 'border-border/40 hover:bg-accent/30'}`}>
                      <RadioGroupItem value="netbanking" />
                      <Building2 className="h-5 w-5 text-emerald-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Net Banking</div>
                        <div className="text-xs text-muted-foreground">All major banks supported</div>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                className="w-full bg-eco-gradient text-white hover:opacity-90 h-11"
                onClick={handlePay}
                disabled={processing}
              >
                {processing ? (
                  <><Clock className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  <><IndianRupee className="mr-1 h-4 w-4" /> Pay ₹50</>
                )}
              </Button>
              <p className="text-xs text-muted-foreground/60 text-center">
                Demo Payment — Sandbox mode. No real charges will be made.
              </p>
            </CardContent>
          </Card>

          {/* Transaction history */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {transactions.map((tx, i) => {
                const meta = statusMeta[tx.status];
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-lg border border-border/40 p-3"
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta.color} shrink-0`}>
                      {tx.amount < 0 ? <Download className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{tx.description}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{tx.method}</span>
                        <span>•</span>
                        <span>{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`font-semibold text-sm ${tx.amount < 0 ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                        {tx.amount < 0 ? '+' : ''}₹{Math.abs(tx.amount)}
                      </div>
                      <Badge variant="secondary" className={`text-xs mt-0.5 ${meta.color}`}>
                        {meta.label}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
