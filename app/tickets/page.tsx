'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket as TicketIcon, Train, Bus, QrCode, Download, Share2,
  Calendar, User, MapPin, IndianRupee, CheckCircle2, Plus,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { delhiLocations } from '@/lib/eco-data';

interface Ticket {
  id: string;
  from: string;
  to: string;
  mode: string;
  passenger: string;
  fare: number;
  bookingId: string;
  date: string;
  status: string;
  isDemo: boolean;
}

const demoTickets: Ticket[] = [
  { id: 't1', from: 'Delhi University', to: 'Noida Sector 62', mode: 'Metro', passenger: 'Aarav Sharma', fare: 40, bookingId: 'ECR-MET-8X42K', date: '2026-09-26', status: 'confirmed', isDemo: true },
  { id: 't2', from: 'Rajiv Chowk', to: 'Gurgaon Cyber City', mode: 'Metro', passenger: 'Aarav Sharma', fare: 60, bookingId: 'ECR-MET-9K71L', date: '2026-09-25', status: 'used', isDemo: true },
  { id: 't3', from: 'Anand Vihar', to: 'Rajiv Chowk', mode: 'Bus', passenger: 'Aarav Sharma', fare: 25, bookingId: 'ECR-BUS-3M82P', date: '2026-09-23', status: 'used', isDemo: true },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(demoTickets);
  const [showBook, setShowBook] = useState(false);
  const [showTicket, setShowTicket] = useState<Ticket | null>(null);
  const [bookForm, setBookForm] = useState({
    from: delhiLocations[0].name,
    to: delhiLocations[4].name,
    mode: 'Metro',
    passenger: 'Aarav Sharma',
    date: new Date().toISOString().slice(0, 10),
  });

  const handleBook = () => {
    const fare = bookForm.mode === 'Metro' ? 40 : 25;
    const bookingId = `ECR-${bookForm.mode === 'Metro' ? 'MET' : 'BUS'}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const ticket: Ticket = {
      id: Date.now().toString(),
      from: bookForm.from,
      to: bookForm.to,
      mode: bookForm.mode,
      passenger: bookForm.passenger,
      fare,
      bookingId,
      date: bookForm.date,
      status: 'confirmed',
      isDemo: true,
    };
    setTickets([ticket, ...tickets]);
    setShowBook(false);
    toast.success(`Ticket booked! Booking ID: ${bookingId}`, {
      description: 'Demo Ticket — no real operator issuance',
    });
    setShowTicket(ticket);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Tickets</h1>
            <p className="mt-1 text-sm text-muted-foreground">Book and manage your metro and bus tickets</p>
          </div>
          <Button className="bg-eco-gradient text-white hover:opacity-90" onClick={() => setShowBook(true)}>
            <Plus className="mr-2 h-4 w-4" /> Book Ticket
          </Button>
        </div>

        {/* Ticket list */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {tickets.map((ticket, i) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowTicket(ticket)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {ticket.mode === 'Metro' ? <Train className="h-5 w-5 text-violet-500" /> : <Bus className="h-5 w-5 text-orange-500" />}
                        <span className="font-semibold text-sm">{ticket.mode}</span>
                      </div>
                      <Badge variant={ticket.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                        {ticket.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{ticket.from}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">→</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{ticket.to}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(ticket.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      <span className="font-mono">{ticket.bookingId}</span>
                      <span className="font-semibold text-foreground">₹{ticket.fare}</span>
                    </div>
                    {ticket.isDemo && (
                      <div className="mt-2 text-xs text-muted-foreground/60 text-center">Demo Ticket</div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {tickets.length === 0 && (
          <div className="rounded-xl border border-border/40 p-12 text-center">
            <TicketIcon className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No tickets yet. Book your first ticket to get started.</p>
          </div>
        )}
      </div>

      {/* Booking dialog */}
      <Dialog open={showBook} onOpenChange={setShowBook}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Ticket</DialogTitle>
            <DialogDescription>Book a metro or bus ticket — Demo booking flow</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Transport Mode</Label>
              <Select value={bookForm.mode} onValueChange={(v) => setBookForm({ ...bookForm, mode: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Metro">Metro</SelectItem>
                  <SelectItem value="Bus">Bus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>From</Label>
                <Select value={bookForm.from} onValueChange={(v) => setBookForm({ ...bookForm, from: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {delhiLocations.map((l) => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>To</Label>
                <Select value={bookForm.to} onValueChange={(v) => setBookForm({ ...bookForm, to: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {delhiLocations.map((l) => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Passenger Name</Label>
              <Input value={bookForm.passenger} onChange={(e) => setBookForm({ ...bookForm, passenger: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Travel Date</Label>
              <Input type="date" value={bookForm.date} onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })} />
            </div>
            <div className="rounded-lg border border-border/40 p-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Fare</span>
              <span className="font-display text-xl font-bold">₹{bookForm.mode === 'Metro' ? 40 : 25}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBook(false)}>Cancel</Button>
            <Button className="bg-eco-gradient text-white hover:opacity-90" onClick={handleBook}>
              Pay & Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ticket detail dialog */}
      <Dialog open={!!showTicket} onOpenChange={() => setShowTicket(null)}>
        {showTicket && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {showTicket.mode === 'Metro' ? <Train className="h-5 w-5 text-violet-500" /> : <Bus className="h-5 w-5 text-orange-500" />}
                {showTicket.mode} Ticket
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-xl border-2 border-dashed border-border/60 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-eco-gradient">
                      <TicketIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-display font-bold">EcoRoute</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{showTicket.status}</Badge>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 text-center">
                    <div className="text-xs text-muted-foreground">From</div>
                    <div className="font-semibold text-sm">{showTicket.from}</div>
                  </div>
                  <div className="h-px flex-1 bg-border" />
                  <div className="flex-1 text-center">
                    <div className="text-xs text-muted-foreground">To</div>
                    <div className="font-semibold text-sm">{showTicket.to}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Passenger:</span>
                    <span className="font-medium">{showTicket.passenger}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{new Date(showTicket.date).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Booking ID:</span>
                    <span className="font-mono text-xs font-medium">{showTicket.bookingId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Fare:</span>
                    <span className="font-medium">₹{showTicket.fare}</span>
                  </div>
                </div>

                {/* QR code placeholder */}
                <div className="flex flex-col items-center gap-2 pt-3 border-t border-border/40">
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-muted">
                    <QrCode className="h-16 w-16 text-foreground/60" />
                  </div>
                  <span className="text-xs text-muted-foreground">Scan at gate</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => toast.success('Ticket downloaded')}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => toast.success('Share link copied')}>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>

              {showTicket.isDemo && (
                <p className="text-xs text-muted-foreground/60 text-center">
                  Demo Ticket — No real operator ticket issuance. For demonstration only.
                </p>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  );
}
