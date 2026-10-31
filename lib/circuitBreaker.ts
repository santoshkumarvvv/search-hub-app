export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold?: number; // consecutive failures to open circuit
  cooldownPeriodMs?: number; // time to wait before trying half-open
  timeoutMs?: number;        // execution timeout per request
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;

  private readonly failureThreshold: number;
  private readonly cooldownPeriodMs: number;
  private readonly timeoutMs: number;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 3;
    this.cooldownPeriodMs = options.cooldownPeriodMs ?? 10000;
    this.timeoutMs = options.timeoutMs ?? 3000;
  }

  public getState(): CircuitState {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime > this.cooldownPeriodMs) {
        this.state = 'HALF_OPEN';
      }
    }
    return this.state;
  }

  public async execute<T>(action: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    const currentState = this.getState();

    if (currentState === 'OPEN') {
      return fallback();
    }

    try {
      const promise = action();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('CircuitBreakerTimeout')), this.timeoutMs)
      );

      const result = await Promise.race([promise, timeoutPromise]);
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      return fallback();
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}
