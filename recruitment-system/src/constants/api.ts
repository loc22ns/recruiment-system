export const BASE_URL = '/api/v1';

export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: (token: string) => `/auth/verify-email/${token}`,
    google: '/auth/google',
    googleCallback: '/auth/google/callback',
  },

  profile: {
    me: '/profile/me',
    avatar: '/profile/avatar',
    cv: '/profile/cv',
    cvById: (id: string) => `/profile/cv/${id}`,
    seekingStatus: '/profile/seeking-status',
  },

  jobs: {
    list: '/jobs',
    detail: (id: string) => `/jobs/${id}`,
    suggestions: '/jobs/suggestions',
  },

  recruiterJobs: {
    list: '/recruiter/jobs',
    create: '/recruiter/jobs',
    detail: (id: string) => `/recruiter/jobs/${id}`,
    update: (id: string) => `/recruiter/jobs/${id}`,
    publish: (id: string) => `/recruiter/jobs/${id}/publish`,
    close: (id: string) => `/recruiter/jobs/${id}/close`,
    copy: (id: string) => `/recruiter/jobs/${id}/copy`,
    delete: (id: string) => `/recruiter/jobs/${id}`,
  },

  applications: {
    submit: '/applications',
    my: '/applications/my',
    withdraw: (id: string) => `/applications/${id}`,
  },

  recruiterApplications: {
    byJob: (jobId: string) => `/recruiter/jobs/${jobId}/applications`,
    exportByJob: (jobId: string) => `/recruiter/jobs/${jobId}/applications/export`,
    detail: (id: string) => `/recruiter/applications/${id}`,
    updateStatus: (id: string) => `/recruiter/applications/${id}/status`,
    addNote: (id: string) => `/recruiter/applications/${id}/notes`,
    rate: (id: string) => `/recruiter/applications/${id}/rating`,
    bulkAction: '/recruiter/applications/bulk-action',
  },

  interviews: {
    list: '/recruiter/interviews',
    create: '/recruiter/interviews',
    update: (id: string) => `/recruiter/interviews/${id}`,
    cancel: (id: string) => `/recruiter/interviews/${id}`,
    result: (id: string) => `/recruiter/interviews/${id}/result`,
    confirm: (id: string) => `/candidate/interviews/${id}/confirm`,
  },

  company: {
    public: (id: string) => `/companies/${id}`,
    publicJobs: (id: string) => `/companies/${id}/jobs`,
    follow: (id: string) => `/companies/${id}/follow`,
    unfollow: (id: string) => `/companies/${id}/follow`,
    create: '/recruiter/company',
    update: '/recruiter/company',
  },

  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    settings: '/notifications/settings',
    messages: (applicationId: string) => `/messages/${applicationId}`,
    sendMessage: (applicationId: string) => `/messages/${applicationId}`,
  },

  dashboard: {
    stats: '/recruiter/dashboard/stats',
    applicationsChart: '/recruiter/dashboard/applications-chart',
    conversion: '/recruiter/dashboard/conversion',
    sources: '/recruiter/dashboard/sources',
    export: '/recruiter/dashboard/export',
    adminStats: '/admin/dashboard/stats',
  },

  admin: {
    users: '/admin/users',
    updateUserStatus: (id: string) => `/admin/users/${id}/status`,
    deleteUser: (id: string) => `/admin/users/${id}`,
    reportedJobs: '/admin/jobs/reported',
    reviewJob: (id: string) => `/admin/jobs/${id}/review`,
    auditLogs: '/admin/audit-logs',
    settings: '/admin/settings',
  },
} as const;
