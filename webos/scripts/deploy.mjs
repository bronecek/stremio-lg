// Installs the built .ipk on the TV registered with `ares-setup-device` and launches it.
// The device name defaults to `tv`; override it with WEBOS_DEVICE.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const device = process.env.WEBOS_DEVICE || 'tv';
const { id } = JSON.parse(readFileSync(path.join(root, 'webos', 'appinfo.json'), 'utf8'));
const { version } = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const ipk = path.join(root, 'build-webos', `${id}_${version}_all.ipk`);

if (!existsSync(ipk)) {
    console.error(`${ipk} does not exist. Run \`pnpm build:webos\` first.`);
    process.exit(1);
}

const run = (tool, args) => execFileSync(path.join(root, 'node_modules', '.bin', tool), args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
});

run('ares-install', ['--device', device, ipk]);
run('ares-launch', ['--device', device, id]);
