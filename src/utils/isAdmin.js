// path: src/utils/isAdmin.js
export const ADMIN_EMAILS = ['admin@gmail.com'];

export function isAdminEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
