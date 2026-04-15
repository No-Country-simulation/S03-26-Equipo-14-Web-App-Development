import { exceSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const pkgPath = resolve('packages/cms-library/packages.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

const type = process.argv[2];

const [major, minor, patch] = pkg.version.split('.').map(Number);

const versions = {
    patch: `${major}.${minor}.${patch + 1}`,
    minor: `${major}.${minor + 1}.0`,
    major: `${major+1}.0.0`,
};

if(!versions[type]){
    console.error('Use: node scripts/release.mjs patch|minor|major');
    process.exit(1);
}

pkg.version = versions[type];
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

console.log(`Version Bumped to ${pkg.version}`);

exceSync('git add packages/cms-library/package.json');
exceSync(`git commit -m "chore: release v${pkg.version}"`);
exceSync('git push origin cms-package');