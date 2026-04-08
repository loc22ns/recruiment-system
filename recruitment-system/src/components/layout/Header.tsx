import React from 'react';
import { Layout, Avatar, Dropdown, Button, Space } from 'antd';
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { toggleSidebar } from '@/features/ui/uiSlice';
import NotificationBell from '@/features/notifications/NotificationBell';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ Sơ',
      onClick: () => {
        if (user?.role === 'candidate') navigate('/candidate/profile');
      },
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài Đặt',
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng Xuất',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className="flex items-center justify-between bg-white border-b border-gray-200 px-4 h-16 sticky top-0 z-50">
      {/* Left: toggle + logo */}
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => dispatch(toggleSidebar())}
            className="text-gray-600"
          />
        )}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-xl font-bold text-blue-600">RecruitPro</span>
        </Link>
      </div>

      {/* Center: public navigation */}
      {!isAuthenticated && (
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/jobs" className="text-gray-600 hover:text-blue-500 transition-colors">
            Việc Làm
          </Link>
        </nav>
      )}

      {/* Right: notifications + user menu */}
      <Space size="middle" align="center">
        {isAuthenticated ? (
          <>
            <NotificationBell />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar icon={<UserOutlined />} className="bg-blue-500" />
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  {user?.fullName}
                </span>
              </div>
            </Dropdown>
          </>
        ) : (
          <Space>
            <Button onClick={() => navigate('/auth/login')}>Đăng Nhập</Button>
            <Button type="primary" onClick={() => navigate('/auth/register')}>
              Đăng Ký
            </Button>
          </Space>
        )}
      </Space>
    </AntHeader>
  );
};

export default Header;
