import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useForgotPasswordMutation } from '@/features/auth/authApi';

const { Title, Text } = Typography;

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// ─── ForgotPasswordForm ───────────────────────────────────────────────────────

const ForgotPasswordForm: React.FC = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null);
    try {
      await forgotPassword({ email: values.email }).unwrap();
      setIsSuccess(true);
    } catch {
      setServerError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  if (isSuccess) {
    return (
      <Alert
        type="success"
        showIcon
        message="Email đặt lại mật khẩu đã được gửi"
        description="Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn trong email. Liên kết có hiệu lực trong 1 giờ."
        className="rounded-lg"
      />
    );
  }

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <Alert type="error" showIcon message={serverError} className="mb-4" />
      )}

      <Form.Item
        label="Email"
        validateStatus={errors.email ? 'error' : ''}
        help={errors.email?.message}
        required
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="example@email.com"
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
          Gửi email đặt lại mật khẩu
        </Button>
      </Form.Item>
    </Form>
  );
};

// ─── ForgotPasswordPage ───────────────────────────────────────────────────────

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="text-center mb-6">
        <Title level={3} className="!mb-1">
          Quên mật khẩu
        </Title>
        <Text type="secondary">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu
        </Text>
      </div>

      <ForgotPasswordForm />

      <div className="text-center mt-4">
        <Link
          to="/auth/login"
          className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
        >
          <ArrowLeftOutlined />
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
