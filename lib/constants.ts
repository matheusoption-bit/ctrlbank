/**
 * Shared constants used by both the Node.js runtime (lib/auth.ts) and the
 * Edge runtime (middleware.ts). Keep this file free of Node.js-only imports
 * so it can safely be imported in middleware.
 */

export const SESSION_COOKIE_NAME = "ctrlbank_session";
