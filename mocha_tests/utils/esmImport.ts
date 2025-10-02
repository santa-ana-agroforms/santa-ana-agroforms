import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export async function esmImport(relPathFromSrc: string): Promise<any> {
  const repoRoot = process.cwd();
  const relNoSrc = relPathFromSrc.replace(/^src[\\/]/, '');
  const noExt = relNoSrc.replace(/\.tsx?$/i, '');
  const dir = path.dirname(noExt);
  const base = path.basename(noExt);

  const candidates = [
    path.join(repoRoot, 'mocha_build', `${noExt}.js`),
    path.join(repoRoot, 'mocha_build', dir, base, 'index.js'),
  ];

  for (const abs of candidates) {
    if (fs.existsSync(abs)) {
      const url = pathToFileURL(abs).href;
      return import(url);
    }
  }

  const srcAbs = path.join(repoRoot, relPathFromSrc);
  const srcUrl = pathToFileURL(srcAbs).href;
  return import(srcUrl);
}

export async function esmImportAny(pathsFromSrc: string[]): Promise<any> {
  let lastErr: any;
  for (const p of pathsFromSrc) {
    try {
      return await esmImport(p);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error('No se pudo importar ninguna ruta candidata');
}
