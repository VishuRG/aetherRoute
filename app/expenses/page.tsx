'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Upload, FileText, IndianRupee, TrendingUp, TrendingDown,
  CheckCircle2, Clock, AlertCircle, Camera, Loader2, Trash2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/eco/stat-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { demoExpenses, ExpenseRecord } from '@/lib/eco-data';
import { cn } from '@/lib/utils';

const statusMeta: Record<ExpenseRecord['status'], { label: string; color: string; icon: typeof Clock }> = {
  logged: { label: 'Logged', color: 'bg-muted text-muted-foreground', icon: Clock },
  submitted: { label: 'Submitted', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', icon: AlertCircle },
  approved: { label: 'Approved', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', icon: CheckCircle2 },
  reimbursed: { label: 'Reimbursed', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', icon: CheckCircle2 },
};

const categories = ['Metro', 'Bus', 'Cab', 'Auto', 'Fuel', 'Parking', 'Toll', 'Other'];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(demoExpenses);
  const [showAdd, setShowAdd] = useState(false);
  const [showOcr, setShowOcr] = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<{ amount: number; date: string; provider: string; category: string } | null>(null);
  const [newExpense, setNewExpense] = useState({ category: 'Metro', amount: '', description: '', date: new Date().toISOString().slice(0, 10) });

  const totalThisMonth = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const totalReimbursed = useMemo(() => expenses.filter((e) => e.status === 'reimbursed').reduce((s, e) => s + e.amount, 0), [expenses]);
  const totalPending = useMemo(() => expenses.filter((e) => e.status === 'submitted' || e.status === 'approved').reduce((s, e) => s + e.amount, 0), [expenses]);

  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const handleAddExpense = () => {
    if (!newExpense.amount || parseInt(newExpense.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    const expense: ExpenseRecord = {
      id: `e${Date.now()}`,
      userId: 'demo',
      category: newExpense.category,
      amount: parseInt(newExpense.amount),
      description: newExpense.description || `${newExpense.category} expense`,
      date: newExpense.date,
      status: 'logged',
    };
    setExpenses([expense, ...expenses]);
    setShowAdd(false);
    setNewExpense({ category: 'Metro', amount: '', description: '', date: new Date().toISOString().slice(0, 10) });
    toast.success('Expense added successfully');
  };

  const handleOcrUpload = () => {
    setOcrProcessing(true);
    setTimeout(() => {
      setOcrProcessing(false);
      setOcrResult({
        amount: 120,
        date: '2026-09-29',
        provider: 'Delhi Metro Rail Corporation',
        category: 'Metro',
      });
      toast.success('Receipt scanned successfully');
    }, 2000);
  };

  const handleOcrConfirm = () => {
    if (!ocrResult) return;
    const expense: ExpenseRecord = {
      id: `e${Date.now()}`,
      userId: 'demo',
      category: ocrResult.category,
      amount: ocrResult.amount,
      description: ocrResult.provider,
      date: ocrResult.date,
      status: 'logged',
    };
    setExpenses([expense, ...expenses]);
    setShowOcr(false);
    setOcrResult(null);
    toast.success('OCR expense saved after confirmation');
  };

  const handleSubmitReimbursement = (id: string) => {
    setExpenses(expenses.map((e) => e.id === id ? { ...e, status: 'submitted' } : e));
    toast.success('Expense submitted for reimbursement');
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
    toast.info('Expense deleted');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Travel Expenses</h1>
            <p className="mt-1 text-sm text-muted-foreground">Track, manage and reimburse your travel costs</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowOcr(true)}>
              <Upload className="mr-2 h-4 w-4" /> Upload Receipt
            </Button>
            <Button className="bg-eco-gradient text-white hover:opacity-90" onClick={() => setShowAdd(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <StatCard icon={IndianRupee} label="Total This Month" value={`₹${totalThisMonth}`} delay={0} color="text-amber-500" />
          <StatCard icon={CheckCircle2} label="Reimbursed" value={`₹${totalReimbursed}`} delay={0.1} color="text-emerald-500" />
          <StatCard icon={Clock} label="Pending Reimbursement" value={`₹${totalPending}`} delay={0.2} color="text-blue-500" />
        </div>

        {/* Category breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryTotals.map(([cat, amount], i) => {
                const maxAmount = Math.max(...categoryTotals.map((c) => c[1]));
                const percent = (amount / maxAmount) * 100;
                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: '100%' }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{cat}</span>
                      <span className="text-muted-foreground">₹{amount}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ delay: 0.2 + i * 0.05, duration: 0.6 }}
                        className="h-full rounded-full bg-eco-gradient"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Expense list with tabs */}
        <Tabs defaultValue="all">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="logged">Logged</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="reimbursed">Reimbursed</TabsTrigger>
          </TabsList>

          {(['all', 'logged', 'submitted', 'approved', 'reimbursed'] as const).map((tab) => {
            const filtered = tab === 'all' ? expenses : expenses.filter((e) => e.status === tab);
            return (
              <TabsContent key={tab} value={tab} className="space-y-2 mt-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((expense, i) => {
                    const meta = statusMeta[expense.status];
                    return (
                      <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 rounded-lg border border-border/40 bg-card p-3 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 shrink-0">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{expense.description}</span>
                            <Badge variant="secondary" className={cn('text-xs', meta.color)}>
                              {meta.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span>{expense.category}</span>
                            <span>{new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-semibold">₹{expense.amount}</div>
                          {expense.status === 'logged' && (
                            <button
                              onClick={() => handleSubmitReimbursement(expense.id)}
                              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline mt-0.5"
                            >
                              Submit for reimbursement
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <div className="rounded-xl border border-border/40 p-8 text-center">
                    <p className="text-sm text-muted-foreground">No expenses in this category yet.</p>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>

      {/* Add expense dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Travel Expense</DialogTitle>
            <DialogDescription>Log a new travel-related expense</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newExpense.category} onValueChange={(v) => setNewExpense({ ...newExpense, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                placeholder="0"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="e.g. Metro from DU to Noida"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button className="bg-eco-gradient text-white hover:opacity-90" onClick={handleAddExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OCR dialog */}
      <Dialog open={showOcr} onOpenChange={setShowOcr}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Receipt for OCR</DialogTitle>
            <DialogDescription>
              Upload a ticket or receipt and we'll extract the amount, date and provider
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!ocrResult && !ocrProcessing && (
              <button
                onClick={handleOcrUpload}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/60 p-12 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-colors"
              >
                <Camera className="h-10 w-10 text-muted-foreground" />
                <span className="text-sm font-medium">Click to simulate receipt upload</span>
                <span className="text-xs text-muted-foreground">Supports Metro tickets, cab receipts, fuel bills</span>
              </button>
            )}

            {ocrProcessing && (
              <div className="flex flex-col items-center justify-center gap-3 p-12">
                <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
                <span className="text-sm font-medium">Scanning receipt...</span>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="animate-pulse">Extracting amount...</div>
                  <div className="animate-pulse">Detecting date...</div>
                  <div className="animate-pulse">Identifying provider...</div>
                </div>
              </div>
            )}

            {ocrResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3"
              >
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-3">Extracted Data — Please Review</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Amount', value: `₹${ocrResult.amount}` },
                      { label: 'Date', value: ocrResult.date },
                      { label: 'Provider', value: ocrResult.provider },
                      { label: 'Category', value: ocrResult.category },
                    ].map((field) => (
                      <div key={field.label} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{field.label}</span>
                        <span className="font-medium">{field.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Please confirm the extracted data is correct before saving
                </p>
              </motion.div>
            )}
          </div>
          <DialogFooter>
            {ocrResult ? (
              <>
                <Button variant="outline" onClick={() => { setShowOcr(false); setOcrResult(null); }}>Cancel</Button>
                <Button className="bg-eco-gradient text-white hover:opacity-90" onClick={handleOcrConfirm}>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm & Save
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setShowOcr(false)}>Cancel</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
