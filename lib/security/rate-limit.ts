import { prisma } from "@/lib/prisma";

type Options = {
  key: string;
  limit: number;
  windowSeconds: number;
};

export async function enforceRateLimit(options: Options) {
  const now = new Date();
  const windowStart = new Date(Math.floor(now.getTime() / (options.windowSeconds * 1000)) * (options.windowSeconds * 1000));
  const bucketKey = `${options.key}:${windowStart.toISOString()}`;

  const bucket = await prisma.rateLimitBucket.upsert({
    where: { bucketKey },
    create: {
      bucketKey,
      scopeKey: options.key,
      windowStart,
      count: 1,
      expiresAt: new Date(windowStart.getTime() + options.windowSeconds * 1000),
    },
    update: {
      count: { increment: 1 },
      updatedAt: now,
    },
  });

  const allowed = bucket.count <= options.limit;
  if (!allowed) {
    console.warn("[rate-limit] limit exceeded", {
      scopeKey: options.key,
      bucketKey,
      count: bucket.count,
      limit: options.limit,
      windowSeconds: options.windowSeconds,
    });
  }

  return {
    allowed,
    remaining: Math.max(0, options.limit - bucket.count),
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.expiresAt.getTime() - now.getTime()) / 1000)),
  };
}
