import React, { useMemo } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  HeartOutlined,
  BellOutlined,
  PlusOutlined,
  TeamOutlined,
  CalendarOutlined,
  BankOutlined,
  SettingOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { setSidebarCollapsed } from '@/features/ui/uiSlice';
import type { UserRole } from '@/types/enums';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function makeItem(
  label: string,
  key: string,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return { key, icon, label, children } as MenuItem;
}

const menuByRole: Record<UserRole, MenuItem[]> = {
  candidate: [
    makeItem('Dashboard', '/candidate/dashboard', <DashboardOutlined />),
    makeItem('Hồ Sơ', '/candidate/profile', <UserOutlined />),
    makeItem('Đơn Ứng Tuyển', '/candidate/applications', <FileTextOutlined />),
    makeItem('Việc Làm Đã Lưu', '/candidate/saved-jobs', <HeartOutlined />),
    makeItem('Thông Báo', '/candidate/notifications', <BellOutlined />),
  ],
  recruiter: [
    makeItem('Dashboard', '/recruiter/dashboard', <DashboardOutlined />),
    makeItem('Tin Tuyển Dụng', '/recruiter/jobs', <FileTextOutlined />, [
      makeItem('Danh Sách', '/recruiter/jobs', <FileTextOutlined />),
      makeItem('Tạo Tin Mới', '/recruiter/jobs/create', <PlusOutlined />),
    ]),
    makeItem('Ứng Viên', '/recruiter/jobs/applications', <TeamOutlined />),
    makeItem('Lịch Phỏng Vấn', '/recruiter/interviews', <CalendarOutlined />),
    makeItem('Trang Công Ty', '/recruiter/company', <BankOutlined />),
    makeItem('Thông Báo', '/recruiter/notifications', <BellOutlined />),
  ],
  admin: [
    makeItem('Dashboard', '/admin/dashboard', <DashboardOutlined />),
    makeItem('Người Dùng', '/admin/users', <TeamOutlined />),
    makeItem('Tin Tuyển Dụng', '/admin/jobs', <FileTextOutlined />),
    makeItem('Cài Đặt', '/admin/settings', <SettingOutlined />),
    makeItem('Nhật Ký', '/admin/audit-logs', <AuditOutlined />),
  ],
};

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  const role = user?.role;
  const menuItems = useMemo(() => (role ? menuByRole[role] : []), [role]);

  // Determine selected key from current path
  const selectedKey = location.pathname;

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  if (!role) return null;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => dispatch(setSidebarCollapsed(value))}
      trigger={null}
      width={240}
      collapsedWidth={64}
      className="bg-white border-r border-gray-200 min-h-screen"
      style={{ background: '#fff' }}
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0, paddingTop: 8 }}
      />
    </Sider>
  );
};

export default Sidebar;
