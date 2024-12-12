import { test, expect, chromium } from '@playwright/test';
const fs = require('fs');
const path = require('path');

test('Project - Geckoterminal Charts', async () => {

    // Define the folder where the screenshots will be saved
    const downloadFolder = 'C:\\Users\\johnm\\Geckoterminal-Project\\Screenshots';

    // Ensure the folder exists, create it if not
    if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder, { recursive: true });
        console.log('Screenshots folder created!');
    } else {
    }

    // Launch browser in headless mode
    const browser = await chromium.launch({ headless: true }); // Set headless mode explicitly
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    });
    const page = await context.newPage();

    // Example: Disable WebRTC leaks
    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'mediaDevices', {
            value: {
                getUserMedia: () => Promise.reject(new Error('NotAllowedError: Permission denied')),
            },
        });
    });

    // Set up the download listener to save the file to the 'Screenshots' folder
    page.on('download', (download) => {
        const downloadPath = path.join(downloadFolder, download.suggestedFilename());
        download.saveAs(downloadPath).then(() => {
            console.log(`File downloaded and saved to: ${downloadPath}`);
        }).catch((err) => {
            console.error('Download failed:', err);
        });
    });
  
    // Set viewport to full screen (1920x1080 as a common standard for maximized windows)
    await page.setViewportSize({ width: 1920, height: 1080 });
  
    await page.goto('https://www.geckoterminal.com/', {
      timeout: 180000, // 3 Minutes
      waitUntil: 'domcontentloaded' // Ensure basic DOM content is loaded
    });

    // await page.pause();

    // Wait for the search button to be visible
    await page.waitForSelector('//button[contains(@class, "aa-DetachedSearchButton") and .//div[contains(text(), "Search network, dex or tokens")]]', { state: 'visible' });

    // Click the search button
    await page.locator('//button[contains(@class, "aa-DetachedSearchButton") and .//div[contains(text(), "Search network, dex or tokens")]]').click();

    // Wait for the search input field to appear (adjust selector to the actual input field)
    await page.waitForSelector('input[type="search"]', { state: 'visible' });

    // Wait for the wrapper div to be visible
    await page.waitForSelector('.aa-InputWrapper', { state: 'visible' });

    // Find the input element inside the wrapper and fill it
    await page.locator('.aa-InputWrapper input').fill('0x72928d5436ff65e57f72d5566dcd3baedc649a88');

    // Wait for the first list item to become visible
    await page.waitForSelector('#autocomplete-0-item-0', { state: 'visible' });

    // Click the first row (list item)
    await page.click('#autocomplete-0-item-0');

    // Wait for the iframe to load and get the frame
    const iframeElement = await page.waitForSelector('iframe');
    const frame = await iframeElement.contentFrame();

    // Final delay to view the page after all clicks
    await page.waitForTimeout(2000);

    // Click on the third occurrence (index 2)
    await frame.locator('button[aria-label="Take a snapshot"]').nth(2).click();

    // Click the "save chart image" element to trigger the download
    await frame.locator('div[data-name="save-chart-image"]').click(); 

    // Wait for the download to complete
    await page.waitForEvent('download'); // This will wait until the download event is fired
    
    console.log('Download completed and saved in:', downloadFolder);

    // Final delay to view the page after all clicks
    await page.waitForTimeout(2000);

});