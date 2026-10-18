# Admin CMS configuration

The `/admin` interface can edit MDX project case studies and blog posts through the GitHub Contents API. Nothing is stored in the browser except an HttpOnly signed session cookie.

## Required server environment variables

- `ADMIN_SESSION_SECRET`: unique randomly generated secret, at least 32 characters
- `ADMIN_PASSWORD_SCRYPT`: `salt:hex-hash` where the hash is 64-byte Node.js scrypt; never store plaintext passwords
- `GITHUB_CONTENT_TOKEN`: fine-grained token authorized for **Contents: read/write** on `abdulrehman-dev-ai/abdulrehman`
- `GITHUB_CONTENT_BRANCH`: branch to edit (default `main`; use an isolated preview branch for testing)

Generate a strong scrypt value locally or through your secret manager, using Node's crypto API. Do not commit credentials or publish them in logs.

## Security

- Signed, HttpOnly, SameSite Strict cookie; eight-hour expiration.
- Unsafe mutations require a same-origin request and authentication.
- GitHub commits provide history and rollback; restrict token repository scope.
- Admin endpoints return no-store responses. Never share the signing key or GitHub token.
- For public production exposure, add an edge rate limit on login, multi-factor authentication and audit monitoring before using the CMS for sensitive content.

## Current scope

Only MDX project/blog content management is implemented; orders, reviews, pricing and Resend email require secure persistence and independent integrations.
