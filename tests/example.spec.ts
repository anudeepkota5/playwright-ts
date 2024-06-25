import { test, expect } from '@playwright/test';
import { before, beforeEach } from 'node:test';

test.beforeEach(async({ page })=> {
  await page.goto('https://the-internet.herokuapp.com/');
})

test('checkbox', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/The Internet/);
  await page.getByRole('link', {name:'Checkboxes'}).click();
  await page.locator("input[type=checkbox]:nth-child(1)").check();
  expect(page.locator("input[type=checkbox]:nth-child(1)").isChecked).toBeTruthy();

});

test('Dropdown', async ({page}) => {
  await page.getByRole('link', {name:'Dropdown'}).click();
  await page.locator('#dropdown').selectOption({label:'Option 1'});
  await page.waitForTimeout(5000);
  // expect(page.locator("select[id='dropdown'] > option[selected='selected']")).toBe('Option 1');
  await page.locator('#dropdown').selectOption('Option 2');
  await page.locator('#dropdown').selectOption('1');
})

test('Element Visibility', async({page}) => {
  await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');
  expect(page.getByRole('button', {name:'Delete'})).toBeVisible({visible:false});
  await page.getByRole('button', {name:'Add Element'}).click();
  expect(page.getByRole('button', {name:'Delete'})).toBeVisible({visible:true});
  await page.getByRole('button', {name:'Delete'}).click();
  expect(page.getByRole('button', { name: 'Delete' })).toBeVisible({visible:false});
})

test('JS Alert', async({page}) => {
  await page.getByRole('link', {name:'JavaScript Alerts'}).click();
  await page.getByRole('button', {name:'Click for JS Alert'}).click();
  page.on('dialog', async (dialog) => {
    console.log(dialog.message()); // Log the alert message
    await dialog.accept(); // Accept the alert
  });
  // expect(page.locator('#result').filter({ hasText: 'You successfully clicked an alert' })).toBeVisible(); 
})

test('JS Confirm', async({page}) => {
  await page.getByRole('link', {name:'JavaScript Alerts'}).click();
  await page.getByRole('button', {name:'Click for JS Confirm'}).click();
  page.on('dialog', async (dialog) => {
    console.log(dialog.message()); // Log the alert message
    await dialog.accept(); // Accept the alert
  });
  await page.goBack();
  await page.getByRole('link', {name:'JavaScript Alerts'}).click();
  await page.getByRole('button', {name:'Click for JS Confirm'}).click();
  page.on('dialog', async (dialog) => {
    console.log(dialog.message()); // Log the alert message
    await dialog.dismiss(); // Dismiss the alert
  });
})

test('JS Prompt', async({page}) => {
  await page.getByRole('link', {name:'JavaScript Alerts'}).click();
  await page.getByRole('button', {name:'Click for JS Prompt'}).click();
  // await page.waitForTimeout(5000);
  page.on('dialog', async (dialog) => {
    console.log(dialog.message()); // Log the alert message
    await dialog.accept(); // Accept the alert
  });
})

test('Login', async({page}) => {
  await page.getByRole('link', {name:'Form Authentication'}).click();
  await page.fill('#username', 'tomsmith');
  await page.fill('#password', 'SuperSecretPassword!');
  await page.click('.radius');
  // await page.waitForTimeout(5000);
  // expect(page.locator('.subheader').getByText('Welcome to the Secure Area. When you are done click logout below.')).toBeVisible();
})

test('Hovers', async({page}) => {
  await page.getByRole('link', {name:'Hovers'}).click();
  await page.locator("img[alt='User Avatar']").first().hover();
  await page.locator("img[alt='User Avatar']").nth(1).hover();
  await page.locator("img[alt='User Avatar']").nth(2).hover();
})

test('Multiple Windows', async({browser}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://the-internet.herokuapp.com/');
  await page.getByRole('link', {name:'Multiple Windows'}).click();
  await page.getByRole('link', {name:'Click Here'}).click();
  const [newPage] = await Promise.all([
    context.waitForEvent('page'), // Waits for the next page event
    // Perform the action that opens a new window/tab
    page.click('a[target="_blank"]') // Example selector that opens a new window/tab
  ]);
  await newPage.bringToFront();
  const newPageTitle = await newPage.title();
  expect(newPageTitle).toBe('New Window');
})

test('identify broken images', async({page}) => {
  await page.getByRole('link', {name:'Broken Images'}).click(); 
  // Find all image elements
  const images = await page.$$('img');
  for (const image of images) {
    const src = await image.getAttribute('href'); // Can also use getAttribute('src')
    if (!src) {
      console.warn('Image element without src attribute found');
      return;
    }
    const response = await page.goto(src, { timeout: 60000 }); // Set a timeout for image loading
    if (!response?.ok()) {
      console.error(`Broken image: ${src} - Status code: ${response?.status()}`);
    }
  }
})
