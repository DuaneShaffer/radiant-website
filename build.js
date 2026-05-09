const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC_DIR = path.join(ROOT, 'src');
const PARTIALS_DIR = path.join(ROOT, 'partials');

// Load partials
const partials = {
  HEAD: fs.readFileSync(path.join(PARTIALS_DIR, 'head.html'), 'utf8'),
  NAV: fs.readFileSync(path.join(PARTIALS_DIR, 'nav.html'), 'utf8'),
  FOOTER: fs.readFileSync(path.join(PARTIALS_DIR, 'footer.html'), 'utf8'),
  SCRIPTS: fs.readFileSync(path.join(PARTIALS_DIR, 'scripts.html'), 'utf8'),
};

// Get all .html source files
const srcFiles = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.html'));

let count = 0;
for (const filename of srcFiles) {
  const srcPath = path.join(SRC_DIR, filename);
  const outPath = path.join(ROOT, filename);

  let content = fs.readFileSync(srcPath, 'utf8');

  content = content.replace('<!--HEAD-->', partials.HEAD);
  content = content.replace('<!--NAV-->', partials.NAV);
  content = content.replace('<!--FOOTER-->', partials.FOOTER);
  content = content.replace('<!--SCRIPTS-->', partials.SCRIPTS);

  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`  built: ${filename}`);
  count++;
}

console.log(`\nDone. ${count} file${count !== 1 ? 's' : ''} built.`);
