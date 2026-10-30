# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 2.x     | ✅        |
| < 2.0   | ❌        |

## Reporting a Vulnerability

**Do not open a public issue for security vulnerabilities.**

Email the maintainer directly through GitHub (santoshkumarvvv) with:

- A short description of the issue
- Steps to reproduce
- Affected routes or components
- Suggested fix, if you have one

You will receive an acknowledgment within 72 hours. Fixes are prioritized by severity.

## What to expect

- Critical issues (auth bypass, XSS, data leak): patched within 48 hours
- Moderate issues: patched within 7 days
- Low severity: batched into the next release

## Scope

In scope: anything in this repository that processes user input, serves API responses, or handles authentication.

Out of scope: third-party services (Jikan, TMDb, YouTube) and their data.
