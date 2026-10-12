import { test, expect } from '@playwright/test';
async function enterBirth(page: import('@playwright/test').Page) {
  await page.getByLabel('出生日期', { exact: true }).fill('2000-01-01');
  await page.getByLabel('出生時間（24 小時制）', { exact: true }).fill('12:00');
}
test('independent empty entry and local-only bazi calculation preserve existing cards', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/paipan');
  await expect(page.getByLabel('出生日期', { exact: true })).toHaveValue('');
  await enterBirth(page);
  await page.getByRole('button', { name: '開始排盤', exact: true }).click();
  await expect(page.getByRole('heading', { name: '你的命盤結果已生成' })).toBeVisible();
  await expect(page.getByText('國曆 2000-01-01 ／農曆', { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: '城市與國家探索' })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
  expect(new URL(page.url()).search).toBe('');
  expect(errors).toEqual([]);
});
test('cross-entry birth data is imported only through explicit buttons', async ({ page }) => {
  await page.goto('/paipan');
  await enterBirth(page);
  await page.getByRole('button', { name: '帶入資料至紫微', exact: true }).click();
  await expect(page).toHaveURL(/\/ziwei$/);
  await expect(page.getByLabel('出生日期', { exact: true })).toHaveValue('');
  await page.getByRole('button', { name: '帶入另一入口資料', exact: true }).click();
  await expect(page.getByLabel('出生日期', { exact: true })).toHaveValue('2000-01-01');
  await expect(page.getByLabel('日柱／農曆換日約定')).toHaveValue('23:00');
  await page.getByLabel('傳統大限順逆規則').selectOption('male');
  await page.getByRole('button', { name: '開始排盤', exact: true }).click();
  await expect(page.locator('.ziwei-palace')).toHaveCount(12);
  await page.locator('.palace-title').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.locator('.star-button').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: '關閉', exact: true }).click();
  await page.locator('.mutation-button').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: '關閉', exact: true }).click();
});
test('spring gap is rejected; autumn overlap has an explicit time selector', async ({ page }) => {
  await page.goto('/paipan');
  await page.getByLabel('出生城市').selectOption('new-york');
  await page.getByLabel('出生日期', { exact: true }).fill('2024-03-10');
  await page.getByLabel('出生時間（24 小時制）', { exact: true }).fill('02:30');
  await page.getByRole('button', { name: '開始排盤', exact: true }).click();
  await expect(page.locator('.birth-panel [role=alert]')).toContainText('不存在');
  await expect(page.getByRole('heading', { name: '你的命盤結果已生成' })).not.toBeVisible();
  await page.getByLabel('出生日期', { exact: true }).fill('2024-11-03');
  await page.getByLabel('出生時間（24 小時制）', { exact: true }).fill('01:30');
  await page.getByLabel('重複時間選擇').selectOption('later');
  await page.getByRole('button', { name: '開始排盤', exact: true }).click();
  await expect(page.locator('.chart-output').getByText(/^歷史時區 /)).toContainText(
    '2024-11-03T06:30:00Z'
  );
});
test('mobile chart and modal fit viewport without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/ziwei');
  await enterBirth(page);
  await page.getByLabel('傳統大限順逆規則').selectOption('female');
  await page.getByRole('button', { name: '開始排盤', exact: true }).click();
  await expect(page.locator('.ziwei-palace')).toHaveCount(12);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
  await page.locator('.palace-title').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(
    await page
      .getByRole('dialog')
      .evaluate((el) => el.getBoundingClientRect().width <= window.innerWidth)
  ).toBe(true);
});
test('legacy result route handles missing and invalid data without 500', async ({ page }) => {
  await page.goto('/result');
  await expect(page.getByRole('heading', { name: '請先輸入出生資料' })).toBeVisible();
  const response = await page.goto('/result?birthDate=2024-02-30&birthTime=12:00');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: '無法排盤' })).toBeVisible();
});
