import React, { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Result, Spin, Typography } from 'antd';
import { useVerifyEmailMutation } from '@/features/auth/authApi';

const { Text } = Typography;

// ─── VerifyEmailPage ──────────────────────────────────────────────────────────

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [verifyEmail, { isLoading, isSuccess, isError }] = useVerifyEmailMutation();
  const calledRef = useRef(false);

  useEffect(() => {
    if (token && !calledRef.current) {
      calledRef.current = true;
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  // No token in URL
  if (!token) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <Result
          status="error"
          title="Liên kết không hợp lệ"
          subTitle="Liên kết xác minh email không hợp lệ hoặc đã hết hạn."
          extra={
            <Text type="secondary">
              Vui lòng kiểm tra lại email hoặc{' '}
              <Link to="/auth/register" className="text-blue-600 hover:text-blue-700">
                đăng ký lại
              </Link>
              .
            </Text>
          }
        />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center gap-4 py-8">
          <Spin size="large" />
          <Text type="secondary">Đang xác minh email của bạn...</Text>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <Result
          status="success"
          title="Xác minh email thành công!"
          subTitle="Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay bây giờ."
          extra={
            <Link
              to="/auth/login"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đăng nhập
            </Link>
          }
        />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <Result
          status="error"
          title="Xác minh email thất bại"
          subTitle="Liên kết xác minh không hợp lệ hoặc đã hết hạn."
          extra={
            <Text type="secondary">
              Vui lòng{' '}
              <Link to="/auth/register" className="text-blue-600 hover:text-blue-700">
                đăng ký lại
              </Link>{' '}
              hoặc liên hệ hỗ trợ.
            </Text>
          }
        />
      </div>
    );
  }

  return null;
};

export default VerifyEmailPage;
