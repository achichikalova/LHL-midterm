DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  properties_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  is_for_admin BOOLEAN DEFAULT false
);
