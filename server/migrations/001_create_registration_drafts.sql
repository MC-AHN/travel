CREATE TABLE IF NOT EXISTS registration_drafts (
  id CHAR(36) NOT NULL PRIMARY KEY,
  access_token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
  package_id INT UNSIGNED NOT NULL,
  package_name VARCHAR(255) NOT NULL,
  departure VARCHAR(100) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  unit_price_idr BIGINT UNSIGNED NOT NULL,
  travelers INT UNSIGNED NOT NULL,
  registrant_name VARCHAR(150) NULL,
  phone VARCHAR(16) NULL,
  note VARCHAR(2000) NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  INDEX registration_drafts_status_expiry (status, expires_at)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
