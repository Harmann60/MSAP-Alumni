import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../src/utils/password.js';
import { AuthService } from '../src/services/authService.js';
import { env } from '../src/config/env.js';

describe('Password Hashing & Bcrypt Security', () => {
  test('should hash password with bcrypt and produce 60-character hash', async () => {
    const raw = 'SecureP@ssw0rd2026!';
    const hash = await hashPassword(raw);

    assert.ok(hash.startsWith('$2'), 'Hash must start with bcrypt prefix ($2a/$2b)');
    assert.strictEqual(hash.length, 60, 'Bcrypt hash must be 60 characters');
  });

  test('should securely verify matching password and reject incorrect password', async () => {
    const password = 'ManipuriAlumni@1973';
    const hash = await hashPassword(password);

    const isMatch = await comparePassword(password, hash);
    const isWrong = await comparePassword('WrongPassword123', hash);

    assert.strictEqual(isMatch, true, 'Valid password must return true');
    assert.strictEqual(isWrong, false, 'Invalid password must return false');
  });

  test('should generate different salts for identical passwords', async () => {
    const password = 'SamePasswordTwice';
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    assert.notStrictEqual(hash1, hash2, 'Unique salt must ensure distinct hashes for same password');
  });
});

describe('JWT Token Generation & Cryptographic Verification', () => {
  test('should sign and verify valid JWT token with user claims', () => {
    const payload = {
      id: 'test-admin-uuid-1234',
      email: 'admin@msap.org',
      role: 'ADMIN',
      fullName: 'Test Administrator',
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
    const decoded = jwt.verify(token, env.JWT_SECRET);

    assert.strictEqual(decoded.id, payload.id);
    assert.strictEqual(decoded.email, payload.email);
    assert.strictEqual(decoded.role, payload.role);
    assert.strictEqual(decoded.fullName, payload.fullName);
  });

  test('should reject tampered or invalid JWT signature', () => {
    const token = jwt.sign({ id: '123' }, env.JWT_SECRET, { expiresIn: '1h' });
    const tampered = token.slice(0, -5) + 'xxxxx';

    assert.throws(
      () => jwt.verify(tampered, env.JWT_SECRET),
      { name: 'JsonWebTokenError' },
      'Tampered token must fail cryptographic verification'
    );
  });

  test('single-use password reset token should embed password version and verify successfully', () => {
    const alumnus = {
      id: 'alumnus-uuid-999',
      email: 'alumnus@msap.org',
      password_hash: '$2b$12$abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    };

    const token = AuthService.generatePasswordResetToken(alumnus);
    assert.ok(typeof token === 'string' && token.length > 20);

    const decoded = AuthService.verifyPasswordResetToken(token);
    assert.strictEqual(decoded.id, alumnus.id);
    assert.strictEqual(decoded.email, alumnus.email);
    assert.strictEqual(decoded.type, 'password_reset');
    assert.strictEqual(decoded.pv, alumnus.password_hash.slice(-10));
  });
});
