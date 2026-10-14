-- Update only the untouched default legacy administrator identity.
-- Custom administrators and password hashes are intentionally preserved.
UPDATE "users"
SET
  "email" = 'admin@orvian.local',
  "updated_at" = CURRENT_TIMESTAMP
WHERE
  "username" = 'admin'
  AND "email" = 'admin@soir.local'
  AND NOT EXISTS (
    SELECT 1
    FROM "users" AS "current_admin"
    WHERE "current_admin"."email" = 'admin@orvian.local'
  );
