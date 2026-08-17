#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const CONFIG_DIR = path.join(__dirname, 'src', 'config');
const files = fs.readdirSync(CONFIG_DIR).filter(f => f.endsWith('.json'));

async function checkUrl(url, name) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { 
      method: 'GET',
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'Range': 'bytes=0-0' }
    });
    clearTimeout(timeout);
    return { url, name, status: res.status, ok: res.ok };
  } catch (e) {
    return { url, name, status: 0, ok: false, error: e.name === 'AbortError' ? 'timeout' : e.message };
  }
}

async function main() {
  const allUrls = [];
  
  for (const file of files) {
    const content = JSON.parse(fs.readFileSync(path.join(CONFIG_DIR, file), 'utf8'));
    for (const item of content.listings || []) {
      if (item.url) {
        allUrls.push({ url: item.url, name: item.name, file, id: item.id });
      }
    }
  }

  console.log(`Checking ${allUrls.length} URLs from ${files.length} files...\n`);

  const results = [];
  const concurrency = 10;
  
  for (let i = 0; i < allUrls.length; i += concurrency) {
    const batch = allUrls.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(u => checkUrl(u.url, u.name)));
    results.push(...batchResults.map((r, idx) => ({ ...batch[idx], ...r })));
    
    const done = Math.min(i + concurrency, allUrls.length);
    process.stdout.write(`\rProgress: ${done}/${allUrls.length}`);
  }
  console.log('\n');

  const passed = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);

  const botBlocked = failed.filter(r => [403, 405, 406].includes(r.status));
  const timeouts = failed.filter(r => r.error === 'timeout');
  const networkErrors = failed.filter(r => r.error && r.error !== 'timeout');
  const otherErrors = failed.filter(r => !r.error && ![403, 405, 406].includes(r.status));

  console.log(`\n✅ Passed: ${passed.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log(`   ├─ Bot-blocked (403/405/406): ${botBlocked.length}`);
  console.log(`   ├─ Timeouts: ${timeouts.length}`);
  console.log(`   ├─ Network errors: ${networkErrors.length}`);
  console.log(`   └─ Other: ${otherErrors.length}\n`);

  if (botBlocked.length > 0) {
    console.log('BOT-BLOCKED (likely working, block automated requests):');
    botBlocked.forEach(r => {
      console.log(`  ${r.name} (${r.id}) [${r.file}]`);
      console.log(`    ${r.url} — HTTP ${r.status}`);
    });
    console.log('');
  }

  if (timeouts.length > 0) {
    console.log('TIMEOUTS (slow/geo-blocked):');
    timeouts.forEach(r => {
      console.log(`  ${r.name} (${r.id}) [${r.file}]`);
      console.log(`    ${r.url}`);
    });
    console.log('');
  }

  if (networkErrors.length > 0) {
    console.log('NETWORK ERRORS (DNS/connection failed):');
    networkErrors.forEach(r => {
      console.log(`  ${r.name} (${r.id}) [${r.file}]`);
      console.log(`    ${r.url} — ${r.error}`);
    });
    console.log('');
  }

  if (otherErrors.length > 0) {
    console.log('OTHER ERRORS:');
    otherErrors.forEach(r => {
      console.log(`  ${r.name} (${r.id}) [${r.file}]`);
      console.log(`    ${r.url} — HTTP ${r.status}`);
    });
    console.log('');
  }

  if (process.argv.includes('--verbose')) {
    console.log('ALL RESULTS:');
    results.forEach(r => {
      const icon = r.ok ? '✅' : '❌';
      console.log(`  ${icon} ${r.name}: ${r.status}`);
    });
  }
}

main().catch(console.error);