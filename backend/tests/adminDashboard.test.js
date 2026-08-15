import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeAttendance } from '../utils/adminDashboard.js';

test('summarizeAttendance counts registered, present, absent, and paid totals', () => {
  const records = [
    { status: 'present', user: { name: 'A' } },
    { status: 'present', user: { name: 'B' } },
    { status: 'registered', user: { name: 'C' } },
    { status: 'absent', user: { name: 'D' } },
    { status: 'cancelled', user: { name: 'E' } },
  ];

  const summary = summarizeAttendance(records, 3);

  assert.equal(summary.totalUsers, 5);
  assert.equal(summary.presentCount, 2);
  assert.equal(summary.registeredCount, 1);
  assert.equal(summary.absentCount, 1);
  assert.equal(summary.paidMembersCount, 3);
});
