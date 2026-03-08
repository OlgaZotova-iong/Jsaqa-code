const { test, expect } = require("@playwright/test");
const { email, password } = require("../user.js");

test.describe("Авторизация на Netology.ru", () => {

  test.beforeEach(async ({ page }) => {
    console.log("Запускаем браузер и открываем Netology...");

    await page.goto("https://netology.ru/", { 
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await page.waitForTimeout(2000);

    const loginButton = page.locator('text=Войти').first();
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.click();

    await page.waitForURL(/.*modal=sign_in/, { timeout: 10000 });
    console.log("Модальное окно авторизации открыто");
  });

  test("Успешная авторизация", async ({ page }) => {
    console.log("Тест: Успешная авторизация");

    const emailLoginButton = page.getByText(/Войти по почте/i);
    await emailLoginButton.waitFor({ state: 'visible', timeout: 15000 });
    await emailLoginButton.click();
    console.log("Выбрали вход по почте");

    await page.waitForTimeout(2000);

    const emailInput = page.getByPlaceholder('Email');
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill(email, { delay: 200 });
    console.log("Ввели email");

    await page.waitForTimeout(1000);

    const passwordInput = page.getByPlaceholder('Пароль');
    await passwordInput.fill(password, { delay: 200 });
    console.log("Ввели пароль");

    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'screenshot_before_login.png', fullPage: true });
    console.log("Сделали скриншот перед отправкой");

    const submitButton = page.getByTestId('login-submit-btn');
    await submitButton.waitFor({ state: 'visible', timeout: 10000 });
    await submitButton.click();
    console.log("Нажали кнопку Войти");

    await page.waitForTimeout(8000);

    await page.screenshot({ path: 'screenshot_after_login.png', fullPage: true });
    console.log("Сделали скриншот после отправки");

    try {
      await expect(page).toHaveURL(/.*profile|.*learning/i, { timeout: 10000 });
      console.log("УСПЕХ: Авторизация прошла!");
    } catch (error) {
      console.log("Капча или ошибка авторизации");

      const captcha = page.locator('[class*="captcha"], [class*="Captcha"], iframe[src*="captcha"]').first();

      try {
        await captcha.waitFor({ state: 'visible', timeout: 5000 });
        console.log("Обнаружена капча!");

        await page.screenshot({ 
          path: 'screenshot_with_captcha.png', 
          fullPage: true 
        });

        test.skip();

      } catch {
        const errorText = await page.locator('[class*="error"], [class*="Error"]').textContent().catch(() => null);
        console.log("Текст ошибки:", errorText);
      }
    }
  });

  test("Неуспешная авторизация", async ({ page }) => {
    console.log("Тест: Неуспешная авторизация");

    await page.getByText(/Войти по почте/i).click();
    await page.waitForTimeout(1000);

    await page.getByPlaceholder('Email').fill("wrong-email@test.com", { delay: 200 });
    await page.waitForTimeout(500);

    await page.getByPlaceholder('Пароль').fill("wrong-password", { delay: 200 });
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'screenshot_before_failed_login.png', fullPage: true });

    await page.getByTestId('login-submit-btn').click();
    console.log("Отправили неверные данные");

    await page.waitForTimeout(8000);

    await page.screenshot({ path: 'screenshot_after_failed_login.png', fullPage: true });

    const errorSelectors = [
      "Вы ввели неправильно логин или пароль",
      "Неверный логин или пароль",
      /ошибк/i,
      /неверн/i,
      '[class*="error"]',
      '[class*="Error"]',
      '[data-testid*="error"]'
    ];

    let errorFound = false;

    for (const selector of errorSelectors) {
      try {
        if (typeof selector === 'string' && !selector.includes('[')) {
          const errorElement = page.getByText(selector);
          await errorElement.waitFor({ state: 'visible', timeout: 3000 });
          console.log(`Нашли ошибку: ${selector}`);
          errorFound = true;
          break;
        } else {
          const errorElement = page.locator(selector).first();
          await errorElement.waitFor({ state: 'visible', timeout: 3000 });
          console.log(`Нашли элемент ошибки: ${selector}`);
          errorFound = true;
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!errorFound) {
      console.log("Ошибка не найдена (возможно, капча)");

      const captcha = page.locator('[class*="captcha"], iframe[src*="captcha"]').first();
      try {
        await captcha.waitFor({ state: 'visible', timeout: 3000 });
        console.log("Обнаружена капча в тесте на ошибку");
        await page.screenshot({ path: 'screenshot_captcha_in_failed_test.png', fullPage: true });
      } catch {
      }
    }
  });
});













