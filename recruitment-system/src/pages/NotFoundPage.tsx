import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Trang bạn tìm kiếm không tồn tại."
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Về Trang Chủ
        </Button>
      }
    />
  );
};

export default NotFoundPage;
