import { test, expect, Page, BrowserContext, Browser, chromium } from '@playwright/test';

let browser: Browser;
let context: BrowserContext;
let page: Page;

// Login
test.beforeAll(async () => {
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();

  const email = 'maksim.parkhomenko96@gmail.com';
  const password = '4SDgN2e=uyp+CL#';

  await page.goto('https://trello.com/', { waitUntil: 'load' });

  await page.getByTestId('bignav').getByRole('link', { name: 'Log in' }).click();

  await page.waitForSelector('#username');
  await page.fill('#username', email);
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.waitForSelector('#password');
  await page.fill('#password', password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.locator('#content')).toContainText('VaultN');
  await expect(page).toHaveURL(/.*boards/);
});

test.afterAll(async () => {
  await browser.close();
});

test('Create new board', async () => {
  await page.waitForSelector('[data-testid="create-board-tile"]');
  await page.click('[data-testid="create-board-tile"]');

  await page.waitForSelector('[data-testid="create-board-title-input"]');
  await page.fill('[data-testid="create-board-title-input"]', 'VaultN');

  await page.click('[data-testid="create-board-submit-button"]');

  await expect(page.getByTestId('board-name-display')).toContainText('VaultN');
  await expect(page).toHaveURL(/.*vaultn/);
});

test('Add lists to the board', async () => {
  const lists = ['Backlog', 'Testing']; // We are creating only these two lists because Trello board has Todo, Doing and Done lists by default

  await page.waitForSelector('[data-testid="list-composer-button"]');
  await page.click('[data-testid="list-composer-button"]');

  for await (const list of lists) {
    await page.waitForSelector('textarea[placeholder="Enter list name…"]');
    await page.fill('textarea[placeholder="Enter list name…"]', list);

    await page.click('[data-testid="list-composer-add-list-button"]');

    await expect(page.locator('[data-testid="list-name"]').filter({ hasText: list })).toBeVisible();
  };
});

test('Add cards to lists', async () => {
  const cardsOptions = [
    { name: 'Sign up for Trello', list: 'To Do' },
    { name: 'Get key and token', list: 'To Do' },
    { name: 'Build a collection', list: 'To Do' },
    { name: 'Working on Task', list: 'To Do' },
    { name: 'UI Automation', list: 'Backlog' },
    { name: 'Writing Test Scenarios', list: 'Backlog' },
  ];

  for await (const cardOption of cardsOptions) {
    const element = page.locator('li').filter({ hasText: cardOption.list }).getByTestId('list-add-card-button');

    await element.isVisible() && await element.click();

    await page.waitForSelector('[data-testid="list-card-composer-textarea"]');
    await page.fill('[data-testid="list-card-composer-textarea"]', cardOption.name);
    await page.click('[data-testid="list-card-composer-add-card-button"]');

    await expect(page.locator('[data-testid="card-name"]').filter({ hasText: cardOption.name })).toBeVisible();
  };
});

test('Move cards between lists', async () => {
  const cardsOptions = [
    { name: 'Sign up for Trello', moveTo: 'Done' },
    { name: 'Get key and token', moveTo: 'Testing' },
    { name: 'Build a collection', moveTo: 'Doing' },
    { name: 'Working on Task', moveTo: 'Doing' },
  ];

  for await (const cardOption of cardsOptions) {
    await page.getByRole('link', { name: cardOption.name }).click();

    await page.waitForSelector('[data-testid="card-back-move-card-button"]');
    await page.click('[data-testid="card-back-move-card-button"]');

    await page.waitForSelector('[data-testid="move-card-popover-select-list-destination"]');
    await page.click('[data-testid="move-card-popover-select-list-destination"]');

    await page.getByRole('option', { name: cardOption.moveTo }).getByRole('listitem').click();
    await page.click('[data-testid="move-card-popover-move-button"]');

    await page.click('[data-testid="CloseIcon"]');

    await expect(page.locator('li').filter({ hasText: cardOption.moveTo })).toContainText(cardOption.name);
  }
});

test('Close board', async () => {
  await page.getByTestId('board-view').getByLabel('Menu').click();
  
  await page.getByRole('button', { name: 'Close board' }).click();

  await page.waitForSelector('[data-testid="popover-close-board-confirm"]');
  await page.click('[data-testid="popover-close-board-confirm"]')

  await expect(page.getByText('This board is closed. Reopen the board to make changes.')).toBeVisible();
});

test('Delete board', async () => {
  await page.waitForSelector('[data-testid="close-board-delete-board-button"]');
  await page.click('[data-testid="close-board-delete-board-button"]');

  await page.waitForSelector('[data-testid="close-board-delete-board-confirm-button"]');
  await page.click('[data-testid="close-board-delete-board-confirm-button"]');

  await expect(page).toHaveURL(/.*boards/);

  await page.click('[data-testid="home-team-boards-tab"]');
  await expect(page.getByRole('paragraph')).toContainText('Boards are where work gets done in Trello. On a board, you can move cards between lists to keep projects, tasks, and more on track.');
  await expect(page.getByRole('button', { name: 'Create your first board' })).toBeVisible();
});