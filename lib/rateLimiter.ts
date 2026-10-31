export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

export class TokenBucketRateLimiter {
  private buckets = new Map<string, { tokens: number; lastRefill: number }>();
  private readonly maxTokens: number;
  private readonly refillRatePerSecond: number;

  constructor(maxTokens = 60, refillRatePerSecond = 1) {
    this.maxTokens = maxTokens;
    this.refillRatePerSecond = refillRatePerSecond;
  }

  public check(ip: string): RateLimitStatus {
    const now = Date.now();
    let bucket = this.buckets.get(ip);

    if (!bucket) {
      bucket = { tokens: this.maxTokens, lastRefill: now };
      this.buckets.set(ip, bucket);
    } else {
      const elapsedSeconds = (now - bucket.lastRefill) / 1000;
      bucket.tokens = Math.min(this.maxTokens, bucket.tokens + elapsedSeconds * this.refillRatePerSecond);
      bucket.lastRefill = now;
    }

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return {
        allowed: true,
        remaining: Math.floor(bucket.tokens),
        resetSeconds: Math.ceil((this.maxTokens - bucket.tokens) / this.refillRatePerSecond),
      };
    }

    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.ceil(1 / this.refillRatePerSecond),
    };
  }
}
