'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Home, Briefcase, GraduationCap,
  Heart, Plus, Trash2, Navigation, Leaf, Settings as SettingsIcon,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/providers/auth-provider';
import { toast } from 'sonner';
import { delhiLocations } from '@/lib/eco-data';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name || 'Demo User');
  const [email, setEmail] = useState(user?.email || 'demo@ecoroute.in');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '+91 98765 43210');
  const [home, setHome] = useState(delhiLocations[0].name);
  const [work, setWork] = useState(delhiLocations[4].name);
  const [preferredTransport, setPreferredTransport] = useState('metro');
  const [maxWalking, setMaxWalking] = useState('1000');
  const [budget, setBudget] = useState('5000');
  const [accessibility, setAccessibility] = useState(false);
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: 'c1', name: 'Priya Sharma', phone: '+91 98765 12345', relation: 'Spouse' },
    { id: 'c2', name: 'Rajesh Sharma', phone: '+91 98765 67890', relation: 'Father' },
  ]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });

  const handleSave = () => {
    toast.success('Profile updated successfully');
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Please fill in name and phone');
      return;
    }
    setContacts([...contacts, { ...newContact, id: Date.now().toString() }]);
    setNewContact({ name: '', phone: '', relation: '' });
    toast.success('Emergency contact added');
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
    toast.info('Contact removed');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Profile & Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your account, preferences and emergency contacts</p>
        </div>

        {/* Profile header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-eco-gradient text-white text-2xl font-bold">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-display text-xl font-bold">{name}</div>
                <div className="text-sm text-muted-foreground">{email}</div>
                <Badge variant="secondary" className="mt-1 text-xs">
                  <Leaf className="h-3 w-3 mr-1" /> Eco Score: 87
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-500" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Saved locations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-500" /> Saved Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Home className="h-3.5 w-3.5" /> Home</Label>
                <Select value={home} onValueChange={setHome}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {delhiLocations.map((l) => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Work</Label>
                <Select value={work} onValueChange={setWork}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {delhiLocations.map((l) => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> College</Label>
                <Select defaultValue={delhiLocations[0].name}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {delhiLocations.map((l) => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Travel preferences */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Navigation className="h-4 w-4 text-emerald-500" /> Travel Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred Transport</Label>
                <Select value={preferredTransport} onValueChange={setPreferredTransport}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metro">Metro</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="cab">Cab</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bike">Bike</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Max Walking (m)</Label>
                  <Input type="number" value={maxWalking} onChange={(e) => setMaxWalking(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Monthly Budget (₹)</Label>
                  <Input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                <div>
                  <div className="text-sm font-medium">Accessibility Mode</div>
                  <div className="text-xs text-muted-foreground">Wheelchair-friendly, less walking</div>
                </div>
                <Switch checked={accessibility} onCheckedChange={setAccessibility} />
              </div>
            </CardContent>
          </Card>

          {/* Emergency contacts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" /> Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center gap-3 rounded-lg border border-border/40 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-red-500 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{contact.name}</div>
                    <div className="text-xs text-muted-foreground">{contact.phone} • {contact.relation}</div>
                  </div>
                  <button onClick={() => handleDeleteContact(contact.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="rounded-lg border border-dashed border-border/60 p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} />
                  <Input placeholder="Relation" value={newContact.relation} onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Phone number" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} />
                  <Button size="icon" onClick={handleAddContact} className="bg-eco-gradient text-white hover:opacity-90">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button className="w-full bg-eco-gradient text-white hover:opacity-90 h-11" onClick={handleSave}>
          Save All Changes
        </Button>
      </div>
    </DashboardLayout>
  );
}
