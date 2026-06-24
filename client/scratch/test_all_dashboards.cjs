const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const testRole = async (role, email, path) => {
    console.log(`\n=================== Testing ${role.toUpperCase()} Dashboard ===================`);
    const page = await browser.newPage();
    
    let hasError = false;
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`[${role} CONSOLE ERROR]:`, msg.text());
      }
    });

    page.on('pageerror', err => {
      hasError = true;
      console.error(`[${role} BROWSER ERROR]:`, err.stack);
    });

    try {
      await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
      await page.evaluate((r, em) => {
        localStorage.setItem('arivo_user', JSON.stringify({ role: r, email: em }));
      }, role, email);

      const targetUrl = `http://localhost:5173${path}`;
      console.log(`Navigating to ${targetUrl} ...`);
      await page.goto(targetUrl, { waitUntil: 'networkidle2' });
      
      await new Promise(r => setTimeout(r, 1500));
      
      console.log(`Final URL: ${page.url()}`);
      const bodyText = await page.evaluate(() => document.body.innerText);
      console.log(`Body length: ${bodyText.length}`);
      console.log(`Content Snippet:\n${bodyText.substring(0, 150)}...`);
      
      if (hasError || bodyText.length === 0) {
        console.log(`❌ ${role.toUpperCase()} DASHBOARD FAILED TO LOAD SUCCESSFULLY!`);
      } else {
        console.log(`✅ ${role.toUpperCase()} DASHBOARD LOADED SUCCESSFULLY!`);
      }
    } catch (e) {
      console.error(`Error testing ${role}:`, e);
    } finally {
      await page.close();
    }
  };

  try {
    await testRole('teacher', 'teacher@arivo.com', '/teacher/dashboard');
    await testRole('student', 'student@arivo.com', '/student/dashboard');
    await testRole('parent', 'parent@arivo.com', '/parent/dashboard');
  } catch (error) {
    console.error('All test run failed:', error);
  } finally {
    await browser.close();
    console.log('\nBrowser closed.');
  }
})();
