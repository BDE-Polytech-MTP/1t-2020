CREATE TABLE challenges (
    title VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    done BOOLEAN[] NOT NULL
);

CREATE TABLE admins (
    name VARCHAR(30) NOT NULL,
    token VARCHAR(40) NOT NULL
);