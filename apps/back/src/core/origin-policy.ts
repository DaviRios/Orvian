const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

export function isAllowedOrigin(
  requestOrigin: string | undefined,
  configuredOrigin: string,
  environment: 'development' | 'test' | 'production',
): boolean {
  if (!requestOrigin || requestOrigin === configuredOrigin) return true;
  if (environment === 'production') return false;

  try {
    const requestUrl = new URL(requestOrigin);
    const configuredUrl = new URL(configuredOrigin);
    return (
      LOOPBACK_HOSTS.has(requestUrl.hostname) &&
      LOOPBACK_HOSTS.has(configuredUrl.hostname) &&
      requestUrl.protocol === configuredUrl.protocol &&
      requestUrl.port === configuredUrl.port
    );
  } catch {
    return false;
  }
}
