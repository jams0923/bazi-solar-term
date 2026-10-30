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
  await expect(page.getByRole('heading', { name: '可以先探索的職業方向' })).toBeVisible();
  await expect(page.locator('.career-direction')).toHaveCount(3);
  await expect(page.locator('.career-direction').first().getByText('這張命盤的依據')).toBeVisible();
  await expect(page.getByText('國曆 2000-01-01 ／農曆', { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: '城市符合度' })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
  expect(new URL(page.url()).search).toBe('');
  expect(errors).toEqual([]);
});
test('birth details follow navigation from bazi to ziwei and are cleared on returning home', async ({ page }) => {
  await page.goto('/paipan');
  await enterBirth(page);
  await page.getByRole('combobox', { name: '性別', exact: true }).selectOption('male');
  await page.getByLabel('出生城市').selectOption('new-york');
  await page.getByRole('link', { name: '切換至紫微斗數' }).click();
  await expect(page).toHaveURL(/\/ziwei$/);
  await expect(page.getByLabel('出生日期', { exact: true })).toHaveValue('2000-01-01');
  await expect(page.getByLabel('出生時間（24 小時制）')).toHaveValue('12:00');
  await expect(page.getByLabel('出生城市')).toHaveValue('new-york');
  await expect(page.getByLabel('日柱／農曆換日約定')).toHaveValue('23:00');
  await expect(page.getByLabel('傳統大限順逆規則')).toHaveValue('male');
  await page.reload();
  await expect(page.getByLabel('出生日期', { exact: true })).toHaveValue('2000-01-01');
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
  await page.getByRole('link', { name: '首頁', exact: true }).click();
  await page.getByRole('link', { name: '紫微斗數', exact: true }).first().click();
  await expect(page.getByLabel('出生日期', { exact: true })).toHaveValue('');
});
test('ziwei to bazi shares unfinished data and preserves each entry’s own settings', async ({ page }) => {
  await page.goto('/ziwei');
  await page.getByLabel('姓名／暱稱（選填）').fill('測試');
  await page.getByLabel('出生日期', { exact: true }).fill('1997-11-02');
  await page.getByRole('combobox', { name: '性別', exact: true }).selectOption('female');
  await page.getByLabel('日柱／農曆換日約定').selectOption('00:00');
  await page.getByRole('link', { name: '八字排盤', exact: true }).click();
  await expect(page.getByLabel('出生日期', { exact: true })).toHaveValue('1997-11-02');
  await expect(page.getByLabel('出生時間（24 小時制）')).toHaveValue('');
  await expect(page.getByLabel('姓名／暱稱（選填）')).toHaveValue('測試');
  await page.getByLabel('日柱／農曆換日約定').selectOption('23:00');
  await page.getByRole('link', { name: '切換至紫微斗數' }).click();
  await expect(page.getByLabel('日柱／農曆換日約定')).toHaveValue('00:00');
  await expect(page.getByLabel('傳統大限順逆規則')).toHaveValue('female');
  await page.getByRole('link', { name: '切換至八字排盤' }).click();
  await expect(page.getByLabel('日柱／農曆換日約定')).toHaveValue('23:00');
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
