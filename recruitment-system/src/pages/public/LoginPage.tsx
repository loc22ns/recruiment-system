import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input, Button, Checkbox, Alert, Divider, Typography } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { useLoginMutation } from '@/features/auth/authApi';
import {
  incrementLoginAttempts,
  lockAccount,
  resetLoginAttempts,
} from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { BASE_URL, API_ENDPOINTS } from '@/constants/api';

const { Title, Text } = Typography;

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Countdown Hook ───────────────────────────────────────────────────────────

function useCountdown(lockUntil: string | null): number {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!lockUntil) {
      setSecondsLeft(0);
      return;
    }

    const update = () => {
      const diff = Math.max(0, Math.ceil((new Date(lockUntil).getTime() - Date.now()) / 1000));
      setSecondsLeft(diff);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [lockUntil]);

  return secondsLeft;
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── LoginForm Component ──────────────────────────────────────────────────────

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const { loginAttempts, isLocked, lockUntil } = useAppSelector((state) => state.auth);
  const secondsLeft = useCountdown(isLocked ? lockUntil : null);

  // Auto-unlock when countdown reaches 0
  useEffect(() => {
    if (isLocked && secondsLeft === 0) {
      dispatch(resetLoginAttempts());
    }
  }, [isLocked, secondsLeft, dispatch]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (isLocked) return;

    try {
      const result = await login({ email: values.email, password: values.password }).unwrap();
      dispatch(resetLoginAttempts());

      // Redirect based on role
      const role = result.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'recruiter') navigate('/recruiter/dashboard');
      else navigate('/candidate/dashboard');
    } catch {
      const newAttempts = loginAttempts + 1;
      dispatch(incrementLoginAttempts());

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntilTime = new Date(Date.now() + LOCK_DURATION_MS).toISOString();
        dispatch(lockAccount(lockUntilTime));
      }
    }
  };

  const googleOAuthUrl = `${BASE_URL}${API_ENDPOINTS.auth.google}`;

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} noValidate>
      {/* Locked alert */}
      {isLocked && secondsLeft > 0 && (
        <Alert
          type="error"
          showIcon
          className="mb-4"
          message="Tài khoản tạm thời bị khóa"
          description={`Bạn đã đăng nhập sai quá ${MAX_ATTEMPTS} lần. Vui lòng thử lại sau ${formatCountdown(secondsLeft)}.`}
        />
      )}

      {/* Failed attempts warning (not yet locked) */}
      {!isLocked && loginAttempts > 0 && loginAttempts < MAX_ATTEMPTS && (
        <Alert
          type="warning"
          showIcon
          className="mb-4"
          message={`Đăng nhập thất bại (${loginAttempts}/${MAX_ATTEMPTS} lần). Tài khoản sẽ bị khóa sau ${MAX_ATTEMPTS - loginAttempts} lần thử nữa.`}
        />
      )}

      {/* Email */}
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
              disabled={isLocked && secondsLeft > 0}
            />
          )}
        />
      </Form.Item>

      {/* Password */}
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
              placeholder="Nhập mật khẩu"
              size="large"
              disabled={isLocked && secondsLeft > 0}
            />
          )}
        />
      </Form.Item>

      {/* Remember me + Forgot password */}
      <Form.Item className="mb-4">
        <div className="flex items-center justify-between">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              >
                Ghi nhớ đăng nhập
              </Checkbox>
            )}
          />
          <Link
            to="/auth/forgot-password"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Quên mật khẩu?
          </Link>
        </div>
      </Form.Item>

      {/* Submit */}
      <Form.Item className="mb-2">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={isLoading}
          disabled={isLocked && secondsLeft > 0}
        >
          Đăng nhập
        </Button>
      </Form.Item>

      <Divider plain>
        <Text type="secondary" className="text-xs">
          hoặc
        </Text>
      </Divider>

      {/* Google OAuth */}
      <Form.Item className="mb-0">
        <Button
          size="large"
          block
          icon={<GoogleOutlined />}
          href={googleOAuthUrl}
          disabled={isLocked && secondsLeft > 0}
        >
          Đăng nhập với Google
        </Button>
      </Form.Item>
    </Form>
  );
};

// ─── LoginPage ────────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="text-center mb-6">
        <Title level={3} className="!mb-1">
          Đăng nhập
        </Title>
        <Text type="secondary">Chào mừng bạn trở lại RecruitPro</Text>
      </div>

      <LoginForm />

      <div className="text-center mt-4">
        <Text type="secondary">
          Chưa có tài khoản?{' '}
          <Link to="/auth/register" className="text-blue-600 hover:text-blue-700">
            Đăng ký ngay
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default LoginPage;
