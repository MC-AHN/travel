CREATE TABLE IF NOT EXISTS registration_payments (
  id CHAR(36) NOT NULL PRIMARY KEY,
  registration_draft_id CHAR(36) NOT NULL,
  invoice_number VARCHAR(30) NOT NULL UNIQUE,
  payment_type VARCHAR(16) NOT NULL,
  amount_idr BIGINT UNSIGNED NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'pending',
  doku_request_id VARCHAR(128) NULL,
  payment_url VARCHAR(2048) NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  paid_at DATETIME NULL,
  INDEX registration_payments_draft_status (registration_draft_id, status),
  CONSTRAINT registration_payments_draft_fk
    FOREIGN KEY (registration_draft_id) REFERENCES registration_drafts (id)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
