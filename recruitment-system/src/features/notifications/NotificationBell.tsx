import React from 'react';
import { Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/app/hooks';

/**
 * Placeholder NotificationBell – will be fully implemented in task 15.
 * Shows the unread count badge from Redux state.
 */
const NotificationBell: React.FC = () => {
  const unreadCount = useAppSelector((state) => state.notifications.unreadCount);

  return (
    <Badge count={unreadCount} size="small" className="cursor-pointer">
      <BellOutlined className="text-xl text-gray-600 hover:text-blue-500 transition-colors" />
    </Badge>
  );
};

export default NotificationBell;
