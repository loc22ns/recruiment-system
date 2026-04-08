import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input, Button, Radio, Alert, Typography } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useRegisterMutation } from '@/features/auth/authApi';

const { Title, Text } = Typography;

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    fullName: z.string().min(1, 'Vui lòng nhập họ tên'),
    email: z.string().email('Email không hợp lệ'),
    password: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
      .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    role: z.enum(['candidate', 'recruiter'], {
      required_error: 'Vui lòng chọn vai trò',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// ─── RegisterForm Component ───────────────────────────────────────────────────

const RegisterForm: React.FC = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'candidate',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setEmailError(null);
    try {
      await register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        role: values.role,
      }).unwrap();
      setIsSuccess(true);
    } catch (err: unknown) {
      const error = err as { status?: number };
      if (error?.status === 409) {
        setEmailError('Email đã được sử dụng');
      }
    }
  };

  if (isSuccess) {
    return (
      <Alert
        type="success"
        showIcon
        message="Đăng ký thành công!"
        description="Vui lòng kiểm tra email của bạn để xác minh tài khoản trước khi đăng nhập."
        className="rounded-lg"
      />
    );
  }

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} noValidate>
      {/* Họ tên */}
      <Form.Item
        label="Họ tên"
        validateStatus={errors.fullName ? 'error' : ''}
        help={errors.fullName?.message}
        required
      >
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Nguyễn Văn A"
              size="large"
            />
          )}
        />
      </Form.Item>

      {/* Email */}
      <Form.Item
        label="Email"
        validateStatus={errors.email || emailError ? 'error' : ''}
        help={errors.email?.message ?? emailError}
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
              onChange={(e) => {
                field.onChange(e);
                setEmailError(null);
              }}
            />
          )}
        />
      </Form.Item>

      {/* Mật khẩu */}
      <Form.Item
        label="Mật khẩu"
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

      {/* Xác nhận mật khẩu */}
      <Form.Item
        label="Xác nhận mật khẩu"
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
              placeholder="Nhập lại mật khẩu"
              size="large"
            />
          )}
        />
      </Form.Item>

      {/* Vai trò */}
      <Form.Item
        label="Bạn là"
        validateStatus={errors.role ? 'error' : ''}
        help={errors.role?.message}
        required
      >
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Radio.Group {...field} size="large" className="w-full">
              <Radio.Button value="candidate" className="w-1/2 text-center">
                Ứng viên
              </Radio.Button>
              <Radio.Button value="recruiter" className="w-1/2 text-center">
                Nhà tuyển dụng
              </Radio.Button>
            </Radio.Group>
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
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};

// ─── RegisterPage ─────────────────────────────────────────────────────────────

const RegisterPage: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="text-center mb-6">
        <Title level={3} className="!mb-1">
          Tạo tài khoản
        </Title>
        <Text type="secondary">Tham gia RecruitPro ngay hôm nay</Text>
      </div>

      <RegisterForm />

      <div className="text-center mt-4">
        <Text type="secondary">
          Đã có tài khoản?{' '}
          <Link to="/auth/login" className="text-blue-600 hover:text-blue-700">
            Đăng nhập
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default RegisterPage;
