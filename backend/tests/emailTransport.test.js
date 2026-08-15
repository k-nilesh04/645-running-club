import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmailTransport } from '../controller/verificationController.js';

test('createEmailTransport prefers ipv4 Gmail STARTTLS settings', () => {
  const transporter = createEmailTransport();

  assert.equal(transporter.options.host, 'smtp.gmail.com');
  assert.equal(transporter.options.port, 587);
  assert.equal(transporter.options.secure, false);
  assert.equal(transporter.options.requireTLS, true);
  assert.equal(transporter.options.family, 4);
});
