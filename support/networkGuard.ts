import { parseTargetUrl, resolveTestTarget, TestTarget, TestTargetError } from '../config/testTarget';

export function assertAllowedUrl(candidate: string, target: TestTarget): URL {
  const validated = resolveTestTarget(target);
  const url = parseTargetUrl(candidate, validated.baseURL);
  if (!validated.allowedOrigins.includes(url.origin)) {
    throw new TestTargetError('TARGET_ORIGIN_DENIED');
  }
  return url;
}
