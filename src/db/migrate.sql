--dont worry about this file sisnce it runs by itself when you run the bot
CREATE EXTENSION IF NOT EXISTS citext;
CREATE TABLE IF NOT EXISTS ranks (
    user_id CITEXT PRIMARY KEY,
    rank SMALLINT NOT NULL CHECK (rank BETWEEN 0 AND 5)
);
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    tag_name CITEXT NOT NULL,
    subtag_name CITEXT NOT NULL,
    message_link TEXT NOT NULL,
    file_path TEXT NOT NULL,
    created_by CITEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tag_name, subtag_name)
);
INSERT INTO ranks (user_id, rank) VALUES ('999999999999999999', 5)
ON CONFLICT (user_id) DO UPDATE SET rank = 5;