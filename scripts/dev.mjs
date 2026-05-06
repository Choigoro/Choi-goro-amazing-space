import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(rootDir, '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const processes = [
  spawn(npmCommand, ['run', 'dev'], {
    cwd: path.join(projectRoot, 'frontend'),
    stdio: 'inherit',
    shell: false,
  }),
  spawn(npmCommand, ['run', 'dev'], {
    cwd: path.join(projectRoot, 'backend'),
    stdio: 'inherit',
    shell: false,
  }),
];

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const childProcess of processes) {
    if (!childProcess.killed) {
      childProcess.kill();
    }
  }

  process.exit(code);
}

for (const childProcess of processes) {
  childProcess.on('exit', (code, signal) => {
    if (signal || (typeof code === 'number' && code !== 0)) {
      shutdown(typeof code === 'number' ? code : 1);
    }
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));