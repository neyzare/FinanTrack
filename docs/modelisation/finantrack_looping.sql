-- FinanTrack - script SQL pour la retro-conception Looping
-- Types simplifies (VARCHAR/INT/FLOAT/DATETIME/TEXT) pour la relecture par Looping.

CREATE TABLE User (
  id VARCHAR(30) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (email)
);

CREATE TABLE Stock (
  id INT NOT NULL,
  ticker VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  quantity INT NOT NULL,
  buyPrice FLOAT NOT NULL,
  userId VARCHAR(30) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (userId, ticker),
  FOREIGN KEY (userId) REFERENCES User(id)
);

CREATE TABLE StockSnapshot (
  id INT NOT NULL,
  stockId INT NOT NULL,
  ticker VARCHAR(255) NOT NULL,
  userId VARCHAR(30) NOT NULL,
  price FLOAT NOT NULL,
  quantity INT NOT NULL,
  totalValue FLOAT NOT NULL,
  snapshotDate DATETIME NOT NULL,
  createdAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (stockId) REFERENCES Stock(id)
);

CREATE TABLE SandboxState (
  id INT NOT NULL,
  userId VARCHAR(30) NOT NULL,
  liquidite FLOAT NOT NULL,
  positions TEXT NOT NULL,
  historique TEXT NOT NULL,
  candles TEXT NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (userId),
  FOREIGN KEY (userId) REFERENCES User(id)
);

CREATE TABLE PasswordResetToken (
  id VARCHAR(30) NOT NULL,
  userId VARCHAR(30) NOT NULL,
  tokenHash VARCHAR(255) NOT NULL,
  expiresAt DATETIME NOT NULL,
  usedAt DATETIME,
  createdAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (tokenHash),
  FOREIGN KEY (userId) REFERENCES User(id)
);

CREATE TABLE CandleStock (
  id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  ticker VARCHAR(255) NOT NULL,
  open FLOAT NOT NULL,
  high FLOAT NOT NULL,
  low FLOAT NOT NULL,
  close FLOAT NOT NULL,
  Volume INT NOT NULL,
  date DATETIME NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE CachedQuote (
  ticker VARCHAR(255) NOT NULL,
  price FLOAT NOT NULL,
  variation FLOAT,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (ticker)
);

CREATE TABLE SandboxStock (
  id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  secteur VARCHAR(255) NOT NULL,
  price FLOAT NOT NULL,
  PRIMARY KEY (id)
);
