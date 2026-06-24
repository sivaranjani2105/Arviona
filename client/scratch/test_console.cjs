const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE ${msg.type().toUpperCase()}]:`, msg.text());
  });

  page.on('pageerror', err => {
    console.error('[BROWSER ERROR]:', err.stack);
  });

  try {
    console.log('Navigating to http://localhost:5173/ first to set domain storage...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

    console.log('Setting localStorage arivo_user credentials for teacher...');
    await page.evaluate(() => {
      localStorage.setItem('arivo_user', JSON.stringify({ role: 'teacher', email: 'teacher@arivo.com' }));
    });

    console.log('Navigating directly to http://localhost:5173/teacher/dashboard ...');
    await page.goto('http://localhost:5173/teacher/dashboard', { waitUntil: 'networkidle2' });
    console.log('Navigation completed.');

    // Wait a bit for React to mount and render
    await new Promise(r => setTimeout(r, 2000));
    
    const finalUrl = page.url();
    console.log('Final URL is:', finalUrl);

    const title = await page.title();
    console.log('Page Title is:', title);

    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Body Text length:', bodyText.length);
    console.log('Body Text Snippet:', bodyText.substring(0, 500));

  } catch (error) {
    console.error('Testing script failed:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
