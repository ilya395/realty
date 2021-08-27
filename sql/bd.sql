create TABLE object_statuses(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

CREATE TABLE realty(
  id SERIAL PRIMARY KEY,
  square INTEGER,
  number INTEGER,
  status_id INTEGER,
    FOREIGN KEY (status_id) REFERENCES object_statuses (id) ON DELETE CASCADE
);

INSERT INTO object_statuses (
  name
) values (
  'Продается'
);
INSERT INTO object_statuses (
  name
) values (
  'Забронировано'
);

INSERT INTO realty (
  square,
  number,
  status_id
) values (
  90,
  231,
  1
);

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  login VARCHAR(255) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE sessions(
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) UNIQUE,
  user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

ALTER TABLE sessions ADD COLUMN date_creation bigint;

INSERT INTO users (
  login,
  password
) values (
  'admin',
  '0DPiKuNIrrVmD8IUCuw1hQxNqZc='
);