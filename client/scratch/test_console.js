/* eslint-disable no-undef */
const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE ${msg.type().toUpperCase()}]:`, msg.text());
  });

  // Capture page errors
  page.on('pageerror', err => {
    console.error('[BROWSER ERROR]:', err.stack);
  });

  try {
    console.log('Navigating to http://localhost:5173/ ...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    console.log('Page loaded.');

    console.log('Waiting for Role Tabs...');
    // Click the "Teacher" tab button
    // The role tabs buttons contain Student, Teacher, Parent.
    // Let's find the button with "Teacher" text and click it.
    const buttons = await page.$$('button');
    let teacherButton = null;
    for (const button of buttons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text.includes('Teacher')) {
        teacherButton = button;
        break;
      }
    }

    if (teacherButton) {
      console.log('Clicking Teacher tab...');
      await teacherButton.click();
      await page.waitForDelay ? page.waitForDelay(500) : new Promise(r => setTimeout(r, 500));
    } else {
      console.log('Could not find Teacher tab button.');
    }

    console.log('Waiting for Demo Credentials "teacher" button...');
    const demoButtons = await page.$$('button');
    let teacherDemoButton = null;
    for (const button of demoButtons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text.toLowerCase().trim() === 'teacher') {
        teacherDemoButton = button;
        break;
      }
    }

    if (teacherDemoButton) {
      console.log('Clicking teacher demo credentials...');
      await teacherDemoButton.click();
      await page.waitForDelay ? page.waitForDelay(500) : new Promise(r => setTimeout(r, 500));
    } else {
      console.log('Could not find teacher demo credentials button.');
    }

    console.log('Clicking Sign In...');
    // Click the Sign In button
    let signInButton = null;
    const allButtons = await page.$$('button');
    for (const button of allButtons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text.includes('Sign In')) {
        signInButton = button;
        break;
      }
    }

    if (signInButton) {
      await signInButton.click();
      console.log('Sign In clicked. Waiting for navigation/redirection...');
      await new Promise(r => setTimeout(r, 3000));
      console.log('Final URL is:', page.url());
    } else {
      console.log('Could not find Sign In button.');
    }

  } catch (error) {
    console.error('Testing script failed:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
