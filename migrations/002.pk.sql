ALTER TABLE challenges
ADD uuid VARCHAR(36) PRIMARY KEY;

ALTER TABLE admins
ADD CONSTRAINT admins_pk PRIMARY KEY (token);