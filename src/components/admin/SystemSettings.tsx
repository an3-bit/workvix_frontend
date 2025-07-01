import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RefreshCcw, Save, Settings, User, CreditCard, Bell, Palette, Mail, Menu } from 'lucide-react';
<<<<<<< HEAD
<<<<<<< HEAD
import { useLocation } from 'react-router-dom';
import { useUserProfile } from '../../lib/auth';
=======
>>>>>>> a02f476 (admin dashboard)
=======
import { useLocation } from 'react-router-dom';
>>>>>>> 7438431 (admin dashboard)

interface Setting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  description: string | null;
  last_updated_at: string;
  updated_by: string | null;
}

const categories = [
  { key: 'system', label: 'System', icon: <Settings className="w-4 h-4 mr-2" /> },
  { key: 'profile', label: 'Profile', icon: <User className="w-4 h-4 mr-2" /> },
  { key: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4 mr-2" /> },
  { key: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4 mr-2" /> },
  { key: 'themes', label: 'Themes', icon: <Palette className="w-4 h-4 mr-2" /> },
  { key: 'email', label: 'Email', icon: <Mail className="w-4 h-4 mr-2" /> },
];

interface SystemSettingsProps {
  initialTab?: string;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ initialTab }) => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState(initialTab || 'system');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768); // expanded on desktop, collapsed on mobile
<<<<<<< HEAD
<<<<<<< HEAD
  const location = useLocation();

  // Section forms state
  const [profile, setProfile] = useState({ name: '', email: '', avatar: '', firstName: '', lastName: '', phone: '' });
=======

  // Section forms state
  const [profile, setProfile] = useState({ name: '', email: '', avatar: '' });
>>>>>>> a02f476 (admin dashboard)
=======
  const location = useLocation();

  // Section forms state
  const [profile, setProfile] = useState({ name: '', email: '', avatar: '', firstName: '', lastName: '', phone: '' });
>>>>>>> 7438431 (admin dashboard)
  const [payments, setPayments] = useState({
    gateway: '',
    supportedMethods: [],
    serviceFee: 5,
    currency: 'USD',
    minPayout: 10,
    invoicePrefix: 'INV-',
    orderExpiryDays: 7,
    refundPolicy: '',
    autoComplete: false,
    payoutSchedule: 'weekly',
    payoutMethods: [],
    payoutFee: 0,
    stripeKey: '',
    paypalClientId: '',
    paypalSecret: '',
    manualInstructions: '',
  });
  const [notifications, setNotifications] = useState({ email: true, sms: false, newsletter: false });
  const [themes, setThemes] = useState({ mode: 'light', primaryColor: '#2563eb', logo: '' });
  const [emailSettings, setEmailSettings] = useState({ smtpHost: '', smtpPort: '', senderName: '', senderEmail: '' });
<<<<<<< HEAD
<<<<<<< HEAD
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [updating, setUpdating] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
=======
>>>>>>> a02f476 (admin dashboard)
=======
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [updating, setUpdating] = useState(false);
>>>>>>> 7438431 (admin dashboard)

  const paymentMethods = [
    { value: 'card', label: 'Card' },
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'crypto', label: 'Crypto' },
  ];
  const payoutMethods = [
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'crypto', label: 'Crypto' },
  ];
  const currencies = ['USD', 'EUR', 'GBP', 'NGN', 'KES'];
  const payoutSchedules = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'manual', label: 'Manual' },
  ];
<<<<<<< HEAD

  const { setProfile: setGlobalProfile } = useUserProfile();
=======
>>>>>>> a02f476 (admin dashboard)

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, email, avatar, phone')
        .eq('id', user.id)
<<<<<<< HEAD
        .maybeSingle();
=======
        .single();
