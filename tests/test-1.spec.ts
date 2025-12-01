import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://192.168.2.157/register');
  await page.getByRole('textbox', { name: '氏名' }).click();
  await page.getByRole('textbox', { name: '氏名' }).fill('test user');
  await page.getByRole('textbox', { name: 'メールアドレス' }).click();
  await page.getByRole('textbox', { name: 'メールアドレス' }).fill('test01@example.com');
  await page.getByRole('textbox', { name: 'メールアドレス' }).press('Tab');
  await page.getByRole('textbox', { name: 'パスワード', exact: true }).click();
  await page.getByRole('textbox', { name: 'パスワード', exact: true }).fill('password1234');
  await page.getByRole('textbox', { name: 'パスワード', exact: true }).press('Tab');
  await page.getByRole('textbox', { name: 'パスワード(確認)' }).fill('password1234');
  await page.getByRole('button', { name: '登録' }).click();
});