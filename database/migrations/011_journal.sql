-- The Journal: articles the boutique writes, and what customers say back.
--
-- `blogs` already existed (title, slug, excerpt, body, cover_image, status,
-- published_at) but nothing read or wrote it — the home page's "Latest News"
-- was a hardcoded array. This adds what it was missing to be a real section.

ALTER TABLE blogs
  -- Read time is computed from the body when the article is saved, not on every
  -- render: the body is a mediumtext and counting its words on each request to a
  -- list page is work done for nothing.
  ADD COLUMN read_minutes TINYINT UNSIGNED NOT NULL DEFAULT 1 AFTER excerpt,
  ADD COLUMN tag VARCHAR(40) NULL AFTER read_minutes,
  ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS blog_comments (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  blog_id    INT UNSIGNED NOT NULL,
  user_id    BIGINT UNSIGNED NOT NULL,
  body       VARCHAR(2000) NOT NULL,
  -- Unlike a product review, a comment is published immediately: it is a
  -- conversation, and a boutique that answers a week late isn't in one. The
  -- admin can hide or delete anything, and 'hidden' is kept rather than deleted
  -- so a moderator can see what they acted on.
  status     ENUM('visible','hidden') NOT NULL DEFAULT 'visible',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_blog_comments (blog_id, status, created_at),
  CONSTRAINT fk_comment_blog FOREIGN KEY (blog_id) REFERENCES blogs (id) ON DELETE CASCADE,
  CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
