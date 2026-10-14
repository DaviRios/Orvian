import { isAllowedOrigin } from './origin-policy';

describe('origin policy', () => {
  it('accepts requests without Origin and exact configured origins', () => {
    expect(
      isAllowedOrigin(undefined, 'https://admin.orvian.com', 'production'),
    ).toBe(true);
    expect(
      isAllowedOrigin(
        'https://admin.orvian.com',
        'https://admin.orvian.com',
        'production',
      ),
    ).toBe(true);
  });

  it('accepts equivalent loopback hosts outside production', () => {
    expect(
      isAllowedOrigin(
        'http://127.0.0.1:4200',
        'http://localhost:4200',
        'development',
      ),
    ).toBe(true);
    expect(
      isAllowedOrigin('http://[::1]:4200', 'http://localhost:4200', 'test'),
    ).toBe(true);
  });

  it('rejects loopback aliases in production and mismatched ports', () => {
    expect(
      isAllowedOrigin(
        'http://127.0.0.1:4200',
        'http://localhost:4200',
        'production',
      ),
    ).toBe(false);
    expect(
      isAllowedOrigin(
        'http://127.0.0.1:4300',
        'http://localhost:4200',
        'development',
      ),
    ).toBe(false);
  });

  it('rejects non-loopback and malformed origins', () => {
    expect(
      isAllowedOrigin(
        'http://attacker.example:4200',
        'http://localhost:4200',
        'development',
      ),
    ).toBe(false);
    expect(
      isAllowedOrigin('not-an-origin', 'http://localhost:4200', 'development'),
    ).toBe(false);
  });
});
