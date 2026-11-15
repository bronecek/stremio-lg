// Builds the webOS TV app: the production bundle with `--env webos`, then
// appinfo.json (version taken from package.json) and icons, then the .ipk.
import { execFileSync } from 'node:child_process';
import { copyFileSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const webosDir = path.join(root, 'webos');
const outDir = path.join(root, 'build-webos');
const appDir = path.join(outDir, 'app');

const run = (tool, args) => execFileSync(path.join(root, 'node_modules', '.bin', tool), args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
});

run('webpack', ['--mode', 'production', '--env', 'webos']);

const { version } = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const appInfo = JSON.parse(readFileSync(path.join(webosDir, 'appinfo.json'), 'utf8'));
writeFileSync(path.join(appDir, 'appinfo.json'), `${JSON.stringify({ ...appInfo, version }, null, 4)}\n`);
for (const icon of [appInfo.icon, appInfo.largeIcon]) {
    copyFileSync(path.join(webosDir, icon), path.join(appDir, icon));
}

for (const file of readdirSync(outDir)) {
    if (file.endsWith('.ipk')) rmSync(path.join(outDir, file));
}
run('ares-package', ['--outdir', outDir, appDir]);
