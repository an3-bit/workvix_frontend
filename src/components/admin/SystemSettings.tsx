import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RefreshCcw, Save, Settings, User, CreditCard, Bell, Palette, Mail, Menu } from 'lucide-react';

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

  // Section forms state
  const [profile, setProfile] = useState({ name: '', email: '', avatar: '' });
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

  useEffect(() => {
    fetchSettings();
  }, []);

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
  const handleSaveProfile = () => toast({ title: 'Profile Saved', description: 'Profile settings updated.' });
  const handleSavePayments = () => toast({ title: 'Payments Saved', description: 'Payment settings updated.' });
  const handleSaveNotifications = () => toast({ title: 'Notifications Saved', description: 'Notification settings updated.' });
  const handleSaveThemes = () => toast({ title: 'Themes Saved', description: 'Theme settings updated.' });
  const handleSaveEmail = () => toast({ title: 'Email Saved', description: 'Email settings updated.' });

  // Group settings by prefix (e.g., system_, email_, etc.) for future expansion
  const groupedSettings = settings.reduce((acc, setting) => {
    const group = setting.setting_key.split('_')[0];
    acc[group] = acc[group] || [];
    acc[group].push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);

  return (
    <div className="flex flex-col md:flex-row min-h-[80vh]">
      {/* Sidebar */}
      <aside className={`transition-all duration-200 bg-white border-r ${sidebarOpen ? 'w-full md:w-64' : 'w-16'} p-4 mb-4 md:mb-0 flex flex-col items-center md:items-stretch`}>
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
      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
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
                  <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between bg-blue-50 rounded-t-lg">
                      <CardTitle className="text-xl font-bold text-blue-800">General System Settings</CardTitle>
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
            <Card className="shadow-md">
              <CardHeader className="bg-blue-50 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-blue-800">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Name</Label>
                  <Input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <Label>Avatar URL</Label>
                  <Input value={profile.avatar} onChange={e => setProfile(p => ({ ...p, avatar: e.target.value }))} />
                </div>
                <Button onClick={handleSaveProfile} className="mt-4">Save Profile</Button>
              </CardContent>
            </Card>
          ) : activeCategory === 'payments' ? (
            <Card className="shadow-md">
              <CardHeader className="bg-blue-50 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-blue-800">Payments & Orders Settings</CardTitle>
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
            <Card className="shadow-md">
              <CardHeader className="bg-blue-50 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-blue-800">Notifications Settings</CardTitle>
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
            <Card className="shadow-md">
              <CardHeader className="bg-blue-50 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-blue-800">Theme Settings</CardTitle>
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
            <Card className="shadow-md">
              <CardHeader className="bg-blue-50 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-blue-800">Email Settings</CardTitle>
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
  );
};

export default SystemSettings;