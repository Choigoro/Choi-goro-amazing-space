const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const standaloneServerCandidates = [
  path.join(__dirname, 'dist', 'standalone', 'frontend', 'server.js'),
  path.join(__dirname, 'dist', 'standalone', 'server.js'),
];
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const isDevelopmentCommand =
  process.env.npm_lifecycle_event === 'dev' ||
  process.env.NODE_ENV === 'development';

process.env.PORT = String(PORT);
process.env.HOSTNAME = HOST;

const standaloneServer = standaloneServerCandidates.find((candidate) =>
  fs.existsSync(candidate)
);

if (!isDevelopmentCommand && standaloneServer && fs.existsSync(standaloneServer)) {
  require(standaloneServer);
  return;
}

const app = express();

app.use(cors());
app.use(express.json());

// 헬스체크 API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
