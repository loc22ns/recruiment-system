import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="403"
      subTitle="Bạn không có quyền truy cập trang này."
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Về Trang Chủ
        </Button>
      }
    />
  );
};

export default ForbiddenPage;
