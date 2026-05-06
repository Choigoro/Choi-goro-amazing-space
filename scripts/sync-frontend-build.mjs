import { access, cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(rootDir, '..');
const frontendDir = path.join(projectRoot, 'frontend');
const backendDir = path.join(projectRoot, 'backend');

const sourceDist = path.join(frontendDir, 'dist');
const targetDist = path.join(backendDir, 'dist');
const sourcePublic = path.join(frontendDir, 'public');
const targetPublic = path.join(backendDir, 'public');
const sourceData = path.join(frontendDir, 'data');
const targetData = path.join(backendDir, 'data');

async function ensureExists(directoryPath, label) {
  try {
    await access(directoryPath);
  } catch {
    throw new Error(`${label} not found: ${directoryPath}`);
  }
}

async function syncDirectory(sourcePath, targetPath) {
  await mkdir(path.dirname(targetPath), { recursive: true });
  await cp(sourcePath, targetPath, {
    recursive: true,
    dereference: true,
    force: true,
  });
}

await ensureExists(sourceDist, 'Frontend build output');

await syncDirectory(sourceDist, targetDist);
await syncDirectory(sourcePublic, targetPublic);
await syncDirectory(sourceData, targetData);

console.log('Synced frontend build into backend.');