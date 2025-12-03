import { test, expect } from '@playwright/test';

test.describe('Register Page Flow', () => {
  test('should handle all validation errors and then successfully register and navigate to /login', async ({ page }) => {
    await page.goto('http://localhost/register');

    const nameInput = page.getByLabel('氏名');
    const emailInput = page.getByLabel('メールアドレス');
    const passwordInput = page.getByLabel('パスワード', { exact: true });
    const passwordConfirmationInput = page.getByLabel('パスワード(確認)');
    const registerButton = page.getByRole('button', { name: '登録' });

    // Helper function to fill all fields with valid data
    const fillAllValid = async () => {
      await nameInput.fill('テストユーザー');
      await emailInput.fill('test005@example.com');
      await passwordInput.fill('password123');
      await passwordConfirmationInput.fill('password123');
    };

    // --- Name Validation (Required) ---
    await fillAllValid(); // Fill all with valid data first
    await nameInput.fill(''); // Invalid: empty name
    await registerButton.click();
    await expect(page.getByText('お名前は必須です')).toBeVisible();
    await nameInput.fill('a'); // Prepare for next validation

    // --- Name Validation (Min Length) ---
    await fillAllValid(); // Re-fill to ensure other fields are valid
    await nameInput.fill('a'); // Invalid: name too short
    await registerButton.click();
    await expect(page.getByText('お名前は2文字以上必要です')).toBeVisible();
    await nameInput.fill('テストユーザー'); // Valid name

    // --- Email Validation (Required) ---
    await fillAllValid(); // Re-fill to ensure other fields are valid
    await emailInput.fill(''); // Invalid: empty email
    await registerButton.click();
    await expect(page.getByText('メールアドレスは必須です')).toBeVisible();
    await emailInput.fill('invalid-email'); // Prepare for next validation

    // --- Email Validation (Invalid Format) ---
    await fillAllValid(); // Re-fill to ensure other fields are valid
    await emailInput.fill('invalid-email'); // Invalid: email format
    await registerButton.click();
    await expect(page.getByText('メールアドレスが無効です')).toBeVisible();
    await emailInput.fill('test005@example.com'); // Valid email

    // --- Password Validation (Required) ---
    await fillAllValid(); // Re-fill to ensure other fields are valid
    await passwordInput.fill(''); // Invalid: empty password
    await registerButton.click();
    await expect(page.getByText('パスワードは必須です')).toBeVisible();
    await page.locator('button').first().click(); // Click toggle to show password
    await passwordInput.fill('12345'); // Prepare for next validation

    // --- Password Validation (Min Length) ---
    await fillAllValid(); // Re-fill to ensure other fields are valid
    await page.locator('button').first().click(); // Click toggle to show password
    await passwordInput.fill('12345'); // Invalid: password too short
    await registerButton.click();
    await expect(page.getByText('パスワードは6文字以上必要です')).toBeVisible();
    await page.locator('button').first().click(); // Click toggle to show password
    await passwordInput.fill('password123'); // Valid password

    // --- Password Confirmation Validation (Required) ---
    await fillAllValid(); // Re-fill to ensure other fields are valid
    await passwordConfirmationInput.fill(''); // Invalid: empty password confirmation
    await registerButton.click();
    await expect(page.getByText('パスワード確認は必須です')).toBeVisible();

    await page.locator('button').nth(1).click();
    await passwordConfirmationInput.fill('password456'); // Prepare for next validation

    // --- Password Confirmation Validation (Mismatch) ---
    await fillAllValid(); // Re-fill to ensure other fields are valid
    await page.locator('button').nth(1).click();
    await passwordConfirmationInput.fill('password456'); // Invalid: password mismatch
    await registerButton.click();
    await expect(page.getByText('パスワードが一致しません')).toBeVisible();
    await page.locator('button').nth(1).click();
    await passwordConfirmationInput.fill('password123'); // Invalid: password mismatch

    // --- Successful Registration ---
    // All fields should now be valid from previous steps
    await registerButton.click();

    // Expect successful navigation to the login page
    // await expect(page).toHaveURL(/login/);
    // await expect(page.getByText('Sign Up complete')).toBeVisible();
    await expect(page).toHaveURL('http://localhost/login');
  });
});
