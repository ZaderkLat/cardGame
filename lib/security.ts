const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  ip?: string,
) {
  const now = Date.now();
  const bucketKey = `${key}:${ip ?? "anonymous"}`;
  const current = rateLimitStore.get(bucketKey);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return true;
  }

  current.count += 1;

  if (current.count > limit) {
    return false;
  }

  return true;
}

export function getClientIp(headers: Headers | undefined) {
  const forwardedFor = headers?.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return headers?.get("x-real-ip") ?? "unknown";
}

export function sanitizeObject(value: unknown): unknown {
  if (typeof value === "string") {
    return value.slice(0, 500);
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value && typeof value === "object") {
    const entries: [string, unknown][] = [];

    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      const sanitized = sanitizeObject(item);

      if (sanitized !== undefined) {
        entries.push([String(key), sanitized]);
      }
    }

    return Object.fromEntries(entries);
  }

  return undefined;
}
