import { test, expect, Locator, request as playwrightRequest, APIRequestContext } from '@playwright/test';
import { MainPage } from '../pages/main.page.ts';
import { ProductsPage } from '../pages/products.page.ts';
import { UnitPage } from '../pages/unit.page.ts';
import { faker } from "@faker-js/faker";
import { AuthAPI } from '../utils/auth.api.ts';
import { LoginPage } from '../pages/login.page.ts';

test.describe("Main page", () => {
    let mainPage: MainPage;
    let productsPage: ProductsPage;
    let unitPage: UnitPage;
    let loginPage: LoginPage;
    let request: APIRequestContext;

    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        productsPage = new ProductsPage(page);
        unitPage = new UnitPage(page);
        loginPage = new LoginPage(page);
        await mainPage.open();

        await mainPage.clickEnterButton();
        await loginPage.login();
    });

    test("Checking \"Послуги\" section on the main page", async ({ page }) => {
        await expect(await mainPage.getServicesHeader()).toBeVisible();
        await mainPage.closeTelegramPopup();
        const categories: Locator[] = await mainPage.getCategoriesButtons();
        for (const category of categories) {
            await expect(category).toBeVisible();
            const proposes: Locator[] = await mainPage.getProposeButtons();
            for (const propose of proposes) {
                await mainPage.isOpen();
                await category.click();
                await page.waitForLoadState();
                await propose.waitFor({ state: "visible" });
                const proposeText: string = await propose.innerText();
                await propose.click();
                await productsPage.isOpen();
                await page.waitForLoadState();
                await productsPage.expandCheckboxLists();
                if (proposeText !== "FCHCHFCFB") {
                    await expect(await productsPage.getCheckboxByName(proposeText)).toBeChecked();
                    await expect(await productsPage.findFilterForServices(proposeText)).toBeTruthy();
                }
                const units = await productsPage.getUnitList();
                if (!(await productsPage.isUnitListEmpty(units))) {
                    for (const unit of units) {
                        await expect(unit).toBeVisible();
                    }
                    const firstUnit = units[0];
                    const firstUnitTitle = await productsPage.getUnitTitle(firstUnit);
                    await firstUnit.click();
                    await unitPage.isOpen(firstUnitTitle);
                    await unitPage.containsCharacteristicForServices(proposeText);
                }
                await mainPage.clickLogo();
            }
        }
    });

    test("Checking \"Спецтехніка\" section on the main page", async ({ page }) => {
        await expect(await mainPage.getEquipmentHeader()).toBeVisible();
        await mainPage.closeTelegramPopup();
        const tabs = await mainPage.getTabsButtons();
        for (const tab of tabs) {
            await tab.waitFor({state: "visible" });
            const equipments = await mainPage.getEquipmentButtons();
            for (const equipment of equipments) {
                await mainPage.isOpen();
                await tab.click();
                await equipment.waitFor({ state: "visible" });
                const equipmentText = await equipment.innerText();
                await equipment.click();
                await productsPage.isOpen();
                await productsPage.findFilterForEquipments(equipmentText);
                const units = await productsPage.getUnitList();
                if (!(await productsPage.isUnitListEmpty(units))) {
                    for (const unit of units) {
                        await expect(unit).toBeVisible();
                    }
                    const firstUnit = units[0];
                    const firstUnitTitle = await productsPage.getUnitTitle(firstUnit);
                    await firstUnit.click();
                    await unitPage.isOpen(firstUnitTitle);
                    await unitPage.containsCharacteristicForEquipment(equipmentText);
                }
                await mainPage.clickLogo();
            }
        }
    });

    test("Verify that all elements on the footer are displayed and all links are clickable", async ({ page }) => {
        await mainPage.closeTelegramPopup();
        await mainPage.scrollDownToFooter();
        await expect(await mainPage.aboutUsLabel).toBeVisible();
        await expect(await mainPage.privacyPolicy).toBeVisible();
        await expect(await mainPage.cookiePolicy).toBeVisible();
        await expect(await mainPage.termsConditions).toBeVisible();
        await expect(await mainPage.forBuyersLabel).toBeVisible();
        await expect(await mainPage.productLink).toBeVisible();
        await expect(await mainPage.tendersLink).toBeVisible();
        await expect(await mainPage.requestsLink).toBeVisible();
        await expect(await mainPage.contactsLabel).toBeVisible();
        await expect(await mainPage.emailLink).toBeVisible();
        await expect(await mainPage.copyRight).toBeVisible();

        await mainPage.clickPrivacyPolicy();
        await mainPage.scrollDownToFooter();
        await mainPage.clickCookiePolicy();
        await mainPage.scrollDownToFooter();
        await mainPage.clickTermsConditions();
        await mainPage.scrollDownToFooter();

        await mainPage.clickProductsLink();
        await mainPage.clickLogo();
        await mainPage.clickTendersLink();
        await mainPage.clickLogo();
        await mainPage.clickRequestsLink();
        await mainPage.clickLogo();
    });

    test("Verify \"У Вас залишилися питання?\" form", async ({ page }) => {
        await mainPage.scrollDownToConsultationform();
        await mainPage.closeTelegramPopup();
        await mainPage.clickOrderConsultationButton();

        await mainPage.nameInputIsHighlighted();
        await mainPage.nameInputHasErrorMessage("Поле не може бути порожнім");
        await mainPage.phoneNumberInputIsHighlighted();
        await mainPage.phoneNumberInputHasErrorMessage("Поле не може бути порожнім");

        let validNameValue: string = "Test" + faker.person.firstName();
        await mainPage.fillNameInput(validNameValue);
        await mainPage.clickOrderConsultationButton();
        await mainPage.nameInputIsNotHighlighted();
        await mainPage.phoneNumberInputIsHighlighted();

        await mainPage.clickPhoneNumberInput();
        await expect(await mainPage.getPhoneNumberInputValue()).toEqual("+380");

        let validPhoneNumberValue: string = "+380506743060";
        await mainPage.fillPhoneNumberInput(validPhoneNumberValue);
        await mainPage.fillNameInput("");
        await mainPage.clickOrderConsultationButton();
        await mainPage.nameInputIsHighlighted();
        await mainPage.phoneNumberInputIsNotHighlighted();

        await mainPage.fillNameInput(validNameValue);
        const invalidNumbers: string[] = [ "+38063111111", "+11111111111111" ];
        for (const number of invalidNumbers) {
            await mainPage.fillPhoneNumberInput(number);
            await mainPage.clickOrderConsultationButton();
            await mainPage.nameInputIsNotHighlighted();
            await mainPage.phoneNumberInputIsHighlighted();
            await mainPage.phoneNumberInputHasErrorMessage("Телефон не пройшов валідацію");
        }

        await mainPage.fillPhoneNumberInput(validPhoneNumberValue);
        await mainPage.clickOrderConsultationButton();
        await mainPage.handlePopup();

        request = await playwrightRequest.newContext();
        const authAPI = new AuthAPI(request);
        await expect(await authAPI.findUserBackcall(validNameValue, validPhoneNumberValue)).toBeTruthy();
    });
});