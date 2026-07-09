const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');

execSync('npx --yes flatspace@latest build', { stdio: 'pipe' });

const dist = path.join(__dirname, 'dist');
const read = f => fs.readFileSync(path.join(dist, f), 'utf8');
const skills = read('skills.html');
const index = read('index.html');
const research = read('research.html');
const highlights = read('highlights.html');

let pass = 0, fail = 0;
function assert(label, cond) {
  if (cond) { console.log('PASS', label); pass++; }
  else { console.error('FAIL', label); fail++; }
}

assert('skills hrefs point to github.com', skills.includes('github.com/onestardao/WFGY/tree/main/Avatar'));
assert('no broken local .md hrefs in skills', !skills.includes('./skills/') && !skills.includes('./research/'));
assert('index nav has all 6 pages', ['paper','highlights','research','skills','original'].every(p => index.includes(p + '.html')));
assert('index has 47 research docs badge', index.includes('47 research docs'));
assert('research page includes architecture-overview', research.includes('architecture-overview'));
assert('research grouped by cat label', research.includes('reasoning + architecture'));
assert('highlights has Start in 60 Seconds', highlights.includes('Start in 60 Seconds'));
assert('highlights has 8 items', highlights.includes('One Runtime, Many Avatars'));

console.log(`
${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
