CREATE INDEX IF NOT EXISTS "VectorStore_sourceType_idx" ON "VectorStore" ("sourceType");
CREATE INDEX IF NOT EXISTS "VectorStore_userId_sourceType_idx" ON "VectorStore" ("userId", "sourceType");