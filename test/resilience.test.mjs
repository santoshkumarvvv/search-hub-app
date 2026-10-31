import test from 'node:test';
import assert from 'node:assert/strict';

// Test token bucket rate limiting logic
class TokenLimiter {
  constructor(max = 3) {
    this.tokens = max;
  }
  consume() {
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }
}

test('TokenBucket allows requests within burst threshold', () => {
  const limiter = new TokenLimiter(2);
  assert.equal(limiter.consume(), true);
  assert.equal(limiter.consume(), true);
  assert.equal(limiter.consume(), false); // rate limited
});

// Test Circuit Breaker state transitions
test('Circuit breaker trips to OPEN on repeated failures', () => {
  let failures = 0;
  const threshold = 3;
  let state = 'CLOSED';

  function recordFailure() {
    failures++;
    if (failures >= threshold) state = 'OPEN';
  }

  recordFailure();
  assert.equal(state, 'CLOSED');
  recordFailure();
  assert.equal(state, 'CLOSED');
  recordFailure();
  assert.equal(state, 'OPEN');
});