>>>>>>> 7438431 (admin dashboard)
      if (profileData) {
        setProfile({
          name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
          email: profileData.email || user.email || '',
          avatar: profileData.avatar || '',
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          phone: profileData.phone || '',
        });
      } else {
        setProfile({
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
          avatar: user.user_metadata?.avatar_url || '',
          firstName: '',
          lastName: '',
          phone: '',
        });
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    // Check for tab query param
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && categories.some(c => c.key === tab)) {
      setActiveCategory(tab);
    } else if (initialTab) {
      setActiveCategory(initialTab);
    }
  }, [location.search, initialTab]);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await (supabase as any)
        .from('system_settings')
        .select('*')
        .order('setting_key', { ascending: true });
      if (error) throw error;
      setSettings(data as Setting[]);
      const initialEditValues: { [key: string]: string } = {};
      data.forEach((setting: Setting) => {
        initialEditValues[setting.setting_key] = setting.setting_value || '';
      });
      setEditValues(initialEditValues);
    } catch (err: any) {
      setError('Failed to fetch settings: ' + err.message);
      toast({ title: 'Error', description: 'Failed to fetch system settings.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key: string, value: string) => {
    setEditValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const currentAdminId = userData.user?.id;
      if (!currentAdminId) throw new Error('Admin user not found.');
      const updates = settings.map(setting => {
        const newValue = editValues[setting.setting_key];
        if (newValue !== (setting.setting_value || '')) {
          return (supabase as any)
            .from('system_settings')
            .update({ 
              setting_value: newValue, 
              last_updated_at: new Date().toISOString(),
              updated_by: currentAdminId
            })
            .eq('setting_key', setting.setting_key);
        }
        return null;
      }).filter(Boolean);
      if (updates.length > 0) {
        await Promise.all(updates);
        toast({ title: 'Settings Saved', description: 'System settings updated successfully.' });
        fetchSettings();
      } else {
        toast({ title: 'No Changes', description: 'No changes were made to the settings.' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to save settings.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // Save handlers (simulate save with toast)
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 7438431 (admin dashboard)
  const handleSaveProfile = async () => {
    setUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');
      const updates = {
        first_name: profile.firstName,
        last_name: profile.lastName,
        email: profile.email,
        avatar: profile.avatar,
        phone: profile.phone,
      };
<<<<<<< HEAD
      if (selectedAvatarFile) {
        const filePath = `user-${user.id}-${selectedAvatarFile.name}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(
          filePath,
          selectedAvatarFile,
          { cacheControl: '3600', upsert: true }
        );
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        updates.avatar = data.publicUrl;
      }
      await supabase.from('profiles').update(updates).eq('id', user.id);
      setGlobalProfile({
        ...profile,
        avatar: updates.avatar,
        firstName: updates.first_name,
        lastName: updates.last_name,
        email: updates.email,
        phone: updates.phone,
      });
=======
      await supabase.from('profiles').update(updates).eq('id', user.id);
>>>>>>> 7438431 (admin dashboard)
      toast({ title: 'Profile Saved', description: 'Profile settings updated.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to update profile.', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

<<<<<<< HEAD
  const handleSavePayments = () => toast({ title: 'Payments Saved', description: 'Payment settings updated.' });
  const handleSaveNotifications = () => toast({ title: 'Notifications Saved', description: 'Notification settings updated.' });
  const handleSaveThemes = () => toast({ title: 'Themes Saved', description: 'Theme settings updated.' });
  const handleSaveEmail = () => toast({ title: 'Email Saved', description: 'Email settings updated.' });

  // Change password
  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({ title: 'Error', description: 'New passwords do not match.', variant: 'destructive' });
      return;
    }
    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.new });
      if (error) throw error;
      toast({ title: 'Password Changed', description: 'Your password has been updated.' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to change password.', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

=======
  const handleSaveProfile = () => toast({ title: 'Profile Saved', description: 'Profile settings updated.' });
=======
>>>>>>> 7438431 (admin dashboard)
  const handleSavePayments = () => toast({ title: 'Payments Saved', description: 'Payment settings updated.' });
  const handleSaveNotifications = () => toast({ title: 'Notifications Saved', description: 'Notification settings updated.' });
  const handleSaveThemes = () => toast({ title: 'Themes Saved', description: 'Theme settings updated.' });
  const handleSaveEmail = () => toast({ title: 'Email Saved', description: 'Email settings updated.' });

<<<<<<< HEAD
>>>>>>> a02f476 (admin dashboard)
=======
  // Change password
  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({ title: 'Error', description: 'New passwords do not match.', variant: 'destructive' });
      return;
    }
    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.new });
      if (error) throw error;
      toast({ title: 'Password Changed', description: 'Your password has been updated.' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to change password.', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

>>>>>>> 7438431 (admin dashboard)
  // Group settings by prefix (e.g., system_, email_, etc.) for future expansion
  const groupedSettings = settings.reduce((acc, setting) => {
    const group = setting.setting_key.split('_')[0];
    acc[group] = acc[group] || [];
    acc[group].push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <>
      <div className="flex flex-col md:flex-row min-h-[80vh] bg-background pb-16">
        {/* Sidebar */}
        <aside className={`transition-all duration-200 bg-background border-r ${sidebarOpen ? 'w-full md:w-64' : 'w-16'} p-4 mb-4 md:mb-0 flex flex-col items-center md:items-stretch border-border`}>
          <button
            className="mb-4 p-2 rounded hover:bg-gray-100 focus:outline-none self-end md:self-start"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Menu className="w-6 h-6" />
          </button>
          <nav className="space-y-2 w-full">
            {categories.map(cat => (
              <button
                key={cat.key}
                className={`flex items-center w-full px-3 py-2 rounded-lg transition font-medium text-left ${activeCategory === cat.key ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'} ${!sidebarOpen ? 'justify-center' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.icon}
                {sidebarOpen && <span>{cat.label}</span>}
              </button>
            ))}
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 bg-background pb-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 flex items-center text-foreground">
              {categories.find(c => c.key === activeCategory)?.icon}
              {categories.find(c => c.key === activeCategory)?.label} Settings
            </h1>
            {/* Main Content for each section */}
            {activeCategory === 'system' ? (
              loading ? (
                <div className="p-6 text-center">Loading system settings...</div>
              ) : error ? (
                <div className="p-6 text-center text-red-600">{error}</div>
              ) : (
                <div className="space-y-8">
                  {(groupedSettings['system'] || settings).length === 0 ? (
                    <p className="text-center text-gray-500">No system settings found.</p>
                  ) : (
                    <Card className="shadow-md bg-card border border-border">
                      <CardHeader className="flex flex-row items-center justify-between bg-muted rounded-t-lg">
                        <CardTitle className="text-xl font-bold text-primary">General System Settings</CardTitle>
                        <div className="space-x-2">
                          <Button onClick={fetchSettings} variant="outline" className="flex items-center space-x-2">
                            <RefreshCcw className="h-4 w-4" />
                            <span>Refresh</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {(groupedSettings['system'] || settings).map((setting) => (
                          <div key={setting.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                            <Label htmlFor={setting.setting_key} className="font-semibold block mb-1">
                              {setting.setting_key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </Label>
                            <p className="text-sm text-gray-500 mb-2">{setting.description}</p>
                            {setting.setting_key.includes('content') || setting.setting_key.includes('description') ? (
                              <Textarea
                                id={setting.setting_key}
                                value={editValues[setting.setting_key] || ''}
                                onChange={(e) => handleValueChange(setting.setting_key, e.target.value)}
                                rows={3}
                              />
                            ) : (
                              <Input
                                id={setting.setting_key}
                                value={editValues[setting.setting_key] || ''}
                                onChange={(e) => handleValueChange(setting.setting_key, e.target.value)}
                              />
                            )}
                          </div>
                        ))}
                        <div className="flex justify-end mt-4">
                          <Button onClick={handleSaveChanges} disabled={saving} className="flex items-center space-x-2">
                            <Save className="h-4 w-4" />
                            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )
            ) : activeCategory === 'profile' ? (
              <Card className="shadow-md bg-card border border-border">
                <CardHeader className="bg-muted rounded-t-lg">
                  <CardTitle className="text-xl font-bold text-primary">Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Preview */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-primary overflow-hidden">
                      {selectedAvatarFile ? (
                        <img src={URL.createObjectURL(selectedAvatarFile)} alt="Selected Avatar" className="h-full w-full object-cover rounded-full" />
                      ) : profile.avatar ? (
                        <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover rounded-full" />
                      ) : (
                        (() => {
                          if (profile.firstName && profile.lastName) {
                            return `${profile.firstName[0] || ''}${profile.lastName[0] || ''}`.toUpperCase();
                          } else if (profile.email) {
                            const emailName = profile.email.split('@')[0];
                            // Try to split by non-letters or numbers, fallback to first and last char
                            const parts = emailName.match(/[a-zA-Z]+/g);
                            if (parts && parts.length > 1) {
                              return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
                            } else if (emailName.length > 1) {
                              return `${emailName[0]}${emailName[emailName.length - 1]}`.toUpperCase();
                            } else {
                              return emailName[0].toUpperCase();
                            }
                          } else {
                            return 'A';
                          }
                        })()
                      )}
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-foreground">{profile.firstName} {profile.lastName}</div>
                      <div className="text-muted-foreground text-sm">{profile.email}</div>
                    </div>
                  </div>
                  {/* Editable Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <Input value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Email</Label>
                      <Input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Phone</Label>
                      <Input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                  </div>
                  <input type="file" accept="image/*" onChange={e => setSelectedAvatarFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} className="hidden" id="avatar-upload" />
                  <label htmlFor="avatar-upload" className="ml-2 px-3 py-1 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition">Upload Photo</label>
                  <Button onClick={handleSaveProfile} className="mt-4" disabled={updating}>Save Profile</Button>
                  {/* Password Change Section */}
                  <div className="mt-8">
                    <div className="max-w-md mx-auto bg-card rounded-lg shadow p-6 border border-border">
                      <h3 className="font-semibold mb-4 text-lg text-primary flex items-center gap-2">
                        <span>Change Password</span>
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label>Current Password</Label>
                          <Input type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} placeholder="Enter current password" />
                        </div>
                        <div>
                          <Label>New Password</Label>
                          <Input type="password" value={passwords.new} onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))} placeholder="Enter new password" />
                        </div>
                        <div>
                          <Label>Confirm New Password</Label>
                          <Input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} placeholder="Confirm new password" />
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button onClick={handleChangePassword} disabled={updating} className="flex items-center space-x-2 w-full md:w-auto">
                            <Save className="h-4 w-4" />
                            <span>{updating ? 'Saving...' : 'Change Password'}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : activeCategory === 'payments' ? (
              <Card className="shadow-md bg-card border border-border">
                <CardHeader className="bg-muted rounded-t-lg">
                  <CardTitle className="text-xl font-bold text-primary">Payments & Orders Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* General Payment Settings */}
                  <div className="border-b pb-6">
                    <h3 className="font-semibold mb-2">General Payment Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Default Payment Gateway</Label>
                        <select value={payments.gateway} onChange={e => setPayments(p => ({ ...p, gateway: e.target.value }))} className="w-full border rounded px-3 py-2">
                          <option value="">Select Gateway</option>
                          <option value="stripe">Stripe</option>
                          <option value="paypal">PayPal</option>
                          <option value="manual">Manual</option>
                        </select>
                      </div>
                      <div>
                        <Label>Supported Payment Methods</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {paymentMethods.map(m => (
                            <label key={m.value} className="flex items-center space-x-1">
                              <input type="checkbox" checked={payments.supportedMethods.includes(m.value)} onChange={e => setPayments(p => ({ ...p, supportedMethods: e.target.checked ? [...p.supportedMethods, m.value] : p.supportedMethods.filter(v => v !== m.value) }))} />
                              <span>{m.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Service Fee (%)</Label>
                        <Input type="number" min={0} max={100} value={payments.serviceFee} onChange={e => setPayments(p => ({ ...p, serviceFee: Number(e.target.value) }))} />
                      </div>
                      <div>
                        <Label>Currency</Label>
                        <select value={payments.currency} onChange={e => setPayments(p => ({ ...p, currency: e.target.value }))} className="w-full border rounded px-3 py-2">
                          {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label>Minimum Payout Amount</Label>
                        <Input type="number" min={0} value={payments.minPayout} onChange={e => setPayments(p => ({ ...p, minPayout: Number(e.target.value) }))} />
                      </div>
                      <div>
                        <Label>Invoice Prefix</Label>
                        <Input value={payments.invoicePrefix} onChange={e => setPayments(p => ({ ...p, invoicePrefix: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                  {/* Order Settings */}
                  <div className="border-b pb-6">
                    <h3 className="font-semibold mb-2">Order Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Order Expiry (days)</Label>
                        <Input type="number" min={1} value={payments.orderExpiryDays} onChange={e => setPayments(p => ({ ...p, orderExpiryDays: Number(e.target.value) }))} />
                      </div>
                      <div>
                        <Label>Auto-complete Orders</Label>
                        <input type="checkbox" checked={payments.autoComplete} onChange={e => setPayments(p => ({ ...p, autoComplete: e.target.checked }))} className="ml-2" />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Refund Policy</Label>
                        <Textarea value={payments.refundPolicy} onChange={e => setPayments(p => ({ ...p, refundPolicy: e.target.value }))} rows={3} />
                      </div>
                    </div>
                  </div>
                  {/* Payout Settings */}
                  <div className="border-b pb-6">
                    <h3 className="font-semibold mb-2">Payout Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Payout Schedule</Label>
                        <select value={payments.payoutSchedule} onChange={e => setPayments(p => ({ ...p, payoutSchedule: e.target.value }))} className="w-full border rounded px-3 py-2">
                          {payoutSchedules.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label>Payout Methods</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {payoutMethods.map(m => (
                            <label key={m.value} className="flex items-center space-x-1">
                              <input type="checkbox" checked={payments.payoutMethods.includes(m.value)} onChange={e => setPayments(p => ({ ...p, payoutMethods: e.target.checked ? [...p.payoutMethods, m.value] : p.payoutMethods.filter(v => v !== m.value) }))} />
                              <span>{m.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Payout Processing Fee</Label>
                        <Input type="number" min={0} value={payments.payoutFee} onChange={e => setPayments(p => ({ ...p, payoutFee: Number(e.target.value) }))} />
                      </div>
                    </div>
                  </div>
                  {/* Gateway Credentials */}
                  <div>
                    <h3 className="font-semibold mb-2">Gateway Credentials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Stripe API Key</Label>
                        <Input value={payments.stripeKey} onChange={e => setPayments(p => ({ ...p, stripeKey: e.target.value }))} />
                      </div>
                      <div>
                        <Label>PayPal Client ID</Label>
                        <Input value={payments.paypalClientId} onChange={e => setPayments(p => ({ ...p, paypalClientId: e.target.value }))} />
                      </div>
                      <div>
                        <Label>PayPal Secret</Label>
                        <Input value={payments.paypalSecret} onChange={e => setPayments(p => ({ ...p, paypalSecret: e.target.value }))} />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Manual Payment Instructions</Label>
                        <Textarea value={payments.manualInstructions} onChange={e => setPayments(p => ({ ...p, manualInstructions: e.target.value }))} rows={3} />
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleSavePayments} className="mt-6">Save Payments Settings</Button>
                </CardContent>
              </Card>
            ) : activeCategory === 'notifications' ? (
              <Card className="shadow-md bg-card border border-border">
                <CardHeader className="bg-muted rounded-t-lg">
                  <CardTitle className="text-xl font-bold text-primary">Notifications Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" checked={notifications.email} onChange={e => setNotifications(n => ({ ...n, email: e.target.checked }))} />
                    <Label>Email Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" checked={notifications.sms} onChange={e => setNotifications(n => ({ ...n, sms: e.target.checked }))} />
                    <Label>SMS Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" checked={notifications.newsletter} onChange={e => setNotifications(n => ({ ...n, newsletter: e.target.checked }))} />
                    <Label>Newsletter Subscription</Label>
                  </div>
                  <Button onClick={handleSaveNotifications} className="mt-4">Save Notifications</Button>
                </CardContent>
              </Card>
            ) : activeCategory === 'themes' ? (
              <Card className="shadow-md bg-card border border-border">
                <CardHeader className="bg-muted rounded-t-lg">
                  <CardTitle className="text-xl font-bold text-primary">Theme Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Mode</Label>
                    <select value={themes.mode} onChange={e => setThemes(t => ({ ...t, mode: e.target.value }))} className="w-full border rounded px-3 py-2">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  <div>
                    <Label>Primary Color</Label>
                    <Input type="color" value={themes.primaryColor} onChange={e => setThemes(t => ({ ...t, primaryColor: e.target.value }))} className="w-16 h-10 p-0 border-none" />
                  </div>
                  <div>
                    <Label>Logo URL</Label>
                    <Input value={themes.logo} onChange={e => setThemes(t => ({ ...t, logo: e.target.value }))} />
                  </div>
                  <Button onClick={handleSaveThemes} className="mt-4">Save Theme</Button>
                </CardContent>
              </Card>
            ) : activeCategory === 'email' ? (
              <Card className="shadow-md bg-card border border-border">
                <CardHeader className="bg-muted rounded-t-lg">
                  <CardTitle className="text-xl font-bold text-primary">Email Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>SMTP Host</Label>
                    <Input value={emailSettings.smtpHost} onChange={e => setEmailSettings(eS => ({ ...eS, smtpHost: e.target.value }))} />
                  </div>
                  <div>
                    <Label>SMTP Port</Label>
                    <Input value={emailSettings.smtpPort} onChange={e => setEmailSettings(eS => ({ ...eS, smtpPort: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Sender Name</Label>
                    <Input value={emailSettings.senderName} onChange={e => setEmailSettings(eS => ({ ...eS, senderName: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Sender Email</Label>
                    <Input value={emailSettings.senderEmail} onChange={e => setEmailSettings(eS => ({ ...eS, senderEmail: e.target.value }))} />
                  </div>
                  <Button onClick={handleSaveEmail} className="mt-4">Save Email Settings</Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </main>
      </div>
      <footer className="fixed bottom-0 left-0 w-full z-50 border-t border-border bg-card py-2 px-6 flex items-center justify-between text-sm text-muted-foreground">
        <span>Admin Dashboard © {new Date().getFullYear()} WorkVix</span>
        <div className="flex items-center gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-600 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-black transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.53 2H21l-7.19 8.24L22 22h-6.47l-5.1-6.2L4 22H1l7.64-8.74L2 2h6.47l4.73 5.75L17.53 2zm-2.13 16.98h1.77l-5.13-6.24-1.77 2.13 5.13 6.24z"/></svg></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/></svg></a>
        </div>
      </footer>
    </>
=======
    <div className="flex flex-col md:flex-row min-h-[80vh]">
=======
    <div className="flex flex-col md:flex-row min-h-[80vh] bg-background">
>>>>>>> 7438431 (admin dashboard)
      {/* Sidebar */}
      <aside className={`transition-all duration-200 bg-background border-r ${sidebarOpen ? 'w-full md:w-64' : 'w-16'} p-4 mb-4 md:mb-0 flex flex-col items-center md:items-stretch border-border`}>
        <button
          className="mb-4 p-2 rounded hover:bg-gray-100 focus:outline-none self-end md:self-start"
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <Menu className="w-6 h-6" />
        </button>
        <nav className="space-y-2 w-full">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`flex items-center w-full px-3 py-2 rounded-lg transition font-medium text-left ${activeCategory === cat.key ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'} ${!sidebarOpen ? 'justify-center' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.icon}
              {sidebarOpen && <span>{cat.label}</span>}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-background">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 flex items-center text-foreground">
            {categories.find(c => c.key === activeCategory)?.icon}
            {categories.find(c => c.key === activeCategory)?.label} Settings
          </h1>
          {/* Main Content for each section */}
          {activeCategory === 'system' ? (
            loading ? (
              <div className="p-6 text-center">Loading system settings...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-600">{error}</div>
            ) : (
              <div className="space-y-8">
                {(groupedSettings['system'] || settings).length === 0 ? (
                  <p className="text-center text-gray-500">No system settings found.</p>
                ) : (
                  <Card className="shadow-md bg-card border border-border">
                    <CardHeader className="flex flex-row items-center justify-between bg-muted rounded-t-lg">
                      <CardTitle className="text-xl font-bold text-primary">General System Settings</CardTitle>
                      <div className="space-x-2">
                        <Button onClick={fetchSettings} variant="outline" className="flex items-center space-x-2">
                          <RefreshCcw className="h-4 w-4" />
                          <span>Refresh</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {(groupedSettings['system'] || settings).map((setting) => (
                        <div key={setting.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                          <Label htmlFor={setting.setting_key} className="font-semibold block mb-1">
                            {setting.setting_key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Label>
                          <p className="text-sm text-gray-500 mb-2">{setting.description}</p>
                          {setting.setting_key.includes('content') || setting.setting_key.includes('description') ? (
                            <Textarea
                              id={setting.setting_key}
                              value={editValues[setting.setting_key] || ''}
                              onChange={(e) => handleValueChange(setting.setting_key, e.target.value)}
                              rows={3}
                            />
                          ) : (
                            <Input
                              id={setting.setting_key}
                              value={editValues[setting.setting_key] || ''}
                              onChange={(e) => handleValueChange(setting.setting_key, e.target.value)}
                            />
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )
          ) : activeCategory === 'profile' ? (
            <Card className="shadow-md bg-card border border-border">
              <CardHeader className="bg-muted rounded-t-lg">
                <CardTitle className="text-xl font-bold text-primary">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Preview */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-primary overflow-hidden">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover rounded-full" />
                    ) : (
                      (() => {
                        if (profile.firstName && profile.lastName) {
                          return `${profile.firstName[0] || ''}${profile.lastName[0] || ''}`.toUpperCase();
                        } else if (profile.email) {
                          const emailName = profile.email.split('@')[0];
                          // Try to split by non-letters or numbers, fallback to first and last char
                          const parts = emailName.match(/[a-zA-Z]+/g);
                          if (parts && parts.length > 1) {
                            return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
                          } else if (emailName.length > 1) {
                            return `${emailName[0]}${emailName[emailName.length - 1]}`.toUpperCase();
                          } else {
                            return emailName[0].toUpperCase();
                          }
                        } else {
                          return 'A';
                        }
                      })()
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-foreground">{profile.firstName} {profile.lastName}</div>
                    <div className="text-muted-foreground text-sm">{profile.email}</div>
                  </div>
                </div>
                {/* Editable Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Email</Label>
                    <Input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Phone</Label>
                    <Input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Avatar URL</Label>
                    <Input value={profile.avatar} onChange={e => setProfile(p => ({ ...p, avatar: e.target.value }))} />
                  </div>
                </div>
                <Button onClick={handleSaveProfile} className="mt-4" disabled={updating}>Save Profile</Button>
                {/* Password Change Section */}
                <div className="mt-8">
                  <div className="max-w-md mx-auto bg-card rounded-lg shadow p-6 border border-border">
                    <h3 className="font-semibold mb-4 text-lg text-primary flex items-center gap-2">
                      <span>Change Password</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Current Password</Label>
                        <Input type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} placeholder="Enter current password" />
                      </div>
                      <div>
                        <Label>New Password</Label>
                        <Input type="password" value={passwords.new} onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))} placeholder="Enter new password" />
                      </div>
                      <div>
                        <Label>Confirm New Password</Label>
                        <Input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} placeholder="Confirm new password" />
                      </div>
                      <Button onClick={handleChangePassword} className="w-full mt-2" disabled={updating}>Change Password</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : activeCategory === 'payments' ? (
            <Card className="shadow-md bg-card border border-border">
              <CardHeader className="bg-muted rounded-t-lg">
                <CardTitle className="text-xl font-bold text-primary">Payments & Orders Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* General Payment Settings */}
                <div className="border-b pb-6">
                  <h3 className="font-semibold mb-2">General Payment Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Default Payment Gateway</Label>
                      <select value={payments.gateway} onChange={e => setPayments(p => ({ ...p, gateway: e.target.value }))} className="w-full border rounded px-3 py-2">
                        <option value="">Select Gateway</option>
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                        <option value="manual">Manual</option>
                      </select>
                    </div>
                    <div>
                      <Label>Supported Payment Methods</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {paymentMethods.map(m => (
                          <label key={m.value} className="flex items-center space-x-1">
                            <input type="checkbox" checked={payments.supportedMethods.includes(m.value)} onChange={e => setPayments(p => ({ ...p, supportedMethods: e.target.checked ? [...p.supportedMethods, m.value] : p.supportedMethods.filter(v => v !== m.value) }))} />
                            <span>{m.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Service Fee (%)</Label>
                      <Input type="number" min={0} max={100} value={payments.serviceFee} onChange={e => setPayments(p => ({ ...p, serviceFee: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <select value={payments.currency} onChange={e => setPayments(p => ({ ...p, currency: e.target.value }))} className="w-full border rounded px-3 py-2">
                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Minimum Payout Amount</Label>
                      <Input type="number" min={0} value={payments.minPayout} onChange={e => setPayments(p => ({ ...p, minPayout: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <Label>Invoice Prefix</Label>
                      <Input value={payments.invoicePrefix} onChange={e => setPayments(p => ({ ...p, invoicePrefix: e.target.value }))} />
                    </div>
                  </div>
                </div>
                {/* Order Settings */}
                <div className="border-b pb-6">
                  <h3 className="font-semibold mb-2">Order Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Order Expiry (days)</Label>
                      <Input type="number" min={1} value={payments.orderExpiryDays} onChange={e => setPayments(p => ({ ...p, orderExpiryDays: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <Label>Auto-complete Orders</Label>
                      <input type="checkbox" checked={payments.autoComplete} onChange={e => setPayments(p => ({ ...p, autoComplete: e.target.checked }))} className="ml-2" />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Refund Policy</Label>
                      <Textarea value={payments.refundPolicy} onChange={e => setPayments(p => ({ ...p, refundPolicy: e.target.value }))} rows={3} />
                    </div>
                  </div>
                </div>
                {/* Payout Settings */}
                <div className="border-b pb-6">
                  <h3 className="font-semibold mb-2">Payout Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Payout Schedule</Label>
                      <select value={payments.payoutSchedule} onChange={e => setPayments(p => ({ ...p, payoutSchedule: e.target.value }))} className="w-full border rounded px-3 py-2">
                        {payoutSchedules.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Payout Methods</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {payoutMethods.map(m => (
                          <label key={m.value} className="flex items-center space-x-1">
                            <input type="checkbox" checked={payments.payoutMethods.includes(m.value)} onChange={e => setPayments(p => ({ ...p, payoutMethods: e.target.checked ? [...p.payoutMethods, m.value] : p.payoutMethods.filter(v => v !== m.value) }))} />
                            <span>{m.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Payout Processing Fee</Label>
                      <Input type="number" min={0} value={payments.payoutFee} onChange={e => setPayments(p => ({ ...p, payoutFee: Number(e.target.value) }))} />
                    </div>
                  </div>
                </div>
                {/* Gateway Credentials */}
                <div>
                  <h3 className="font-semibold mb-2">Gateway Credentials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Stripe API Key</Label>
                      <Input value={payments.stripeKey} onChange={e => setPayments(p => ({ ...p, stripeKey: e.target.value }))} />
                    </div>
                    <div>
                      <Label>PayPal Client ID</Label>
                      <Input value={payments.paypalClientId} onChange={e => setPayments(p => ({ ...p, paypalClientId: e.target.value }))} />
                    </div>
                    <div>
                      <Label>PayPal Secret</Label>
                      <Input value={payments.paypalSecret} onChange={e => setPayments(p => ({ ...p, paypalSecret: e.target.value }))} />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Manual Payment Instructions</Label>
                      <Textarea value={payments.manualInstructions} onChange={e => setPayments(p => ({ ...p, manualInstructions: e.target.value }))} rows={3} />
                    </div>
                  </div>
                </div>
                <Button onClick={handleSavePayments} className="mt-6">Save Payments Settings</Button>
              </CardContent>
            </Card>
          ) : activeCategory === 'notifications' ? (
            <Card className="shadow-md bg-card border border-border">
              <CardHeader className="bg-muted rounded-t-lg">
                <CardTitle className="text-xl font-bold text-primary">Notifications Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" checked={notifications.email} onChange={e => setNotifications(n => ({ ...n, email: e.target.checked }))} />
                  <Label>Email Notifications</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" checked={notifications.sms} onChange={e => setNotifications(n => ({ ...n, sms: e.target.checked }))} />
                  <Label>SMS Notifications</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" checked={notifications.newsletter} onChange={e => setNotifications(n => ({ ...n, newsletter: e.target.checked }))} />
                  <Label>Newsletter Subscription</Label>
                </div>
                <Button onClick={handleSaveNotifications} className="mt-4">Save Notifications</Button>
              </CardContent>
            </Card>
          ) : activeCategory === 'themes' ? (
            <Card className="shadow-md bg-card border border-border">
              <CardHeader className="bg-muted rounded-t-lg">
                <CardTitle className="text-xl font-bold text-primary">Theme Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Mode</Label>
                  <select value={themes.mode} onChange={e => setThemes(t => ({ ...t, mode: e.target.value }))} className="w-full border rounded px-3 py-2">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div>
                  <Label>Primary Color</Label>
                  <Input type="color" value={themes.primaryColor} onChange={e => setThemes(t => ({ ...t, primaryColor: e.target.value }))} className="w-16 h-10 p-0 border-none" />
                </div>
                <div>
                  <Label>Logo URL</Label>
                  <Input value={themes.logo} onChange={e => setThemes(t => ({ ...t, logo: e.target.value }))} />
                </div>
                <Button onClick={handleSaveThemes} className="mt-4">Save Theme</Button>
              </CardContent>
            </Card>
          ) : activeCategory === 'email' ? (
            <Card className="shadow-md bg-card border border-border">
              <CardHeader className="bg-muted rounded-t-lg">
                <CardTitle className="text-xl font-bold text-primary">Email Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>SMTP Host</Label>
                  <Input value={emailSettings.smtpHost} onChange={e => setEmailSettings(eS => ({ ...eS, smtpHost: e.target.value }))} />
                </div>
                <div>
                  <Label>SMTP Port</Label>
                  <Input value={emailSettings.smtpPort} onChange={e => setEmailSettings(eS => ({ ...eS, smtpPort: e.target.value }))} />
                </div>
                <div>
                  <Label>Sender Name</Label>
                  <Input value={emailSettings.senderName} onChange={e => setEmailSettings(eS => ({ ...eS, senderName: e.target.value }))} />
                </div>
                <div>
                  <Label>Sender Email</Label>
                  <Input value={emailSettings.senderEmail} onChange={e => setEmailSettings(eS => ({ ...eS, senderEmail: e.target.value }))} />
                </div>
                <Button onClick={handleSaveEmail} className="mt-4">Save Email Settings</Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
        {/* Sticky Save Bar (only for system settings) */}
        {activeCategory === 'system' && (
          <div className="fixed bottom-0 left-0 w-full md:w-[calc(100%-16rem)] md:left-64 z-30 bg-white border-t shadow-lg p-4 flex justify-end space-x-2">
            <Button onClick={handleSaveChanges} disabled={saving} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </Button>
          </div>
        )}
      </main>
    </div>
>>>>>>> a02f476 (admin dashboard)
  );
};

export default SystemSettings;