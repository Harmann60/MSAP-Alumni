/**
 * @fileoverview Shared role and status constants for the MSAP Alumni platform.
 *
 * These string enumerations are used across route guards (RBAC), service logic,
 * and validators. Centralising them here prevents typos and makes it easy to
 * add new roles or statuses in the future.
 *
 * @module constants/roles
 */

export const ROLES = {

  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
};

export const ALUMNI_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
};
