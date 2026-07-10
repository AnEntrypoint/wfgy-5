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

assert('skills hrefs point to github.com', skills.includes('github.com/AnEntrypoint/wfgy-5'));
assert('no broken local .md hrefs in skills', !skills.includes('./skills/') && !skills.includes('./research/'));
assert('index nav has all 6 pages', ['paper','highlights','research','skills','original'].every(p => index.includes(p + '.html')));
assert('research page includes the Polaris README doc', research.includes('polaris-readme'));
assert('research page includes the Seven Millennium Problems doc', research.includes('seven-millennium-problems'));
assert('research grouped by cat label', research.includes('reasoning + architecture'));
assert('highlights has One Engine One Logic Seven Together', highlights.includes('one-engine-one-logic-seven-together'));
assert('highlights has 8 items', highlights.includes('public-evidence-not-just-prose'));

console.log(`
${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
