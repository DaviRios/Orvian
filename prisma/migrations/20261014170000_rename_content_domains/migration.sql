-- Rename the content domains without recreating tables or losing data.
ALTER TYPE "PopupStyle" RENAME TO "InformationStyle";

ALTER TABLE "slides" RENAME TO "products";
ALTER TABLE "popups" RENAME TO "information";
ALTER TABLE "ecosystem_items" RENAME TO "partner_banners";
ALTER TABLE "home_blog_links" RENAME TO "links";
ALTER TABLE "client_stories" RENAME TO "feedbacks";
ALTER TABLE "cases" RENAME TO "reviews";
ALTER TABLE "case_images" RENAME TO "review_images";
ALTER TABLE "case_testimonials" RENAME TO "review_testimonials";

ALTER TABLE "review_images" RENAME COLUMN "case_id" TO "review_id";
ALTER TABLE "review_testimonials" RENAME COLUMN "case_id" TO "review_id";

ALTER TABLE "products" RENAME CONSTRAINT "slides_pkey" TO "products_pkey";
ALTER TABLE "information" RENAME CONSTRAINT "popups_pkey" TO "information_pkey";
ALTER TABLE "partner_banners" RENAME CONSTRAINT "ecosystem_items_pkey" TO "partner_banners_pkey";
ALTER TABLE "links" RENAME CONSTRAINT "home_blog_links_pkey" TO "links_pkey";
ALTER TABLE "feedbacks" RENAME CONSTRAINT "client_stories_pkey" TO "feedbacks_pkey";
ALTER TABLE "reviews" RENAME CONSTRAINT "cases_pkey" TO "reviews_pkey";
ALTER TABLE "review_images" RENAME CONSTRAINT "case_images_pkey" TO "review_images_pkey";
ALTER TABLE "review_testimonials" RENAME CONSTRAINT "case_testimonials_pkey" TO "review_testimonials_pkey";

ALTER TABLE "products" RENAME CONSTRAINT "slides_logo_id_fkey" TO "products_logo_id_fkey";
ALTER TABLE "partner_banners" RENAME CONSTRAINT "ecosystem_items_image_id_fkey" TO "partner_banners_image_id_fkey";
ALTER TABLE "feedbacks" RENAME CONSTRAINT "client_stories_image_id_fkey" TO "feedbacks_image_id_fkey";
ALTER TABLE "reviews" RENAME CONSTRAINT "cases_logo_id_fkey" TO "reviews_logo_id_fkey";
ALTER TABLE "review_images" RENAME CONSTRAINT "case_images_case_id_fkey" TO "review_images_review_id_fkey";
ALTER TABLE "review_images" RENAME CONSTRAINT "case_images_image_id_fkey" TO "review_images_image_id_fkey";
ALTER TABLE "review_testimonials" RENAME CONSTRAINT "case_testimonials_case_id_fkey" TO "review_testimonials_review_id_fkey";

ALTER INDEX "slides_language_publication_status_is_active_idx" RENAME TO "products_language_publication_status_is_active_idx";
ALTER INDEX "popups_language_publication_status_is_active_idx" RENAME TO "information_language_publication_status_is_active_idx";
ALTER INDEX "ecosystem_items_publication_status_is_active_idx" RENAME TO "partner_banners_publication_status_is_active_idx";
ALTER INDEX "home_blog_links_publication_status_is_active_idx" RENAME TO "links_publication_status_is_active_idx";
ALTER INDEX "client_stories_language_publication_status_is_active_idx" RENAME TO "feedbacks_language_publication_status_is_active_idx";
ALTER INDEX "cases_language_publication_status_is_active_idx" RENAME TO "reviews_language_publication_status_is_active_idx";
ALTER INDEX "case_images_image_id_idx" RENAME TO "review_images_image_id_idx";
ALTER INDEX "case_images_case_id_image_id_key" RENAME TO "review_images_review_id_image_id_key";
ALTER INDEX "case_testimonials_case_id_language_publication_status_is_ac_idx" RENAME TO "review_testimonials_review_id_language_publication_status_is_idx";

-- Keep media discoverable under the renamed content concepts.
UPDATE "media_assets"
SET "tags" = array_replace("tags", 'slide', 'product')
WHERE "tags" @> ARRAY['slide']::TEXT[];

UPDATE "media_assets"
SET "tags" = array_replace("tags", 'ecosystem', 'partner-banner')
WHERE "tags" @> ARRAY['ecosystem']::TEXT[];

UPDATE "media_assets"
SET "tags" = array_replace("tags", 'client-story', 'feedback')
WHERE "tags" @> ARRAY['client-story']::TEXT[];

UPDATE "media_assets"
SET "tags" = array_replace("tags", 'case', 'review')
WHERE "tags" @> ARRAY['case']::TEXT[];

UPDATE "media_assets"
SET "tags" = array_replace("tags", 'home', 'site')
WHERE "tags" @> ARRAY['logo', 'home']::TEXT[];
