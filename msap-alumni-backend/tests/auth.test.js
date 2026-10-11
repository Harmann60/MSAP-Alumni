import { test } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../src/services/authService.js';
import { UnauthorizedError, ForbiddenError, BadRequestError } from '../src/utils/apiError.js';

test('Auth: Throws UnauthorizedError when logging in with unregistered email', async () => {
  await assert.rejects(
    async () => {
      await AuthService.alumniLogin({
        email: 'nobody@example.com',
        password: 'password123',
      });
    },
    (err) => {
      assert.ok(err instanceof UnauthorizedError);
      assert.match(err.message, /Invalid email or password/);
      return true;
    }
  );
});

test('Auth: Throws ForbiddenError when logging in with pending alumni application', async () => {
  // 'sanjit.ningombam@gmail.com' has status: PENDING in mockRegistrations
  await assert.rejects(
    async () => {
      await AuthService.alumniLogin({
        email: 'sanjit.ningombam@gmail.com',
        password: 'password123',
      });
    },
    (err) => {
      assert.ok(err instanceof ForbiddenError);
      assert.match(err.message, /pending verification/);
      return true;
    }
  );
});

test('Auth: Throws BadRequestError on Google Sign-In without credential token', async () => {
  await assert.rejects(
    async () => {
      await AuthService.googleLogin({
        email: 'unregistered.google@gmail.com',
      });
    },
    (err) => {
      assert.ok(err instanceof BadRequestError);
      assert.match(err.message, /Google credential ID token is required/);
      return true;
    }
  );
});

test('Auth: Throws ForbiddenError when setting password on pending alumni record', async () => {
  await assert.rejects(
    async () => {
      await AuthService.setAlumniPassword({
        email: 'sanjit.ningombam@gmail.com',
        password: 'NewPassword123!',
      });
    },
    (err) => {
      assert.ok(err instanceof ForbiddenError);
      assert.match(err.message, /pending verification/);
      return true;
    }
  );
});

test('Auth: Succeeds when setting password on verified alumni record with valid reset token', async () => {
  const token = AuthService.generateVerificationToken('linthoi.t@outlook.com');
  const result = await AuthService.setAlumniPassword({
    email: 'linthoi.t@outlook.com',
    password: 'UpdatedSecurePass123!',
    token,
  });

  assert.ok(result.token);
  assert.strictEqual(result.user.email, 'linthoi.t@outlook.com');
  assert.strictEqual(result.user.status, 'VERIFIED');
});
