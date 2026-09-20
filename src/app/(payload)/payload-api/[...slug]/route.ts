import config from '@payload-config';
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes';

/**
 * Raised for one endpoint: POST /payload-api/subscribers/notify sends the
 * reopening announcement in batches of about 25 seconds, paced to the mail
 * provider's rate limit. Everything else here finishes in well under a second.
 */
export const maxDuration = 60;

export const GET = REST_GET(config);
export const POST = REST_POST(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const PUT = REST_PUT(config);
export const OPTIONS = REST_OPTIONS(config);
