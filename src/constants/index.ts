// Application constants
export const APP_NAME = 'SecuriTest'
export const APP_DESCRIPTION = 'Nền tảng ôn thi chứng khoán chuyên nghiệp'

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile'
  },
  USERS: '/api/users',
  EXAMS: '/api/exams',
  QUESTIONS: '/api/questions',
  CERTIFICATES: '/api/certificates',
  PRACTICE: '/api/practice'
} as const

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  EXAMS: '/exams',
  PRACTICE: '/practice',
  CERTIFICATES: '/certificates',
  RESULTS: '/results',
  STUDY_PLAN: '/study-plan'
} as const

// Authentication
export const AUTH_COOKIES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token'
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
} as const

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  LANGUAGE: 'language',
  USER_PREFERENCES: 'user_preferences'
} as const

// Themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const

// Languages
export const LANGUAGES = {
  VI: 'vi',
  EN: 'en'
} as const

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Trường này là bắt buộc',
  EMAIL_INVALID: 'Email không hợp lệ',
  PASSWORD_MIN_LENGTH: 'Mật khẩu phải có ít nhất 8 ký tự',
  PASSWORD_MISMATCH: 'Mật khẩu xác nhận không khớp',
  PHONE_INVALID: 'Số điện thoại không hợp lệ'
} as const

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
} as const
