import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  // Before each test, navigate to the login page
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost/login');
  });

  test('should display required error for email and password', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: 'ログイン' });
    await loginButton.click();

    await expect(page.getByText('メールアドレスは必須です')).toBeVisible();
    await expect(page.getByText('パスワードは必須です')).toBeVisible();
  });

  test('should display invalid email error', async ({ page }) => {
    const emailInput = page.getByLabel('メールアドレス');
    const passwordInput = page.getByLabel('パスワード');
    const loginButton = page.getByRole('button', { name: 'ログイン' });

    await emailInput.fill('invalid-email');
    await passwordInput.fill('password1234');
    await loginButton.click();

    await expect(page.getByText('メールアドレスが無効です')).toBeVisible();
  });

  test('should display min length error for password', async ({ page }) => {
    const emailInput = page.getByLabel('メールアドレス');
    const passwordInput = page.getByLabel('パスワード');
    const loginButton = page.getByRole('button', { name: 'ログイン' });

    await emailInput.fill('test@example.com');
    await passwordInput.fill('12345');
    await loginButton.click();

    await expect(page.getByText('パスワードは6文字以上必要です')).toBeVisible();
  });

  test('should display authentication failed error from backend', async ({ page }) => {
    const emailInput = page.getByLabel('メールアドレス');
    const passwordInput = page.getByLabel('パスワード');
    const loginButton = page.getByRole('button', { name: 'ログイン' });

    await emailInput.fill('test@example.com');
    await passwordInput.fill('wrongpassword');
    await loginButton.click();

    // This message comes from the backend (Laravel's auth.failed message)
    // and is set via form.setErrors in the frontend.
    await expect(page.getByText('認証情報が記録と一致しません。')).toBeVisible();
  });

  test('should login successfully with valid credentials and navigate to home', async ({ page }) => {
    const emailInput = page.getByLabel('メールアドレス');
    const passwordInput = page.getByLabel('パスワード');
    const loginButton = page.getByRole('button', { name: 'ログイン' });

    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');
    await loginButton.click();

    // After successful login, the user should be redirected.
    // We expect the URL to be the root of the site.
    // This may need to be adjusted depending on your application's redirect logic.
    await expect(page).toHaveURL('http://localhost/dashboard');
  });
});
