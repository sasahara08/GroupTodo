import { test, expect } from '@playwright/test';

test.describe('Group Creation and Management', () => {
  // Use serial mode to ensure tests run in a predictable order,
  // as creating a group is a stateful action.
  test.describe.configure({ mode: 'serial' });

  // Before each test, perform login
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost/login');

    // Fill in the credentials
    await page.getByLabel('メールアドレス').fill('test@example.com');
    await page.getByLabel('パスワード').fill('password123');

    // Click the login button
    await page.getByRole('button', { name: 'ログイン' }).click();

    // Wait for the navigation to the dashboard to complete.
    // This ensures we are logged in before proceeding.
    await page.waitForURL('http://localhost/dashboard');
  });

  test('should allow a user to create a new group and navigate to it', async ({ page }) => {
    // 1. Open the "Create Group" modal from the sidebar
    await page.getByRole('link', { name: 'グループを作成' }).click();

    // 2. Verify the modal is open by checking its title
    await expect(page.getByRole('heading', { name: 'グループ新規作成' })).toBeVisible();

    // 3. Fill in a unique group name
    const groupName = `Test Group ${Date.now()}`;
    await page.getByPlaceholder('グループ名を入力').fill(groupName);

    // 4. Click the "Register" button to submit the form
    await page.getByRole('button', { name: '登録' }).click();

    // 5. Assert that the modal has closed
    await expect(page.getByRole('heading', { name: 'グループ新規作成' })).not.toBeVisible();

    // 6. Assert that the new group now appears in the sidebar under "Joined Groups"
    const newGroupLink = page.getByRole('link', { name: groupName });
    await expect(newGroupLink).toBeVisible();

    // 7. Click the new group's link and verify navigation
    await newGroupLink.click();

    // The URL should now match the pattern for a todo list page, e.g., /todo/123
    await expect(page).toHaveURL(/.*\/todo\/\d+/);

    // 8. Verify that the group's name is displayed as the main title on the page
    await expect(page.getByRole('heading', { name: groupName })).toBeVisible();
  });

  test('should display error for empty group name', async ({ page }) => {
    // Open the "Create Group" modal
    await page.getByRole('link', { name: 'グループを作成' }).click();
    await expect(page.getByRole('heading', { name: 'グループ新規作成' })).toBeVisible();

    // Leave the input field empty and click "登録"
    await page.getByRole('button', { name: '登録' }).click();

    // Assert that the error message is visible
    await expect(page.getByText('フォームの入力は必須です')).toBeVisible();

    // Assert that the modal remains open
    await expect(page.getByRole('heading', { name: 'グループ新規作成' })).toBeVisible();
  });

  test('should display error for group name less than 2 characters', async ({ page }) => {
    // Open the "Create Group" modal
    await page.getByRole('link', { name: 'グループを作成' }).click();
    await expect(page.getByRole('heading', { name: 'グループ新規作成' })).toBeVisible();

    // Fill with 1 character and click "登録"
    await page.getByPlaceholder('グループ名を入力').fill('a');
    await page.getByRole('button', { name: '登録' }).click();

    // Assert that the error message is visible
    await expect(page.getByText('お名前は、2文字以上にしてください。')).toBeVisible();

    // Assert that the modal remains open
    await expect(page.getByRole('heading', { name: 'グループ新規作成' })).toBeVisible();
  });

  test('should display error for group name more than 255 characters', async ({ page }) => {
    // Open the "Create Group" modal
    await page.getByRole('link', { name: 'グループを作成' }).click();
    await expect(page.getByRole('heading', { name: 'グループ新規作成' })).toBeVisible();

    // Fill with 256 characters and click "登録"
    const longName = 'a'.repeat(256);
    await page.getByPlaceholder('グループ名を入力').fill(longName);
    await page.getByRole('button', { name: '登録' }).click();

    // Assert that the error message is visible
    await expect(page.getByText('お名前は、255文字以下にしてください。')).toBeVisible();

    // Assert that the modal remains open
    await expect(page.getByRole('heading', { name: 'グループ新規作成' })).toBeVisible();
  });
});