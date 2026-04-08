import React, { useState } from 'react';
import { Alert, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/app/hooks';

// ─── EmailVerificationBanner ──────────────────────────────────────────────────

/**
 * Dismissible banner shown to authenticated users who haven't verified their email.
 * Place this near the top of authenticated layouts.
 */
const EmailVerificationBanner: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [dismissed, setDismissed] = useState(false);

  // Only show for logged-in users with unverified email
  if (!user || user.isEmailVerified || dismissed) {
    return null;
  }

  return (
    <Alert
      type="warning"
      showIcon
      icon={<MailOutlined />}
      banner
      message={
        <span>
          Email của bạn chưa được xác minh.{' '}
          <Button
            type="link"
            size="small"
            className="!p-0 !h-auto font-medium"
            onClick={() => {
              // In a real app this would trigger a resend-verification-email API call
              window.location.href = '/auth/verify-email';
            }}
          >
            Gửi lại email xác minh
          </Button>
        </span>
      }
      closable
      onClose={() => setDismissed(true)}
      className="rounded-none"
    />
  );
};

export default EmailVerificationBanner;
