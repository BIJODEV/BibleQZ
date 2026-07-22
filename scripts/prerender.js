const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const PORT = 45123;
const BUILD_DIR = path.join(__dirname, '..', 'build');

const ROUTES = [
  { path: '/', outputFile: 'index.html' },
  { path: '/games', outputFile: path.join('games', 'index.html') },
  { path: '/contact', outputFile: path.join('contact', 'index.html') },
];

function startServer() {
  return new Promise((resolve, reject) => {
    const serveBin = path.join(__dirname, '..', 'node_modules', '.bin', 'serve');
    const server = spawn(serveBin, ['-s', BUILD_DIR, '-l', String(PORT)], {
      stdio: 'pipe',
    });

    let resolved = false;
    const onData = (data) => {
      if (!resolved && data.toString().includes('Accepting connections')) {
        resolved = true;
        server.stdout.off('data', onData);
        resolve(server);
      }
    };

    server.stdout.on('data', onData);
    server.on('error', reject);

    // Fallback in case the banner text differs across `serve` versions.
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(server);
      }
    }, 3000);
  });
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage();
  const url = `http://localhost:${PORT}${route.path}`;

  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.waitForSelector('h1', { timeout: 10000 });

  const html = await page.evaluate(() => document.documentElement.outerHTML);
  const outputPath = path.join(BUILD_DIR, route.outputFile);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `<!DOCTYPE html>\n${html}`);

  await page.close();
  console.log(`Prerendered ${route.path} -> ${route.outputFile}`);
}

async function main() {
  const server = await startServer();
  const browser = await puppeteer.launch();

  try {
    for (const route of ROUTES) {
      await prerenderRoute(browser, route);
    }
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((error) => {
  console.error('Prerender failed:', error);
  process.exit(1);
});
