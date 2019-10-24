DROP DATABASE IF EXISTS guild_db;
CREATE database guild_db;

USE guild_db;

CREATE TABLE user_group (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE user (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  user_group_id INT NOT NULL,
  PRIMARY KEY (id),

UNIQUE(username, user_group_id),

INDEX user_group_ind(user_group_id),

  FOREIGN KEY (user_group_id)
	REFERENCES user_group(id)
    -- ON DELETE CASCADE
);

CREATE TABLE comment (
  id INT NOT NULL AUTO_INCREMENT,
  text VARCHAR(255) NULL,
  responding_to_id INT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  INDEX user_ind(user_id),
  INDEX responding_to_ind(responding_to_id),
  FOREIGN KEY (user_id)
	REFERENCES user(id)
    ON DELETE CASCADE,
  FOREIGN KEY (responding_to_id)
	REFERENCES comment(id)
    -- ON DELETE CASCADE
);

