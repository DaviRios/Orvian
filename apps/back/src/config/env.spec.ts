import { loadEnv } from './env';

const requiredEnv = {
  DATABASE_URL: 'postgresql://user:password@example.com/orvian',
  JWT_SECRET: 'a-secure-test-secret-with-at-least-32-chars',
  ORVIAN_ADMIN_PASSWORD: 'admin123',
};

describe('environment configuration', () => {
  it('uses the Render public URL as the allowed origin', () => {
    const env = loadEnv({
      ...requiredEnv,
      NODE_ENV: 'production',
      RENDER_EXTERNAL_URL: 'https://orvian-demo.onrender.com',
    });

    expect(env.APP_ORIGIN).toBe('https://orvian-demo.onrender.com');
  });

  it('keeps an explicitly configured origin', () => {
    const env = loadEnv({
      ...requiredEnv,
      NODE_ENV: 'production',
      APP_ORIGIN: 'https://cms.example.com',
      RENDER_EXTERNAL_URL: 'https://orvian-demo.onrender.com',
    });

    expect(env.APP_ORIGIN).toBe('https://cms.example.com');
  });
});
