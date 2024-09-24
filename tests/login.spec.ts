import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/main.page.ts';
import { LoginPage } from '../pages/login.page.ts';
import { ProfilePage } from '../pages/profile.page.ts';

test.describe("Authorization form", () => {
    let mainPage: MainPage;
    let loginPage: LoginPage;
    let profilePage: ProfilePage;

    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        loginPage = new LoginPage(page);
        profilePage = new ProfilePage(page);
        await mainPage.open();
    });

    test("Authorization with empty fields", async ({ page }) => {
        await loginPage.clickEnterButton();
        await loginPage.clickLoginButton();
        await page.waitForLoadState("networkidle");
        await expect(await loginPage.getAuthorizationForm()).toBeVisible();
        await expect(await loginPage.getEmailMessageError()).toBeVisible();
        await expect(await loginPage.getEmailMessageError()).toHaveText("Поле не може бути порожнім");
        await loginPage.emailInputIsHighlighted();
        await expect(await loginPage.getPasswordMessageError()).toBeVisible();
        await expect(await loginPage.getPasswordMessageError()).toHaveText("Поле не може бути порожнім");
        await loginPage.passwordInputIsHighlighted();

        await loginPage.fillEmailInput(process.env.USER_EMAIL);
        await loginPage.clickLoginButton();
        await page.waitForLoadState("networkidle");
        await expect(await loginPage.getAuthorizationForm()).toBeVisible();
        await loginPage.emailInputIsNotHighlighted();
        await expect(await loginPage.getPasswordMessageError()).toBeVisible();
        await expect(await loginPage.getPasswordMessageError()).toHaveText("Поле не може бути порожнім");
        await loginPage.passwordInputIsHighlighted();

        await loginPage.clearEmailInput();
        await expect(await loginPage.getEmailMessageError()).toBeVisible();
        await expect(await loginPage.getEmailMessageError()).toHaveText("Поле не може бути порожнім");
        await loginPage.emailInputIsHighlighted();

        await loginPage.fillPasswordInput(process.env.USER_PASSWORD);
        await loginPage.clickLoginButton();
        await page.waitForLoadState("networkidle");
        await expect(await loginPage.getAuthorizationForm()).toBeVisible();
        await loginPage.passwordInputIsNotHighlighted();
    });

    test("Authorization with valid email and password", async ({ page }) => {
        const users = [
            { email: process.env.USER_EMAIL, password: process.env.USER_PASSWORD },
            { email: process.env.TEST_USER_EMAIL, password: process.env.TEST_USER_PASSWORD }
        ];

        for (const [index, user] of users.entries()) {
            await loginPage.clickEnterButton();
            await loginPage.fillEmailInput(user.email);
            await expect(await loginPage.getEmailInput()).toHaveValue(user.email || "undefined");

            await loginPage.fillPasswordInput(user.password);
            await expect(await loginPage.getPasswordInput()).toHaveValue(user.password || "undefined");

            await loginPage.clickHiddenPasswordIcon();
            await expect(await loginPage.isPasswordVisible()).toBeTruthy();

            await loginPage.clickHiddenPasswordIcon();
            await expect(await loginPage.isPasswordHidden()).toBeTruthy();

            if (index % 2 == 0) {
                await loginPage.clickLoginButton();
            }
            else {
                await loginPage.pressEnter();
            }
            await loginPage.waitForAuthorizationFormIsHidden();

            await expect(await loginPage.getProfileIcon()).toBeVisible();
            await loginPage.clickProfileIcon();
            await expect(await loginPage.getProfileDropdownMenu()).toBeVisible();
            await expect(await loginPage.getProfileDropdownMenuEmail()).toBeVisible();
            await expect(await loginPage.getProfileDropdownMenuEmail()).toHaveText(user.email || "undefined");

            await loginPage.clickLogout();
            await expect(await loginPage.getEnterButton()).toBeVisible();
        }
    });

    test("Authorization with valid phone and password", async ({ page }) => {
        const phones = [
            process.env.USER_PHONE,
            process.env.USER_PHONE?.substring(1),
            process.env.USER_PHONE?.substring(3)
        ];

        for (const phone of phones) {
            await loginPage.clickEnterButton();
            await loginPage.fillEmailInput(phone);
            await expect(await loginPage.getEmailInput()).toHaveValue(phone || "undefined");
            await loginPage.emailInputIsNotHighlighted();

            await loginPage.fillPasswordInput(process.env.USER_PASSWORD);
            await expect(await loginPage.getPasswordInput()).toHaveValue(process.env.USER_PASSWORD || "undefined");
            await loginPage.passwordInputIsNotHighlighted();

            await loginPage.clickLoginButton();
            await loginPage.waitForAuthorizationFormIsHidden();
            await mainPage.isOpen();

            await expect(await loginPage.getProfileIcon()).toBeVisible();
            await loginPage.clickProfileIcon();
            await expect(await loginPage.getProfileDropdownMenu()).toBeVisible();

            await loginPage.clickMyProfile();
            await page.waitForURL("/owner-cabinet/", { waitUntil: "networkidle" });
            await expect(await profilePage.getPhoneNumberInput()).toBeVisible();
            await expect(await profilePage.getPhoneNumberValue()).toContain(phone || "undefined");
            await expect(await profilePage.getPhoneVerificationLabel()).toBeVisible();
            await expect(await profilePage.getPhoneVerificationLabel()).toHaveText("Успішно верифіковано");

            await profilePage.clickLogout();
            await mainPage.isOpen();
            await expect(await loginPage.getEnterButton()).toBeVisible();
        }
    });

    test("Authorization with invalid phone", async ({ page }) => {
        await loginPage.clickEnterButton();

        await loginPage.fillPasswordInput(process.env.USER_PASSWORD);
        await expect(await loginPage.getPasswordInput()).toHaveValue(process.env.USER_PASSWORD || "undefined");
        await loginPage.passwordInputIsNotHighlighted();

        const invalidPhones = [
            "991234785",
            "099123478",
            "+380-99-123-4785",
            "+380 99 123 4785",
            "+380(99)1234785",
            "(99)1234785",
            "09912347850",
            "+100991234785",
            "+0991234785"
        ];

        for (const invalidPhone of invalidPhones) {
            await loginPage.fillEmailInput(invalidPhone);
            await loginPage.clickLoginButton();
            await page.waitForLoadState("networkidle");
            await expect(await loginPage.getAuthorizationForm()).toBeVisible();
            await loginPage.emailInputIsHighlighted();
            await expect(await loginPage.getEmailMessageError()).toBeVisible();
            await expect(await loginPage.getEmailMessageError()).toHaveText("Неправильний формат email або номера телефону");
        }
    });

    test("Authorization with invalid email", async ({ page }) => {
        await loginPage.clickEnterButton();

        await loginPage.fillPasswordInput(process.env.TEST_USER_PASSWORD);
        await expect(await loginPage.getPasswordInput()).toHaveValue(process.env.TEST_USER_PASSWORD || "undefined");
        await loginPage.passwordInputIsNotHighlighted();

        const invalidEmails = [
            "testuser  rentzila@gmail.com",
            "еуіегіуккутеяшдф",
            "testuserrentzilagmail.com",
            "testuserrentzila@gmailcom",
            "testuserrentzila@gmail",
            "testuserrentzila@.com",
            "testuserrentzila",
            "testuserrentzila@@gmail.com"
        ];

        for (const invalidEmail of invalidEmails) {
            await loginPage.fillEmailInput(invalidEmail);
            await loginPage.clickLoginButton();
            await page.waitForLoadState("networkidle");
            await expect(await loginPage.getAuthorizationForm()).toBeVisible();
            await loginPage.emailInputIsHighlighted();
            await expect(await loginPage.getEmailMessageError()).toBeVisible();
            await expect(await loginPage.getEmailMessageError()).toHaveText("Неправильний формат email або номера телефону");
        }
    });

    test("Authorization with invalid password", async ({ page }) => {
        await loginPage.clickEnterButton();

        await loginPage.fillEmailInput(process.env.TEST_USER_EMAIL);
        await expect(await loginPage.getEmailInput()).toHaveValue(process.env.TEST_USER_EMAIL || "undefined");
        await loginPage.emailInputIsNotHighlighted();

        const invalidPasswords = [
            "Testuser10  ",
            "  Testuser10",
            "Testuser13",
            "testuser10",
            "TESTUSER10",
            "Еуіегіук10"
        ];

        for (const invalidPassword of invalidPasswords) {
            await loginPage.fillPasswordInput(invalidPassword);
            await loginPage.clickHiddenPasswordIcon();
            await loginPage.clickLoginButton();
            await page.waitForLoadState("networkidle");
            await expect(await loginPage.getAuthorizationForm()).toBeVisible();
            if (invalidPassword === "Testuser13") {
                await loginPage.passwordInputIsNotHighlighted();
                await expect(await loginPage.getErrorMessage()).toBeVisible();
                await expect(await loginPage.getErrorMessage()).toHaveText("Невірний e-mail або пароль");
            }
            else {
                await loginPage.passwordInputIsHighlighted();
                await expect(await loginPage.getPasswordMessageError()).toBeVisible();
                await expect(await loginPage.getPasswordMessageError()).toHaveText(
                    "Пароль повинен містити як мінімум 1 цифру, 1 велику літеру і 1 малу літеру, також не повинен містити кирилицю та пробіли"
                );
            }
        }
    });
});