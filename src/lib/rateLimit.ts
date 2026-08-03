type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// In-memory fixed-window rate limiter. Fine for a single-instance deploy;
// swap for a shared store (e.g. Redis) if this ever runs behind multiple instances.
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}
