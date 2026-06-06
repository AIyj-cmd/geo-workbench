const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const rootDir = path.resolve(__dirname, '..');

function rel(filePath) {
  return path.relative(rootDir, filePath).replace(/\\/g, '/');
}

function collectJsFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectJsFiles(fullPath, results);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      results.push(fullPath);
    }
  }

  return results;
}

function run(label, command, args) {
  console.log(`\n[check] ${label}`);
  console.log(`[check] > ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    console.error(`[check] ${label} failed to start: ${result.error.message}`);
    return false;
  }

  if (result.status !== 0) {
    console.error(`[check] ${label} failed with exit code ${result.status}`);
    return false;
  }

  console.log(`[check] ${label} passed`);
  return true;
}

function resolveNpmCli() {
  const candidates = [
    process.env.npm_execpath,
    path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js'),
  ].filter(Boolean);

  return candidates.find(candidate => fs.existsSync(candidate)) || '';
}

function addExistingFile(fileSet, filePath) {
  const absolute = path.join(rootDir, filePath);
  if (!fs.existsSync(absolute)) {
    console.log(`[check] skip missing file: ${filePath}`);
    return;
  }
  fileSet.add(absolute);
}

function main() {
  let ok = true;

  const npmCli = resolveNpmCli();
  if (npmCli) {
    ok = run('npm test', process.execPath, [npmCli, 'test']) && ok;
  } else {
    console.error('[check] unable to find npm-cli.js for npm test');
    ok = false;
  }

  const files = new Set();
  [
    'app.js',
    'server.js',
    'tests/server.test.js',
    'tests/frontend-maintenance.test.js',
  ].forEach(file => addExistingFile(files, file));

  ['src', 'tests', 'scripts'].forEach(dir => {
    const absolute = path.join(rootDir, dir);
    if (!fs.existsSync(absolute)) {
      console.log(`[check] skip missing directory: ${dir}`);
      return;
    }
    collectJsFiles(absolute).forEach(file => files.add(file));
  });

  const sortedFiles = [...files].sort((a, b) => rel(a).localeCompare(rel(b)));
  for (const file of sortedFiles) {
    ok = run(`node --check ${rel(file)}`, process.execPath, ['--check', file]) && ok;
  }

  if (!ok) {
    console.error('\n[check] failed');
    process.exit(1);
  }

  console.log('\n[check] all checks passed');
}

main();
