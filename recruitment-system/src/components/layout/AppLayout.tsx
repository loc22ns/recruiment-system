import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const { Content } = Layout;

/**
 * Main application layout used by protected routes (candidate, recruiter, admin).
 * Renders Header + collapsible Sidebar + page content via <Outlet />.
 */
const AppLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen">
      <Header />
      <Layout>
        <Sidebar />
        <Layout>
          <Content className="p-6 bg-gray-50 min-h-screen">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
