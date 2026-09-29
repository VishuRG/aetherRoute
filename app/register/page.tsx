'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, fullName, phone);
    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Account created! Welcome to EcoRoute.');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
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
            Join the green
            <br />
            mobility revolution.
          </h2>
          <p className="text-white/60 leading-relaxed">
            Create an account to start planning efficient, eco-friendly journeys
            across Delhi-NCR. It's free.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { value: '15+', label: 'Locations' },
              { value: '7', label: 'Transport modes' },
              { value: '100%', label: 'Eco tracking' },
              { value: '24/7', label: 'AI assistant' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/10 p-4">
                <div className="font-display text-2xl font-bold text-emerald-400">{stat.value}</div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm py-8"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-eco-gradient">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold">EcoRoute</span>
          </div>

          <h1 className="font-display text-2xl font-bold mb-2">Create account</h1>
          <p className="text-sm text-muted-foreground mb-6">Start your eco-friendly travel journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="Aarav Sharma" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="phone" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} required className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pl-10" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-eco-gradient text-white hover:opacity-90 h-11">
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
