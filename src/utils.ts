export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') return false;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email.trim());
}

export { cn } from '@/lib/utils'


