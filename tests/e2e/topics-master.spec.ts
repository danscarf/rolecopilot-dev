import { test, expect } from '@playwright/test';

test.describe('Table Topics Master', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/topics-master');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('full session flow — setup theme, add topics, log speakers, expand script', async ({ page }) => {
    await page.goto('/topics-master');

    // Page title is visible
    await expect(page.getByRole('heading', { name: 'Table Topics Master' })).toBeVisible();

    // --- Setup: set meeting theme ---
    const themeInput = page.getByPlaceholder('e.g. The Power of Habit');
    await themeInput.fill('Overcoming Challenges');
    await expect(themeInput).toHaveValue('Overcoming Challenges');

    // Theme appears in the subtitle
    await expect(page.getByText('Overcoming Challenges').first()).toBeVisible();

    // --- Setup: add topics ---
    const topicInput = page.getByPlaceholder('Enter a topic prompt...');
    const addButton = page.getByRole('button', { name: 'Add' });

    await topicInput.fill('If you could change one thing about yourself, what would it be?');
    await addButton.click();

    await topicInput.fill('Describe a time you failed and what you learned.');
    await addButton.click();

    await topicInput.fill('What does success mean to you?');
    await addButton.click();

    // All 3 topics listed in the setup panel (scoped to list items, not <option> elements)
    const topicList = page.locator('ul.mt-3');
    await expect(topicList.getByText('If you could change one thing about yourself, what would it be?')).toBeVisible();
    await expect(topicList.getByText('Describe a time you failed and what you learned.')).toBeVisible();
    await expect(topicList.getByText('What does success mean to you?')).toBeVisible();

    // --- Log first speaker ---
    const speakerInput = page.getByPlaceholder('Speaker name');
    const topicSelect = page.locator('select');
    const logButton = page.getByRole('button', { name: 'Log Speaker' });

    await speakerInput.fill('Alice Johnson');
    await topicSelect.selectOption({ label: 'If you could change one thing about yourself, what would it be?' });
    await logButton.click();

    await expect(page.getByText('Alice Johnson')).toBeVisible();
    await expect(page.getByText('→').first()).toBeVisible();

    // --- Log second speaker ---
    await speakerInput.fill('Bob Martinez');
    await topicSelect.selectOption({ label: 'Describe a time you failed and what you learned.' });
    await logButton.click();

    await expect(page.getByText('Bob Martinez')).toBeVisible();

    // --- Log third speaker ---
    await speakerInput.fill('Carol Chen');
    await topicSelect.selectOption({ label: 'What does success mean to you?' });
    await logButton.click();

    await expect(page.getByText('Carol Chen')).toBeVisible();

    // Log shows 3 entries in order
    const logEntries = page.locator('div.space-y-2 > div');
    await expect(logEntries).toHaveCount(3);

    // --- Remove second entry ---
    const removeButtons = page.locator('button[aria-label="Remove entry"]');
    await removeButtons.nth(1).click();
    await expect(logEntries).toHaveCount(2);
    await expect(page.getByText('Bob Martinez')).not.toBeVisible();

    // --- Expand the script ---
    const scriptToggle = page.getByRole('button', { name: /Topicsmaster Script/i });
    await scriptToggle.click();
    await expect(page.getByText(/Greetings Mr\.\/Madam Toastmaster/)).toBeVisible();
    await expect(page.getByText(/Table Topics®/)).toBeVisible();

    // --- Collapse script ---
    await scriptToggle.click();
    await expect(page.getByText(/Greetings Mr\.\/Madam Toastmaster/)).not.toBeVisible();
  });

  test('empty name is rejected', async ({ page }) => {
    await page.goto('/topics-master');

    // Add a topic first so the select isn't empty
    const topicInput = page.getByPlaceholder('Enter a topic prompt...');
    await topicInput.fill('Any topic');
    await page.getByRole('button', { name: 'Add' }).click();

    // Select the topic but leave name blank
    await page.locator('select').selectOption({ index: 1 });
    const logButton = page.getByRole('button', { name: 'Log Speaker' });
    await expect(logButton).toBeDisabled();
  });

  test('remove a topic from setup', async ({ page }) => {
    await page.goto('/topics-master');

    const topicInput = page.getByPlaceholder('Enter a topic prompt...');
    await topicInput.fill('Topic to delete');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.locator('ul.mt-3').getByText('Topic to delete')).toBeVisible();

    await page.locator('button[aria-label="Remove topic"]').click();
    await expect(page.locator('ul.mt-3').getByText('Topic to delete')).not.toBeVisible();
    await expect(page.getByText('No topics yet.')).toBeVisible();
  });
});
