import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'security', label: 'Security' },
  { key: 'notifications', label: 'Notifications' },
];

const ProfileSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [originalProfile, setOriginalProfile] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(profile?.email_notifications ?? true);
  const [inAppNotifications, setInAppNotifications] = useState(profile?.in_app_notifications ?? true);
  const [notifSuccess, setNotifSuccess] = useState('');
  const [notifError, setNotifError] = useState('');
  const [theme, setTheme] = useState(profile?.theme ?? 'auto');
  const [language, setLanguage] = useState(profile?.language ?? 'en');
  const [timeZone, setTimeZone] = useState(profile?.time_zone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [currency, setCurrency] = useState(profile?.currency ?? 'USD');
  const [emailFrequency, setEmailFrequency] = useState(profile?.email_frequency ?? 'daily');
  const [showTips, setShowTips] = useState(profile?.show_tips ?? true);
  const [fontSize, setFontSize] = useState(profile?.font_size ?? 'normal');
  const [highContrast, setHighContrast] = useState(profile?.high_contrast ?? false);
  const [prefSuccess, setPrefSuccess] = useState('');
  const [prefError, setPrefError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      setProfile(data);
      setOriginalProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'security') {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user && user.last_sign_in_at) {
          setLastLogin(new Date(user.last_sign_in_at).toLocaleString());
        }
      });
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'notifications' && profile) {
      setEmailNotifications(profile.email_notifications ?? true);
      setInAppNotifications(profile.in_app_notifications ?? true);
    }
  }, [activeTab, profile]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    setErrorMsg('');
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/avatar.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('clients').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('clients').getPublicUrl(filePath);
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);
      if (updateError) throw updateError;
      setProfile({ ...profile, avatar_url: publicUrl });
      setSuccess(true);
      window.dispatchEvent(new Event('profile-updated'));
    } catch (err: any) {
      setErrorMsg('Failed to upload avatar.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setSuccess(false);
    setErrorMsg('');
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setErrorMsg('');
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone,
        company: profile.company,
        address: profile.address,
        avatar_url: profile.avatar_url,
      })
      .eq('id', profile.id);
    setSaving(false);
    if (!error) {
      setSuccess(true);
      setOriginalProfile(profile);
      window.dispatchEvent(new Event('profile-updated'));
    } else {
      setErrorMsg('Failed to update profile.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    // Re-authenticate and update password
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) {
      setPasswordError('User not found.');
      return;
    }
    // Supabase does not support verifying current password directly, so just update
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordError(error.message || 'Failed to update password.');
    } else {
      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleSaveNotifications = async () => {
    setNotifSuccess('');
    setNotifError('');
    const { error } = await supabase
      .from('profiles')
      .update({
        email_notifications: emailNotifications,
        in_app_notifications: inAppNotifications,
      })
      .eq('id', profile.id);
    if (!error) {
      setNotifSuccess('Notification preferences updated!');
      setProfile({ ...profile, email_notifications: emailNotifications, in_app_notifications: inAppNotifications });
    } else {
      setNotifError('Failed to update notification preferences.');
    }
  };

  const handleCancelNotifications = () => {
    setEmailNotifications(profile.email_notifications ?? true);
    setInAppNotifications(profile.in_app_notifications ?? true);
    setNotifSuccess('');
    setNotifError('');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!profile) return <div className="p-8 text-center text-red-500">Profile not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      {(success || errorMsg) && (
        <div className="mb-6">
          {success && <div className="text-green-600 text-center">Profile updated successfully!</div>}
          {errorMsg && <div className="text-red-600 text-center">{errorMsg}</div>}
        </div>
      )}
      <div className="flex space-x-2 mb-8 border-b">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'profile' && (
        <div>
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl mb-2 overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                (profile.first_name?.charAt(0) || '') + (profile.last_name?.charAt(0) || '')
              )}
            </div>
            <button
              className="mt-2 bg-white text-xs px-4 py-1 rounded-full shadow border border-gray-200 hover:bg-gray-100"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              style={{ fontSize: '0.85rem' }}
            >
              {avatarUploading ? 'Uploading...' : 'Change Avatar'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={avatarUploading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="first_name"
              value={profile.first_name || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={profile.last_name || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone || ''}
              onChange={handleChange}
              placeholder="e.g. +254712345678"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Company</label>
            <input
              type="text"
              name="company"
              value={profile.company || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={profile.address || ''}
              onChange={handleChange}
              placeholder="e.g. 123 Main St, Nairobi, Kenya"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button onClick={handleCancel} variant="outline" className="w-full" disabled={saving}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      {activeTab === 'security' && (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          {lastLogin && <div className="mb-4 text-sm text-gray-500 text-center">Last login: {lastLogin}</div>}
          <div className="mb-4 text-center">
            <span className="text-gray-500">Two-Factor Authentication (2FA): </span>
            <span className="text-gray-400">Coming soon</span>
          </div>
          {passwordSuccess && <div className="text-green-600 mb-4 text-center">{passwordSuccess}</div>}
          {passwordError && <div className="text-red-600 mb-4 text-center">{passwordError}</div>}
          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                minLength={8}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                minLength={8}
                required
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2"
              />
              <label htmlFor="showPassword" className="text-sm">Show Password</label>
            </div>
            <Button type="submit" className="w-full">Change Password</Button>
          </form>
        </div>
      )}
      {activeTab === 'notifications' && (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          {notifSuccess && <div className="text-green-600 mb-4 text-center">{notifSuccess}</div>}
          {notifError && <div className="text-red-600 mb-4 text-center">{notifError}</div>}
          <div className="mb-4 flex items-center justify-between">
            <span>Email Notifications</span>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={e => setEmailNotifications(e.target.checked)}
              className="h-5 w-5"
            />
          </div>
          <div className="mb-4 flex items-center justify-between">
            <span>In-App Notifications</span>
            <input
              type="checkbox"
              checked={inAppNotifications}
              onChange={e => setInAppNotifications(e.target.checked)}
              className="h-5 w-5"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSaveNotifications} className="w-full">Save</Button>
            <Button onClick={handleCancelNotifications} variant="outline" className="w-full">Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings; 