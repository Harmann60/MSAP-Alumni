/**
 * @fileoverview Password hashing and comparison utilities using bcryptjs.
 *
 * Uses bcrypt with a cost factor of 12, which provides a good balance between
 * security and performance (≈250ms per hash on modern hardware). The cost factor
 * makes brute-force and rainbow-table attacks computationally infeasible.
 *
 * @module utils/password
 */

import bcrypt from 'bcryptjs';

/**
 * The bcrypt cost factor (work factor / salt rounds).
 * Higher values are slower but more resistant to brute force.
 * 12 rounds ≈ 250ms on modern hardware — sufficient for production.
 *
 * @constant {number}
 */
const SALT_ROUNDS = 12;

// ─── Functions ────────────────────────────────────────────────────────────────

/**
 * Hashes a plain-text password using bcrypt.
 *
 * A unique salt is automatically generated and embedded in the resulting hash,
 * so the same plain-text password produces a different hash each time.
 *
 * @param {string} plainPassword - The raw password string to hash.
 * @returns {Promise<string>} The bcrypt hash (60-character string, safe to store in the DB).
 */
export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Securely compares a plain-text password against a stored bcrypt hash.
 *
 * Uses a constant-time comparison internally to prevent timing attacks.
 *
 * @param {string} plainPassword  - The raw password provided by the user.
 * @param {string} hashedPassword - The bcrypt hash retrieved from the database.
 * @returns {Promise<boolean>} `true` if the password matches the hash, `false` otherwise.
 */
export async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}
