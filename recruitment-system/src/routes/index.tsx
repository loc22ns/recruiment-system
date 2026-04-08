import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Spin } from 'antd';

import AppLayout from '@/components/layout/AppLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

// ── Lazy page imports ──────────────────────────────────────────────────────────

// Public
const HomePage = React.lazy(() => import('@/pages/public/HomePage'));
const JobsPage = React.lazy(() => import('@/pages/public/JobsPage'));
const JobDetailPage = React.lazy(() => import('@/pages/public/JobDetailPage'));
const CompanyPage = React.lazy(() => import('@/pages/public/CompanyPage'));

// Auth
const LoginPage = React.lazy(() => import('@/pages/public/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/public/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('@/pages/public/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('@/pages/public/ResetPasswordPage'));
const VerifyEmailPage = React.lazy(() => import('@/pages/public/VerifyEmailPage'));

// Candidate
const CandidateDashboardPage = React.lazy(() => import('@/pages/candidate/DashboardPage'));
const ProfilePage = React.lazy(() => import('@/pages/candidate/ProfilePage'));
const ApplicationsPage = React.lazy(() => import('@/pages/candidate/ApplicationsPage'));
const SavedJobsPage = React.lazy(() => import('@/pages/candidate/SavedJobsPage'));
const CandidateNotificationsPage = React.lazy(() => import('@/pages/candidate/NotificationsPage'));

// Recruiter
const RecruiterDashboardPage = React.lazy(() => import('@/pages/recruiter/DashboardPage'));
const RecruiterJobsPage = React.lazy(() => import('@/pages/recruiter/JobsPage'));
const CreateJobPage = React.lazy(() => import('@/pages/recruiter/CreateJobPage'));
const EditJobPage = React.lazy(() => import('@/pages/recruiter/EditJobPage'));
const JobApplicationsPage = React.lazy(() => import('@/pages/recruiter/JobApplicationsPage'));
const PipelinePage = React.lazy(() => import('@/pages/recruiter/PipelinePage'));
const RecruiterCompanyPage = React.lazy(() => import('@/pages/recruiter/CompanyPage'));
const InterviewsPage = React.lazy(() => import('@/pages/recruiter/InterviewsPage'));
const RecruiterNotificationsPage = React.lazy(() => import('@/pages/recruiter/NotificationsPage'));

// Admin
const AdminDashboardPage = React.lazy(() => import('@/pages/admin/DashboardPage'));
const UsersPage = React.lazy(() => import('@/pages/admin/UsersPage'));
const JobsReviewPage = React.lazy(() => import('@/pages/admin/JobsReviewPage'));
const SettingsPage = React.lazy(() => import('@/pages/admin/SettingsPage'));
const AuditLogsPage = React.lazy(() => import('@/pages/admin/AuditLogsPage'));

// Error pages (not lazy – small and needed immediately)
import NotFoundPage from '@/pages/NotFoundPage';
import ForbiddenPage from '@/pages/ForbiddenPage';

// ── Suspense wrapper ───────────────────────────────────────────────────────────

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spin size="large" />
  </div>
);

const withSuspense = (Component: React.LazyExoticComponent<React.FC>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

// ── Router definition ──────────────────────────────────────────────────────────

const router = createBrowserRouter([
  // ── Public routes (no auth required) ────────────────────────────────────────
  {
    path: '/',
    element: withSuspense(HomePage),
  },
  {
    path: '/jobs',
    element: withSuspense(JobsPage),
  },
  {
    path: '/jobs/:id',
    element: withSuspense(JobDetailPage),
  },
  {
    path: '/company/:id',
    element: withSuspense(CompanyPage),
  },

  // ── Auth routes (AuthLayout, no sidebar) ────────────────────────────────────
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: 'login', element: withSuspense(LoginPage) },
      { path: 'register', element: withSuspense(RegisterPage) },
      { path: 'forgot-password', element: withSuspense(ForgotPasswordPage) },
      { path: 'reset-password', element: withSuspense(ResetPasswordPage) },
      { path: 'verify-email', element: withSuspense(VerifyEmailPage) },
    ],
  },

  // ── Candidate routes (protected, role: candidate) ────────────────────────────
  {
    path: '/candidate',
    element: (
      <ProtectedRoute allowedRoles={['candidate']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/candidate/dashboard" replace /> },
      { path: 'dashboard', element: withSuspense(CandidateDashboardPage) },
      { path: 'profile', element: withSuspense(ProfilePage) },
      { path: 'applications', element: withSuspense(ApplicationsPage) },
      { path: 'saved-jobs', element: withSuspense(SavedJobsPage) },
      { path: 'notifications', element: withSuspense(CandidateNotificationsPage) },
    ],
  },

  // ── Recruiter routes (protected, role: recruiter) ────────────────────────────
  {
    path: '/recruiter',
    element: (
      <ProtectedRoute allowedRoles={['recruiter']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/recruiter/dashboard" replace /> },
      { path: 'dashboard', element: withSuspense(RecruiterDashboardPage) },
      { path: 'jobs', element: withSuspense(RecruiterJobsPage) },
      { path: 'jobs/create', element: withSuspense(CreateJobPage) },
      { path: 'jobs/:id/edit', element: withSuspense(EditJobPage) },
      { path: 'jobs/:id/applications', element: withSuspense(JobApplicationsPage) },
      { path: 'pipeline/:jobId', element: withSuspense(PipelinePage) },
      { path: 'company', element: withSuspense(RecruiterCompanyPage) },
      { path: 'interviews', element: withSuspense(InterviewsPage) },
      { path: 'notifications', element: withSuspense(RecruiterNotificationsPage) },
    ],
  },

  // ── Admin routes (protected, role: admin) ────────────────────────────────────
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: withSuspense(AdminDashboardPage) },
      { path: 'users', element: withSuspense(UsersPage) },
      { path: 'jobs', element: withSuspense(JobsReviewPage) },
      { path: 'settings', element: withSuspense(SettingsPage) },
      { path: 'audit-logs', element: withSuspense(AuditLogsPage) },
    ],
  },

  // ── Error pages ──────────────────────────────────────────────────────────────
  { path: '/forbidden', element: <ForbiddenPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

export default router;
