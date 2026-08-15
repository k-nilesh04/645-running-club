import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmailTransport, getEmailProvider, sendEmail } from '../utils/emailSender.js';

const withEnv = async (env, run) => {
  const keys = ['RESEND_API_KEY', 'BREVO_API_KEY', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

  for (const key of keys) delete process.env[key];
  Object.assign(process.env, env);

  try {
    await run();
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
};

test('createEmailTransport prefers ipv4 Gmail STARTTLS settings', () => {
  const transporter = createEmailTransport();

  assert.equal(transporter.options.host, 'smtp.gmail.com');
  assert.equal(transporter.options.port, 587);
  assert.equal(transporter.options.secure, false);
  assert.equal(transporter.options.requireTLS, true);
  assert.equal(transporter.options.family, 4);
});

test('http providers take priority over smtp', async () => {
  await withEnv({ RESEND_API_KEY: 'key', EMAIL_USER: 'a@b.com', EMAIL_PASS: 'x' }, () => {
    assert.equal(getEmailProvider(), 'resend');
  });

  await withEnv({ BREVO_API_KEY: 'key', EMAIL_USER: 'a@b.com', EMAIL_PASS: 'x' }, () => {
    assert.equal(getEmailProvider(), 'brevo');
  });

  await withEnv({ EMAIL_USER: 'a@b.com', EMAIL_PASS: 'x' }, () => {
    assert.equal(getEmailProvider(), 'smtp');
  });

  await withEnv({}, () => {
    assert.equal(getEmailProvider(), null);
  });
});

test('sendEmail posts to the Resend API with the configured sender', async () => {
  await withEnv({ RESEND_API_KEY: 'test-key', EMAIL_FROM: 'club@example.com' }, async () => {
    const originalFetch = globalThis.fetch;
    let request = null;

    globalThis.fetch = async (url, options) => {
      request = { url, options };
      return { ok: true, status: 200, text: async () => '' };
    };

    try {
      await sendEmail({ to: 'runner@example.com', subject: 'Hi', html: '<p>Hi</p>' });
    } finally {
      globalThis.fetch = originalFetch;
    }

    assert.equal(request.url, 'https://api.resend.com/emails');
    assert.equal(request.options.headers.Authorization, 'Bearer test-key');

    const body = JSON.parse(request.options.body);
    assert.equal(body.from, '645 Run Club <club@example.com>');
    assert.deepEqual(body.to, ['runner@example.com']);
  });
});

test('sendEmail fails fast when no provider is configured', async () => {
  await withEnv({}, async () => {
    await assert.rejects(
      () => sendEmail({ to: 'runner@example.com', subject: 'Hi', html: '<p>Hi</p>' }),
      /Email service not configured/
    );
  });
});
