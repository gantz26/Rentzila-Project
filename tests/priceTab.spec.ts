import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/main.page.ts';
import { LoginPage } from '../pages/login.page.ts';
import { GeneralInfoTabPage } from '../pages/generalInfoTab.page.ts';
import { PhotoTabPage } from '../pages/photoTab.page.ts';
import { ServiceTabPage } from '../pages/serviceTab.page.ts';
import { PriceTabPage } from '../pages/priceTab.page.ts';
import { ContactTabPage } from '../pages/contactTab.page.ts';
import { faker } from '@faker-js/faker';
import { copyAndPaste } from '../utils/helper.ts';
import generalInfoTabData from '../data/json/generalInfoTabData.json';
import priceTabData from '../data/json/priceTabData.json';

test.describe("Price tab", () => {
    let mainPage: MainPage;
    let loginPage: LoginPage;
    let generalInfoTabPage: GeneralInfoTabPage;
    let photoTabPage: PhotoTabPage;
    let serviceTabPage: ServiceTabPage;
    let priceTabPage: PriceTabPage;
    let contactTabPage: ContactTabPage;
    let serviceName: string;

    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        loginPage = new LoginPage(page);
        generalInfoTabPage = new GeneralInfoTabPage(page);
        photoTabPage = new PhotoTabPage(page);
        serviceTabPage = new ServiceTabPage(page);
        priceTabPage = new PriceTabPage(page);
        contactTabPage = new ContactTabPage(page);
        await mainPage.open();
        await mainPage.closeTelegramPopup();

        await loginPage.clickEnterButton();
        await loginPage.fillEmailInput(process.env.USER_EMAIL);
        await loginPage.fillPasswordInput(process.env.USER_PASSWORD);
        await loginPage.clickLoginButton();
        await loginPage.waitForAuthorizationFormIsHidden();
        await expect(loginPage.getProfileIcon()).toBeVisible();

        await mainPage.clickAddAnnouncementButton();
        await generalInfoTabPage.isOpen();

        await generalInfoTabPage.selectCategory();
        await generalInfoTabPage.fillAnnouncementInput(faker.word.noun({ length: { min: 10, max: 100 } }));
        await generalInfoTabPage.selectManifacturer();
        await generalInfoTabPage.clickAddressSelectionButton();
        await expect(generalInfoTabPage.getAddressSelectionPopup()).toBeVisible();
        await generalInfoTabPage.getAddressSelectionPopupMap().waitFor({ state: "visible" });
        await expect(generalInfoTabPage.getAddressSelectionPopupAddressLine()).toBeVisible();
        await expect(generalInfoTabPage.getAddressSelectionPopupAddressLine()).toHaveText(generalInfoTabData.defaultAddress, { timeout: 10000 });
        await generalInfoTabPage.selectNewAddress();
        await expect(generalInfoTabPage.getAddressSelectionPopupAddressLine()).not.toHaveText(generalInfoTabData.defaultAddress, { timeout: 10000 });
        const newAddress = await generalInfoTabPage.getAddressSelectionPopupAddressLine().innerText();
        await generalInfoTabPage.clickAddressSelectionPopupApproveButton();
        await expect(generalInfoTabPage.getAddressSelectionLabel()).toHaveText(newAddress);
        await generalInfoTabPage.clickNextButton();

        await expect(photoTabPage.getPhotoTitle()).toBeVisible();
        await expect(photoTabPage.getPhotoTitle()).toHaveText("Фотографії");
        let tabs = await generalInfoTabPage.getTabs();
        await expect(generalInfoTabPage.getTabNumber(tabs[1])).toBeVisible();
        await expect(generalInfoTabPage.getTabNumber(tabs[1])).toHaveText("2");
        await expect(generalInfoTabPage.getTabName(tabs[1])).toBeVisible();
        await expect(generalInfoTabPage.getTabName(tabs[1])).toHaveText("Фотографії");
        await expect(tabs[1]).toHaveAttribute("aria-selected", "true");

        await expect(photoTabPage.getImageUnitParagraph()).toBeVisible();
        await expect(photoTabPage.getImageUnitParagraph()).toHaveText("Фото технічного засобу *");
        await expect(photoTabPage.getImageUnitDescription()).toBeVisible();
        await expect(photoTabPage.getImageUnitDescription()).toHaveText(
            `Додайте в оголошення від 1 до 12 фото технічного засобу розміром до 20 МВ у форматі .jpg, .jpeg, .png. 
            Перше фото буде основним.`
        );

        const imageBlocks = await photoTabPage.getImageBlocks();
        for (let i = 0; i < 3; ++i) {
            await photoTabPage.addImage(imageBlocks[i], `./data/photos/photo_${i + 1}.jpg`);
            expect(await photoTabPage.imageBlockHasImage(imageBlocks[i])).toBeTruthy();
        }
        await generalInfoTabPage.clickNextButton();

        await expect(serviceTabPage.getServiceTitle()).toBeVisible();
        await expect(serviceTabPage.getServiceTitle()).toHaveText("Послуги");
        tabs = await generalInfoTabPage.getTabs();
        await expect(generalInfoTabPage.getTabNumber(tabs[2])).toBeVisible();
        await expect(generalInfoTabPage.getTabNumber(tabs[2])).toHaveText("3");
        await expect(generalInfoTabPage.getTabName(tabs[2])).toBeVisible();
        await expect(generalInfoTabPage.getTabName(tabs[2])).toHaveText("Послуги");
        await expect(tabs[2]).toHaveAttribute("aria-selected", "true");
        serviceName = await serviceTabPage.selectService();
        await generalInfoTabPage.clickNextButton();

        await expect(priceTabPage.getPriceTitle()).toBeVisible();
        await expect(priceTabPage.getPriceTitle()).toHaveText("Вартість");
        tabs = await generalInfoTabPage.getTabs();
        await expect(generalInfoTabPage.getTabNumber(tabs[3])).toBeVisible();
        await expect(generalInfoTabPage.getTabNumber(tabs[3])).toHaveText("4");
        await expect(generalInfoTabPage.getTabName(tabs[3])).toBeVisible();
        await expect(generalInfoTabPage.getTabName(tabs[3])).toHaveText("Вартість");
        await expect(tabs[3]).toHaveAttribute("aria-selected", "true");
    });

    test("Verify \"Спосіб оплати\" section", async ({ page }) => {
        await expect(priceTabPage.getPriceParagraph()).toBeVisible();
        await expect(priceTabPage.getPriceParagraph()).toHaveText("Спосіб оплати *");
        await expect(priceTabPage.getSelectMethodDiv()).toBeVisible();
        await expect(priceTabPage.getSelectMethodDiv()).toHaveText("Готівкою / на картку");

        await priceTabPage.clickSelectMethodDiv();
        await expect(priceTabPage.getSelectMethodDropdownList()).toBeVisible();
        const priceMethods = await priceTabPage.getSelectMethodDropdownListItems();
        const priceMethodNames = [
            "Готівкою / на картку",
            "Безготівковий розрахунок (без ПДВ)",
            "Безготівковий розрахунок (з ПДВ)"
        ];
        expect(priceMethods.length).toEqual(3);
        for (const [index, priceMethod] of priceMethods.entries()) {
            await expect(priceMethod).toBeVisible();
            await expect(priceMethod).toHaveText(priceMethodNames[index]);

            await priceMethod.click();
            await expect(priceTabPage.getSelectMethodDiv()).toHaveText(priceMethodNames[index]);
            await priceTabPage.clickSelectMethodDiv();
        }
    });

    test("Verify \"Вартість мінімального замовлення\" section", async ({ page }) => {
        await expect(priceTabPage.getOrderMinPriceParagraph()).toBeVisible();
        await expect(priceTabPage.getOrderMinPriceParagraph()).toHaveText("Вартість мінімального замовлення *");
        await expect(priceTabPage.getOrderMinPriceDiv()).toBeVisible();
        await expect(priceTabPage.getOrderMinPriceInput()).toHaveAttribute("placeholder", "Наприклад, 1000");

        await priceTabPage.fillOrderMinPriceInput(priceTabData.ACTUAL_TEXT);
        await expect(priceTabPage.getOrderMinPriceInput()).toHaveValue(priceTabData.EXPECTED_TEXT);
        await priceTabPage.clearOrderMinPriceInput();
        await copyAndPaste(page, priceTabPage.getOrderMinPriceInput(), priceTabData.ACTUAL_TEXT);
        await expect(priceTabPage.getOrderMinPriceInput()).toHaveValue(priceTabData.EXPECTED_TEXT);

        for (let i = 0; i < 2; ++i) {
            for (const [index, invalidValue] of priceTabData.INVALID_VALUES.entries()) {
                await priceTabPage.clearOrderMinPriceInput();
                if (i % 2 == 0) {
                    await priceTabPage.fillOrderMinPriceInput(invalidValue);
                }
                else {
                    await copyAndPaste(page, priceTabPage.getOrderMinPriceInput(), invalidValue);
                }

                if (index === 0 || index === 1) {
                    await expect(priceTabPage.getOrderMinPriceInput()).toHaveValue(invalidValue.replace(/ /g, ""));
                }
                else {
                    await expect(priceTabPage.getOrderMinPriceInput()).toHaveValue("");
                }
            }
        }

        await priceTabPage.fillOrderMinPriceInput(priceTabData.EXPECTED_TEXT);
        await expect(priceTabPage.getOrderMinPriceInput()).toHaveValue(priceTabData.EXPECTED_TEXT);
        await priceTabPage.clearOrderMinPriceInput();
        await copyAndPaste(page, priceTabPage.getOrderMinPriceInput(), priceTabData.EXPECTED_TEXT);
        await expect(priceTabPage.getOrderMinPriceInput()).toHaveValue(priceTabData.EXPECTED_TEXT);

        await expect(priceTabPage.getOrderMinPriceCurrencyDiv()).toBeVisible();
        await expect(priceTabPage.getOrderMinPriceCurrencyInput()).toHaveValue("UAH");
    });

    test("Verify adding price for service", async ({ page }) => {
        await expect(priceTabPage.getServicePriceParagraph()).toBeVisible();
        await expect(priceTabPage.getServicePriceParagraph()).toHaveText("Вартість Ваших послуг *");
        await expect(priceTabPage.getServicePriceDescription()).toBeVisible();
        await expect(priceTabPage.getServicePriceDescription()).toHaveText(priceTabData.SERVICE_PRICE_DESCRIPTION_TEXT);

        const serviceItems = await priceTabPage.getServicePriceWrappers();
        for (const serviceItem of serviceItems) {
            await expect(priceTabPage.getServiceAddButton(serviceItem)).toBeVisible();
            await expect(priceTabPage.getPluseIconAddButton(serviceItem)).toBeVisible();
            await expect(priceTabPage.getServiceAddButton(serviceItem)).toHaveText(priceTabData.ADD_BUTTON_TEXT);
            await priceTabPage.clickServiceAddButton(serviceItem);
            await expect(priceTabPage.getServiceAddButton(serviceItem)).toBeHidden();
            await expect(priceTabPage.getServiceInputWithErrorDiv(serviceItem)).toBeVisible();
            await expect(priceTabPage.getServiceSelectorsDiv(serviceItem)).toBeVisible();

            await priceTabPage.fillServicePriceInput(serviceItem, priceTabData.ACTUAL_TEXT);
            await expect(priceTabPage.getServicePriceInput(serviceItem)).toHaveValue(priceTabData.EXPECTED_TEXT);
            await priceTabPage.clearServicePriceInput(serviceItem);
            await copyAndPaste(page, priceTabPage.getServicePriceInput(serviceItem), priceTabData.ACTUAL_TEXT);
            await expect(priceTabPage.getServicePriceInput(serviceItem)).toHaveValue(priceTabData.EXPECTED_TEXT);

            for (let i = 0; i < 2; ++i) {
                for (const [index, invalidValue] of priceTabData.INVALID_VALUES.entries()) {
                    await priceTabPage.clearServicePriceInput(serviceItem);
                    if (i % 2 == 0) {
                        await priceTabPage.fillServicePriceInput(serviceItem, invalidValue);
                    }
                    else {
                        await copyAndPaste(page, priceTabPage.getServicePriceInput(serviceItem), invalidValue);
                    }
    
                    if (index === 0 || index === 1) {
                        await expect(priceTabPage.getServicePriceInput(serviceItem)).toHaveValue(invalidValue.replace(/ /g, ""));
                    }
                    else {
                        await expect(priceTabPage.getServicePriceInput(serviceItem)).toHaveValue("");
                    }
                }
            }
    
            await priceTabPage.fillServicePriceInput(serviceItem, priceTabData.EXPECTED_TEXT);
            await expect(priceTabPage.getServicePriceInput(serviceItem)).toHaveValue(priceTabData.EXPECTED_TEXT);
            await priceTabPage.clearOrderMinPriceInput();
            await copyAndPaste(page, priceTabPage.getServicePriceInput(serviceItem), priceTabData.EXPECTED_TEXT);
            await expect(priceTabPage.getServicePriceInput(serviceItem)).toHaveValue(priceTabData.EXPECTED_TEXT);
    
            await expect(priceTabPage.getServiceCurrencyInput(serviceItem)).toBeVisible();
            await expect(priceTabPage.getServiceCurrencyInput(serviceItem)).toHaveValue("UAH");

            const perUnitNames = [
                "година",
                "зміна",
                "тонна",
                "гектар",
                "метр кв.",
                "метр куб.",
                "Кілометр"
            ];
            await expect(priceTabPage.getServicePerUnitField(serviceItem)).toBeVisible();
            await expect(priceTabPage.getServicePerUnitField(serviceItem)).toHaveText(perUnitNames[0]);

            await priceTabPage.clickServicePerUnitField(serviceItem);
            await expect(priceTabPage.getServiceDropdownList(serviceItem)).toBeVisible();
            const perUnitItems = await priceTabPage.getServicedDropdownListItems(serviceItem);
            for (const [index, perUnitItem] of perUnitItems.entries()) {
                await expect(perUnitItem).toBeVisible();
                await expect(perUnitItem).toHaveText(perUnitNames[index]);
    
                await perUnitItem.click();
                await expect(priceTabPage.getServicePerUnitField(serviceItem)).toHaveText(perUnitNames[index]);
                await priceTabPage.clickServicePerUnitField(serviceItem);
            }

            const shiftNames = [
                "8 год",
                "4 год"
            ];
            await perUnitItems[1].click();
            await expect(priceTabPage.getServiceShiftField(serviceItem)).toBeVisible();
            await expect(priceTabPage.getServiceShiftField(serviceItem)).toHaveText(shiftNames[0]);

            await priceTabPage.clickServiceShiftField(serviceItem);
            await expect(priceTabPage.getServiceDropdownList(serviceItem)).toBeVisible();
            const shiftItems = await priceTabPage.getServicedDropdownListItems(serviceItem);
            for (const [index, shiftItem] of shiftItems.entries()) {
                await expect(shiftItem).toBeVisible();
                await expect(shiftItem).toHaveText(shiftNames[index]);
    
                await shiftItem.click();
                await expect(priceTabPage.getServiceShiftField(serviceItem)).toHaveText(shiftNames[index]);
                await priceTabPage.clickServiceShiftField(serviceItem);
            }

            await priceTabPage.clickServiceDeleteButton(serviceItem);
            await expect(priceTabPage.getServiceAddButton(serviceItem)).toBeVisible();
            await expect(priceTabPage.getServiceInputWithErrorDiv(serviceItem)).toBeHidden();
            await expect(priceTabPage.getServiceSelectorsDiv(serviceItem)).toBeHidden();
        }
    });

    test("Verify \"Назад\" button", async ({ page }) => {
        await expect(generalInfoTabPage.getCancelButton()).toBeVisible();
        await expect(generalInfoTabPage.getCancelButton()).toHaveText("Назад"); 

        await generalInfoTabPage.clickCancelButton();
        await expect(serviceTabPage.getServiceTitle()).toBeVisible();
        await expect(serviceTabPage.getServiceTitle()).toHaveText("Послуги");
        const tabs = await generalInfoTabPage.getTabs();
        for (const [index, tab] of tabs.entries()) {
            await expect(generalInfoTabPage.getTabNumber(tab)).toBeVisible();
            await expect(generalInfoTabPage.getTabNumber(tab)).toHaveText(generalInfoTabData.tabTitles[index].number);
            await expect(generalInfoTabPage.getTabName(tab)).toBeVisible();
            await expect(generalInfoTabPage.getTabName(tab)).toHaveText(generalInfoTabData.tabTitles[index].name);
            if (index === 2) {
                await expect(tab).toHaveAttribute("aria-selected", "true");
            }
            else {
                await expect(tab).toHaveAttribute("aria-selected", "false");
            }
        }
    });

    test("Verify \"Далі\" button", async ({ page }) => {
        await expect(generalInfoTabPage.getNextButton()).toBeVisible();
        await expect(generalInfoTabPage.getNextButton()).toHaveText("Далі");

        await generalInfoTabPage.clickNextButton();
        await expect(priceTabPage.getPriceTitle()).toBeVisible();
        await expect(priceTabPage.getPriceTitle()).toHaveText("Вартість");
        await priceTabPage.orderMinPriceIsRed();
        await expect(priceTabPage.getOrderMinPriceErrorMessage()).toBeVisible();
        await expect(priceTabPage.getOrderMinPriceErrorMessage()).toHaveText(priceTabData.REQUIRED_FIELD_ERROR_MESSAGE);
        await priceTabPage.orderMinPriceErrorMessageIsRed();

        await priceTabPage.selectServicePrice();
        await generalInfoTabPage.clickNextButton();
        await expect(contactTabPage.getContactTitle()).toBeVisible();
        await expect(contactTabPage.getContactTitle()).toHaveText("Ваші контакти");
        const tabs = await generalInfoTabPage.getTabs();
        for (const [index, tab] of tabs.entries()) {
            await expect(generalInfoTabPage.getTabNumber(tab)).toBeVisible();
            await expect(generalInfoTabPage.getTabNumber(tab)).toHaveText(generalInfoTabData.tabTitles[index].number);
            await expect(generalInfoTabPage.getTabName(tab)).toBeVisible();
            await expect(generalInfoTabPage.getTabName(tab)).toHaveText(generalInfoTabData.tabTitles[index].name);
            if (index === 4) {
                await expect(tab).toHaveAttribute("aria-selected", "true");
            }
            else {
                await expect(tab).toHaveAttribute("aria-selected", "false");
            }
        }
    });

    test("Verify adding an invalid price in the \"Вартість мінімального замовлення *\" input", async ({ page }) => {
        await priceTabPage.fillOrderMinPriceInput("0");
        await expect(priceTabPage.getOrderMinPriceInput()).toHaveValue("");

        await priceTabPage.fillOrderMinPriceInput("1");
        await expect(priceTabPage.getOrderMinPriceInput()).toHaveValue("1");

        await generalInfoTabPage.clickNextButton();
        await expect(priceTabPage.getOrderMinPriceErrorMessage()).toBeVisible();
        await expect(priceTabPage.getOrderMinPriceErrorMessage()).toHaveText("Мінімальна вартiсть має бути не менше 1000 грн");
        await priceTabPage.orderMinPriceErrorMessageIsRed();
        await priceTabPage.orderMinPriceIsRed();

        await priceTabPage.clearOrderMinPriceInput();
        await expect(priceTabPage.getOrderMinPriceErrorMessage()).toBeVisible();
        await expect(priceTabPage.getOrderMinPriceErrorMessage()).toHaveText(priceTabData.REQUIRED_FIELD_ERROR_MESSAGE);
        await priceTabPage.orderMinPriceErrorMessageIsRed();
        await priceTabPage.orderMinPriceIsRed();

        await priceTabPage.fillOrderMinPriceInput("1000");
        await expect(priceTabPage.getOrderMinPriceInput()).toHaveValue("1000");
        await expect(priceTabPage.getOrderMinPriceErrorMessage()).toBeHidden();
        await priceTabPage.orderMinPriceIsNotRed();
    });

    test("Verify the data entry in the \"Вартість мінімального замовлення *\" input", async ({ page }) => {
        for (let i = 0; i < 2; ++i) {
            for (const [index, invalidValue] of priceTabData.INVALID_VALUES.entries()) {
                await priceTabPage.clearOrderMinPriceInput();
                if (i % 2 == 0) {
                    await priceTabPage.fillOrderMinPriceInput(invalidValue);
                }
                else {
                    await copyAndPaste(page, priceTabPage.getOrderMinPriceInput(), invalidValue);
                }

                if (index === 0 || index === 1) {
                    await expect(priceTabPage.getOrderMinPriceInput()).toHaveValue(invalidValue.replace(/ /g, ""));
                }
                else {
                    await expect(priceTabPage.getOrderMinPriceInput()).toHaveValue("");
                }
            }
        }

        await priceTabPage.fillOrderMinPriceInput(priceTabData.ACTUAL_TEXT);
        await expect(priceTabPage.getOrderMinPriceInput()).toHaveValue(priceTabData.EXPECTED_TEXT);
        await priceTabPage.clearOrderMinPriceInput();
        await copyAndPaste(page, priceTabPage.getOrderMinPriceInput(), priceTabData.ACTUAL_TEXT);
        await expect(priceTabPage.getOrderMinPriceInput()).toHaveValue(priceTabData.EXPECTED_TEXT);
    });

    test("Verify UI of the \"Вартість Ваших послуг *\" section", async ({ page }) => {
        await expect(priceTabPage.getServicePriceParagraph()).toBeVisible();
        await expect(priceTabPage.getServicePriceParagraph()).toHaveText("Вартість Ваших послуг *");
        await expect(priceTabPage.getServicePriceDescription()).toBeVisible();
        await expect(priceTabPage.getServicePriceDescription()).toHaveText(priceTabData.SERVICE_PRICE_DESCRIPTION_TEXT);

        const serviceItems = await priceTabPage.getServicePriceWrappers();
        for (const serviceItem of serviceItems) {
            await expect(priceTabPage.getServiceAddButton(serviceItem)).toBeVisible();
            await expect(priceTabPage.getPluseIconAddButton(serviceItem)).toBeVisible();
            await expect(priceTabPage.getServiceName(serviceItem)).toBeVisible();
            await expect(priceTabPage.getServiceName(serviceItem)).toHaveText(serviceName);
            await expect(priceTabPage.getServiceAddButton(serviceItem)).toHaveText(priceTabData.ADD_BUTTON_TEXT);
            await priceTabPage.clickServiceAddButton(serviceItem);
            await expect(priceTabPage.getServiceAddButton(serviceItem)).toBeHidden();
            await expect(priceTabPage.getServiceInputWithErrorDiv(serviceItem)).toBeVisible();
            await expect(priceTabPage.getServiceSelectorsDiv(serviceItem)).toBeVisible();
        }
    });

    test("Verify the data entry in the \"Вартість Ваших послуг *\" price input", async ({ page }) => {
        await expect(priceTabPage.getServicePriceParagraph()).toBeVisible();
        await expect(priceTabPage.getServicePriceParagraph()).toHaveText("Вартість Ваших послуг *");
        await expect(priceTabPage.getServicePriceDescription()).toBeVisible();
        await expect(priceTabPage.getServicePriceDescription()).toHaveText(priceTabData.SERVICE_PRICE_DESCRIPTION_TEXT);

        const serviceItems = await priceTabPage.getServicePriceWrappers();
        for (const serviceItem of serviceItems) {
            await expect(priceTabPage.getServiceAddButton(serviceItem)).toBeVisible();
            await expect(priceTabPage.getPluseIconAddButton(serviceItem)).toBeVisible();
            await expect(priceTabPage.getServiceName(serviceItem)).toBeVisible();
            await expect(priceTabPage.getServiceName(serviceItem)).toHaveText(serviceName);
            await expect(priceTabPage.getServiceAddButton(serviceItem)).toHaveText(priceTabData.ADD_BUTTON_TEXT);
            await priceTabPage.clickServiceAddButton(serviceItem);
            await expect(priceTabPage.getServiceAddButton(serviceItem)).toBeHidden();
            await expect(priceTabPage.getServiceInputWithErrorDiv(serviceItem)).toBeVisible();
            await expect(priceTabPage.getServiceSelectorsDiv(serviceItem)).toBeVisible();

            for (let i = 0; i < 2; ++i) {
                for (const [index, invalidValue] of priceTabData.INVALID_VALUES.entries()) {
                    await priceTabPage.clearServicePriceInput(serviceItem);
                    if (i % 2 == 0) {
                        await priceTabPage.fillServicePriceInput(serviceItem, invalidValue);
                    }
                    else {
                        await copyAndPaste(page, priceTabPage.getServicePriceInput(serviceItem), invalidValue);
                    }
    
                    if (index === 0 || index === 1) {
                        await expect(priceTabPage.getServicePriceInput(serviceItem)).toHaveValue(invalidValue.replace(/ /g, ""));
                    }
                    else {
                        await expect(priceTabPage.getServicePriceInput(serviceItem)).toHaveValue("");
                    }
                }
            }

            await priceTabPage.fillServicePriceInput(serviceItem, priceTabData.ACTUAL_TEXT);
            await expect(priceTabPage.getServicePriceInput(serviceItem)).toHaveValue(priceTabData.EXPECTED_TEXT);
            await priceTabPage.clearServicePriceInput(serviceItem);
            await copyAndPaste(page, priceTabPage.getServicePriceInput(serviceItem), priceTabData.ACTUAL_TEXT);
            await expect(priceTabPage.getServicePriceInput(serviceItem)).toHaveValue(priceTabData.EXPECTED_TEXT);
        }
    });
});