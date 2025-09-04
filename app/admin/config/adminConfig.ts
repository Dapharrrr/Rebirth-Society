/* eslint-disable import/no-anonymous-default-export */
export const ADMIN_EMAILS = [
  'admin@rebirthsociety.com',
  // Ajoutez d'autres emails admin ici
];

// Fonction utilitaire pour vérifier si un email est admin
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

// Configuration des permissions admin
export const ADMIN_PERMISSIONS = {
  canManageVideos: true,
  canManagePacks: true,
  canManageUsers: true,
  canViewAnalytics: true,
};

export default {
  ADMIN_EMAILS,
  ADMIN_PERMISSIONS,
  isAdminEmail,
}; 