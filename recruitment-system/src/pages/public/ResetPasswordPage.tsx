import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input, Button, Alert, Typography, Result } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useResetPasswordMutation } from '@/features/auth/authApi';

const { Title, Text } = Typography;

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
      .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// ─── ResetPasswordForm ────────────────────────────────────────────────────────

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setServerError(null);
    try {
      await resetPassword({ token, password: values.password }).unwrap();
      setIsSuccess(true);
      setTimeout(() => navigate('/auth/login'), 2000);
    } catch (err: unknown) {
      const error = err as { status?: number };
      if (error?.status === 400) {
        setServerError('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
      } else {
        setServerError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    }
  };

  if (isSuccess) {
    return (
      <Result
        status="success"
        title="Đặt lại mật khẩu thành công!"
        subTitle="Đang chuyển hướng đến trang đăng nhập..."
      />
    );
  }

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <Alert type="error" showIcon message={serverError} className="mb-4" />
      )}

      <Form.Item
        label="Mật khẩu mới"
        validateStatus={errors.password ? 'error' : ''}
        help={errors.password?.message}
        required
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Tối thiểu 8 ký tự, 1 chữ hoa, 1 số"
              size="large"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Xác nhận mật khẩu mới"
        validateStatus={errors.confirmPassword ? 'error' : ''}
        help={errors.confirmPassword?.message}
        required
      >
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập lại mật khẩu mới"
              size="large"
            />
          )}
        />
      </Form.Item>

      <Form.Item className="mb-2">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={isLoading}
        >
          Đặt lại mật khẩu
        </Button>
      </Form.Item>
    </Form>
  );
};

// ─── ResetPasswordPage ────────────────────────────────────────────────────────

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <Result
          status="error"
          title="Liên kết không hợp lệ"
          subTitle="Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."
          extra={
            <Link to="/auth/forgot-password" className="text-blue-600 hover:text-blue-700">
              Yêu cầu liên kết mới
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="text-center mb-6">
        <Title level={3} className="!mb-1">
          Đặt lại mật khẩu
        </Title>
        <Text type="secondary">Nhập mật khẩu mới cho tài khoản của bạn</Text>
      </div>

      <ResetPasswordForm token={token} />

      <div className="text-center mt-4">
        <Text type="secondary">
          Nhớ mật khẩu rồi?{' '}
          <Link to="/auth/login" className="text-blue-600 hover:text-blue-700">
            Đăng nhập
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
