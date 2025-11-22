import React from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import { useToast } from '../contexts/ToastContext';
import PromptHistory from './PromptHistory';

interface AccountSettingsProps {
  userId: string | null;
  userEmail: string | null;
  hasAccess: boolean;
  openSubscriptionModal: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ userId, userEmail, hasAccess, openSubscriptionModal }) => {
  const { addToast } = useToast();

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Password updated successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="font-heading text-4xl md:text-5xl text-white">Account Settings</h2>
        <p className="text-gray-400 mt-1">Manage your account details and subscription.</p>
      </div>

      {/* Account Information Card */}
      <Card>
        <h3 className="font-heading text-2xl border-b border-gray-700 pb-2 mb-4 text-blue-300">Account Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Email Address</label>
            <p className="text-lg text-white">{userEmail || 'Not available'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Authentication Method</label>
            <p className="text-lg text-white">{userEmail?.includes('google.user') ? 'Google' : 'Email & Password'}</p>
          </div>
        </div>
      </Card>

      {/* Change Password Card */}
      {!userEmail?.includes('google.user') && (
        <Card>
          <h3 className="font-heading text-2xl border-b border-gray-700 pb-2 mb-4 text-blue-300">Change Password</h3>
          <form className="space-y-4" onSubmit={handleUpdatePassword}>
            <Input id="current-password" label="Current Password" type="password" required />
            <Input id="new-password" label="New Password" type="password" required />
            <Input id="confirm-new-password" label="Confirm New Password" type="password" required />
            <div className="text-right">
              <Button type="submit">Update Password</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Subscription Card */}
      <Card>
        <h3 className="font-heading text-2xl border-b border-gray-700 pb-2 mb-4 text-blue-300">Subscription Plan</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg text-white">{hasAccess ? 'Pro Plan' : 'Free Plan'}</p>
            <p className="text-gray-400 text-sm">{hasAccess ? 'You have unlimited access.' : 'Upgrade to unlock the prompt generator.'}</p>
          </div>
          {!hasAccess && (
            <Button onClick={openSubscriptionModal} variant="primary">Upgrade to Pro</Button>
          )}
        </div>
      </Card>

      {/* Prompt History Card */}
      {userId && (
        <Card>
          <PromptHistory userId={userId} isCard={false} />
        </Card>
      )}

      {/* Danger Zone Card */}
      <Card className="border-red-500/50">
        <h3 className="font-heading text-2xl border-b border-gray-700 pb-2 mb-4 text-red-400">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg text-white">Delete Account</p>
            <p className="text-gray-400 text-sm">Permanently delete your account and all associated data. This action cannot be undone.</p>
          </div>
          <Button
            onClick={() => { if (confirm('Are you sure you want to delete your account permanently?')) { addToast('Account deleted.', 'info'); } }}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AccountSettings;