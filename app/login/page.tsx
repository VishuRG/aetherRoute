'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Welcome back to EcoRoute!');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[hsl(200_30%_5%)] items-center justify-center p-12">
        <div className="absolute inset-0 bg-grid opacity-[0.04]" />
        <div className="absolute inset-0 bg-eco-radial" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-md text-white"
        >
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-eco-gradient">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold">EcoRoute</span>
          </div>
          <h2 className="font-display text-3xl font-bold leading-tight mb-4">
            Travel Smarter.
            <br />
            Travel Greener.
          </h2>
          <p className="text-white/60 leading-relaxed">
            Compare every transport mode, track your carbon footprint, manage travel
            expenses, and navigate Delhi-NCR with real-time intelligence.
          </p>
          <div className="mt-8 space-y-3">
            {['Multimodal route comparison', 'Real-time CO₂ tracking', 'AI travel assistant', 'Expense management with OCR'].map((feat) => (
              <div key={feat} className="flex items-center gap-3 text-sm text-white/80">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {feat}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-eco-gradient">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold">EcoRoute</span>
          </div>

          <h1 className="font-display text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-8">Sign in to your EcoRoute account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-eco-gradient text-white hover:opacity-90 h-11"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
              Sign up
            </Link>
          </p>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link href="/dashboard" className="hover:underline">Continue as demo user →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
