import { test } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../src/services/authService.js';
import { NotFoundError, ForbiddenError } from '../src/utils/apiError.js';

test('Auth: Throws NotFoundError when logging in with unregistered email', async () => {
  await assert.rejects(
    async () => {
      await AuthService.alumniLogin({
        email: 'nobody@example.com',
        password: 'password123',
      });
    },
    (err) => {
      assert.ok(err instanceof NotFoundError);
      assert.match(err.message, /not been registered/);
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

test('Auth: Throws NotFoundError on Google Sign-In with unregistered email', async () => {
  await assert.rejects(
    async () => {
      await AuthService.googleLogin({
        email: 'unregistered.google@gmail.com',
      });
    },
    (err) => {
      assert.ok(err instanceof NotFoundError);
      assert.match(err.message, /not been registered/);
      return true;
    }
  );
});

test('Auth: Throws ForbiddenError on Google Sign-In with pending application', async () => {
  await assert.rejects(
    async () => {
      await AuthService.googleLogin({
        email: 'sanjit.ningombam@gmail.com',
      });
    },
    (err) => {
      assert.ok(err instanceof ForbiddenError);
      assert.match(err.message, /pending verification/);
      return true;
    }
  );
});

test('Auth: Succeeds on Google Sign-In with verified alumni application', async () => {
  // 'linthoi.t@outlook.com' has status: VERIFIED in mockRegistrations
  const result = await AuthService.googleLogin({
    email: 'linthoi.t@outlook.com',
  });

  assert.ok(result.token);
  assert.strictEqual(result.user.email, 'linthoi.t@outlook.com');
  assert.strictEqual(result.user.role, 'ALUMNI');
  assert.strictEqual(result.user.status, 'VERIFIED');
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

test('Auth: Succeeds when setting password on verified alumni record', async () => {
  const result = await AuthService.setAlumniPassword({
    email: 'linthoi.t@outlook.com',
    password: 'UpdatedSecurePass123!',
  });

  assert.ok(result.token);
  assert.strictEqual(result.user.email, 'linthoi.t@outlook.com');
  assert.strictEqual(result.user.status, 'VERIFIED');
});
