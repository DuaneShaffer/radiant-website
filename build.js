const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = __dirname;
const SRC_DIR = path.join(ROOT, 'src');
const PARTIALS_DIR = path.join(ROOT, 'partials');

const SERMON_PLAYLIST = 'PLEWJuYST1lj5t-DD7Rt7o6n45EGEAB6yH';
const SERMON_SPEAKER = 'Ben Widman';
const SERMON_SERIES = 'Psalms'; // update when series changes

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function buildSermonCards(xml) {
  const unescape = s => s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

  const playBtn = '<div class="play-btn">'
    + '<svg class="sermon-play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">'
    + '<path d="M8 5v14l11-7z"/></svg></div>';

  return xml.split('<entry>').slice(1, 4).map(entry => {
    const videoId = (entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1];
    const title = unescape((entry.match(/<media:title>([^<]+)<\/media:title>/) || [])[1] || '');
    const published = (entry.match(/<published>([^<]+)<\/published>/) || [])[1];
    const date = new Date(published).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    return `      <div class="sermon-card">
        <div class="sermon-thumb" style="background:url('${thumb}') center/cover;color:transparent">
          ${playBtn}
        </div>
        <div class="sermon-body">
          <span class="series-label">${SERMON_SERIES}</span>
          <h4>${title}</h4>
          <p class="sermon-meta">${SERMON_SPEAKER} &nbsp;·&nbsp; ${date}</p>
          <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener" class="card-link">Watch &rarr;</a>
        </div>
      </div>`;
  }).join('\n');
}

async function build() {
  const partials = {
    HEAD: fs.readFileSync(path.join(PARTIALS_DIR, 'head.html'), 'utf8'),
    NAV: fs.readFileSync(path.join(PARTIALS_DIR, 'nav.html'), 'utf8'),
    FOOTER: fs.readFileSync(path.join(PARTIALS_DIR, 'footer.html'), 'utf8'),
    SCRIPTS: fs.readFileSync(path.join(PARTIALS_DIR, 'scripts.html'), 'utf8'),
  };

  let sermonCards = null;
  try {
    const xml = await fetchUrl(`https://www.youtube.com/feeds/videos.xml?playlist_id=${SERMON_PLAYLIST}`);
    sermonCards = buildSermonCards(xml);
    console.log('  fetched: sermon cards from YouTube');
  } catch (e) {
    console.warn('  warning: could not fetch sermon data, leaving placeholder');
  }

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
    if (sermonCards) content = content.replace('<!--SERMON_CARDS-->', sermonCards);

    fs.writeFileSync(outPath, content, 'utf8');
    console.log(`  built: ${filename}`);
    count++;
  }

  console.log(`\nDone. ${count} file${count !== 1 ? 's' : ''} built.`);
}

build().catch(err => { console.error(err); process.exit(1); });
