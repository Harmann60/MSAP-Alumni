import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { StoriesService } from '../src/services/storiesService.js';
import { AlumniService } from '../src/services/alumniService.js';
import { ConflictError, ForbiddenError } from '../src/utils/apiError.js';
import { authorize } from '../src/middlewares/rbac.js';
import { ROLES, ALUMNI_STATUS } from '../src/constants/roles.js';

describe('Concurrency & Race Condition Prevention', () => {
  test('StoriesService.update throws ConflictError when lastKnownUpdatedAt is superseded', async () => {
    // 1. Create a test story
    const story = await StoriesService.create({
      title: 'Concurrency Test Article',
      source: 'MSAP News',
      publishedDate: 'October 2026',
      imageUrl: 'https://example.com/test.jpg',
      excerpt: 'Concurrency and conflict detection test excerpt.',
      content: 'Initial article content.',
    });

    assert.ok(story.id, 'Story must be created');

    // 2. Simulate concurrent modification (story updated on server)
    const supersededTimestamp = new Date(Date.now() - 60000).toISOString();

    // 3. Attempt update with stale timestamp
    await assert.rejects(
      async () => {
        await StoriesService.update(story.id, {
          title: 'Attempted Overwrite Title',
          lastKnownUpdatedAt: supersededTimestamp,
        });
      },
      (err) => {
        assert.ok(err instanceof ConflictError, 'Error must be an instance of ConflictError');
        assert.ok(err.message.includes('Conflict detected'), 'Message must explain conflict');
        return true;
      }
    );
  });

  test('AlumniService.updateStatus throws ConflictError when expectedStatus does not match', async () => {
    // Look up an existing verified registration in mock seed data
    const verifiedAlumni = await AlumniService.findByEmail('linthoi.t@outlook.com');
    assert.ok(verifiedAlumni, 'Mock alumni should be present');
    assert.strictEqual(verifiedAlumni.status, ALUMNI_STATUS.VERIFIED);

    // Attempt to review assuming status is PENDING (simulating double-review race condition)
    await assert.rejects(
      async () => {
        await AlumniService.updateStatus(verifiedAlumni.id, {
          status: ALUMNI_STATUS.VERIFIED,
          expectedStatus: ALUMNI_STATUS.PENDING,
        });
      },
      (err) => {
        assert.ok(err instanceof ConflictError, 'Error must be an instance of ConflictError');
        assert.ok(err.message.includes('Conflict detected'), 'Message must explain conflict');
        return true;
      }
    );
  });
});

describe('RBAC Middleware Segregation', () => {
  test('Content Manager (MODERATOR) is blocked from Admin-only registration routes', () => {
    const adminOnlyGuard = authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN);

    const mockReq = {
      user: {
        id: 'user-mod-1',
        email: 'editor@msap.org',
        role: ROLES.MODERATOR,
      },
    };

    let nextCalledWithError = null;
    adminOnlyGuard(mockReq, {}, (err) => {
      nextCalledWithError = err;
    });

    assert.ok(nextCalledWithError instanceof ForbiddenError, 'Should block MODERATOR with ForbiddenError');
  });

  test('Content Manager (MODERATOR) is permitted on content management routes', () => {
    const contentGuard = authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR);

    const mockReq = {
      user: {
        id: 'user-mod-1',
        email: 'editor@msap.org',
        role: ROLES.MODERATOR,
      },
    };

    let nextCalled = false;
    let nextError = null;
    contentGuard(mockReq, {}, (err) => {
      if (err) nextError = err;
      else nextCalled = true;
    });

    assert.strictEqual(nextError, null, 'Content manager must not receive error');
    assert.strictEqual(nextCalled, true, 'Next must be called');
  });

  test('Content Manager (MODERATOR) is authorized to delete stories and content', () => {
    const deleteGuard = authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR);

    const mockReq = {
      user: {
        id: 'user-mod-1',
        email: 'editor@msap.org',
        role: ROLES.MODERATOR,
      },
    };

    let nextCalled = false;
    deleteGuard(mockReq, {}, (err) => {
      assert.strictEqual(err, undefined, 'Must not throw error on content delete');
      nextCalled = true;
    });

    assert.strictEqual(nextCalled, true, 'Delete guard should call next for MODERATOR');
  });
});

describe('Role Assignment by Admin for Registered Alumni', () => {
  test('Assigning role to a non-existent email throws NotFoundError', async () => {
    await assert.rejects(
      async () => {
        await AlumniService.assignRole({
          email: 'unregistered.person.999@msap.org',
          role: ROLES.CONTENT_MANAGER,
        });
      },
      (err) => {
        assert.ok(err.message.includes('No registered alumni found'), 'Must inform admin to have user register first');
        return true;
      }
    );
  });

  test('Assigning Content Manager role to registered alumnus succeeds and elevates member', async () => {
    // Alumnus 'sanjit.ningombam@gmail.com' exists in seed mock
    const assigned = await AlumniService.assignRole({
      email: 'sanjit.ningombam@gmail.com',
      role: ROLES.CONTENT_MANAGER,
    });

    assert.ok(assigned, 'Role assignment result should be returned');
    assert.strictEqual(assigned.email, 'sanjit.ningombam@gmail.com');
    assert.strictEqual(assigned.role, 'MODERATOR');
    assert.strictEqual(assigned.is_active, true);

    // Verify team listing includes Content Manager
    const team = await AlumniService.listTeam();
    const found = team.find((t) => t.email === 'sanjit.ningombam@gmail.com');
    assert.ok(found, 'Newly assigned content manager must be present in team roster');
    assert.strictEqual(found.displayRole, 'Content Manager');
  });
});

describe('Alumni Directory Search, Filtering & CSV Export', () => {
  test('AlumniService.list filters records by search query', async () => {
    const all = await AlumniService.list({ page: 1, limit: 5 });
    if (all.items.length > 0) {
      const sample = all.items[0];
      const queryTerm = (sample.full_name || sample.email || '').split(' ')[0];
      const res = await AlumniService.list({ search: queryTerm, page: 1, limit: 10 });
      assert.ok(res.items.length > 0, 'Must find matching record for search');
      assert.ok(res.items.some((i) => i.id === sample.id || i.full_name?.includes(queryTerm)));
    } else {
      const res = await AlumniService.list({ search: 'unlikelymatchxyz', page: 1, limit: 10 });
      assert.strictEqual(res.items.length, 0);
    }
  });

  test('AlumniService.list filters records by college name', async () => {
    const res = await AlumniService.list({ puneCollege: 'Fergusson', page: 1, limit: 10 });
    assert.ok(Array.isArray(res.items), 'Must return items array');
    if (res.items.length > 0) {
      assert.ok(res.items.every((i) => i.pune_college?.toLowerCase().includes('fergusson')));
    }
  });

  test('AlumniService.exportCSV generates valid RFC-4180 CSV with UTF-8 BOM', async () => {
    const csv = await AlumniService.exportCSV({ status: 'VERIFIED' });
    assert.ok(csv.startsWith('\uFEFF'), 'CSV must start with UTF-8 BOM');
    assert.ok(csv.includes('Full Name,Email Address,Phone Number'), 'CSV must contain standard headers');
    assert.ok(csv.includes('Pune College / Institution'), 'CSV must contain college column');
  });
});
