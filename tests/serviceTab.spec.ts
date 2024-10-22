import { test, expect, Locator } from '@playwright/test';
import { MainPage } from '../pages/main.page.ts';
import { LoginPage } from '../pages/login.page.ts';
import { GeneralInfoTabPage } from '../pages/generalInfoTab.page.ts';
import { PhotoTabPage } from '../pages/photoTab.page.ts';
import { ServiceTabPage } from '../pages/serviceTab.page.ts';
import { PriceTabPage } from '../pages/priceTab.page.ts';
import { faker } from '@faker-js/faker';
import { copyAndPaste } from '../utils/helper.ts';
import generalInfoTabData from '../data/json/generalInfoTabData.json';

test.describe("Service tab", () => {
    let mainPage: MainPage;
    let loginPage: LoginPage;
    let generalInfoTabPage: GeneralInfoTabPage;
    let photoTabPage: PhotoTabPage;
    let serviceTabPage: ServiceTabPage;
    let priceTabPage: PriceTabPage;

    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        loginPage = new LoginPage(page);
        generalInfoTabPage = new GeneralInfoTabPage(page);
        photoTabPage = new PhotoTabPage(page);
        serviceTabPage = new ServiceTabPage(page);
        priceTabPage = new PriceTabPage(page);
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
    });

    test("Verify creating new service", async ({ page }) => {
       const notExistingService = faker.lorem.sentence(10);
       await serviceTabPage.fillServiceInput(notExistingService);
       await expect(serviceTabPage.getServiceDropdownList()).toBeVisible();
       await expect(serviceTabPage.getServiceDropdownList()).toContainText(
        `На жаль, послугу “${notExistingService}“ не знайдено в нашій базі. 
        Ви можете додати послугу в категорію “Користувацькі”:`);

       await expect(serviceTabPage.getCreateServiceButton()).toBeVisible();
       await expect(serviceTabPage.getCreateServiceButton()).toHaveText("Створити послугу");
       await expect(serviceTabPage.getCreateServiceButtonPlusIcon()).toBeVisible();

       await serviceTabPage.clickCreateServiceButton();
       await expect(serviceTabPage.getCreateServiceButton()).toBeHidden();
       await expect(serviceTabPage.getServiceDropdownList()).toBeVisible();
       const serviceItems = await serviceTabPage.getServiceDropdownListItems();
       await expect(serviceItems[0]).toBeVisible();
       await expect(serviceItems[0]).toHaveText(notExistingService);
       await expect(serviceTabPage.getServiceDropdownListItemCheckIcon(serviceItems[0])).toBeVisible();
    });

    test("Verify choosing multiple services", async ({ page }) => {
        await serviceTabPage.fillServiceInput("Г");
        await expect(serviceTabPage.getServiceDropdownList()).toBeVisible();

        const serviceItems = await serviceTabPage.getServiceDropdownListItems();
        const selectedItems: Locator[] = [];
        for (let i = 0; i < 2; ++i) {
            const randomIndex = Math.floor(Math.random() * serviceItems.length);
            await serviceItems[randomIndex].click();
            await expect(serviceTabPage.getServiceDropdownListItemCheckIcon(serviceItems[randomIndex])).toBeVisible();
            selectedItems.push(serviceItems[randomIndex]);
        }

        await expect(serviceTabPage.getSelectedServicesDescription()).toBeVisible();
        await expect(serviceTabPage.getSelectedServicesDescription()).toHaveText("Послуги, які надає технічний засіб:");
        for (const selectedItem of selectedItems) {
            const itemText = await serviceTabPage.getServiceDropdownListItemText(selectedItem);
            expect(await serviceTabPage.containService(itemText)).toBeTruthy();
        }
    });

    test("Verify removing variants from choosed list", async ({ page }) => {
        await serviceTabPage.fillServiceInput("Г");
        await expect(serviceTabPage.getServiceDropdownList()).toBeVisible();

        const serviceItems = await serviceTabPage.getServiceDropdownListItems();
        const selectedItems: Locator[] = [];
        for (let i = 0; i < 2; ++i) {
            const randomIndex = Math.floor(Math.random() * serviceItems.length);
            await serviceItems[randomIndex].click();
            await expect(serviceTabPage.getServiceDropdownListItemCheckIcon(serviceItems[randomIndex])).toBeVisible();
            selectedItems.push(serviceItems[randomIndex]);
        }

        const selectedServices = await serviceTabPage.getSelectedServices();
        expect(selectedServices.length).toEqual(2);
        await serviceTabPage.clickSelectedServiceDeleteButton(selectedServices[1]);
        await expect(selectedServices[1]).toBeHidden();

        await serviceTabPage.clickSelectedServiceDeleteButton(selectedServices[0]);
        await expect(selectedServices[0]).toBeHidden();
        await expect(serviceTabPage.getSelectedServicesDescription()).toBeHidden();
    });

    test("Verify \"Назад\" button", async ({ page }) => {
        await expect(generalInfoTabPage.getCancelButton()).toBeVisible();
        await expect(generalInfoTabPage.getCancelButton()).toHaveText("Назад"); 

        await generalInfoTabPage.clickCancelButton();
        await expect(photoTabPage.getPhotoTitle()).toBeVisible();
        await expect(photoTabPage.getPhotoTitle()).toHaveText("Фотографії");
        const tabs = await generalInfoTabPage.getTabs();
        for (const [index, tab] of tabs.entries()) {
            await expect(generalInfoTabPage.getTabNumber(tab)).toBeVisible();
            await expect(generalInfoTabPage.getTabNumber(tab)).toHaveText(generalInfoTabData.tabTitles[index].number);
            await expect(generalInfoTabPage.getTabName(tab)).toBeVisible();
            await expect(generalInfoTabPage.getTabName(tab)).toHaveText(generalInfoTabData.tabTitles[index].name);
            if (index === 1) {
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
        await expect(serviceTabPage.getServiceTitle()).toBeVisible();
        await expect(serviceTabPage.getServiceTitle()).toHaveText("Послуги");
        await serviceTabPage.serviceInputIsHighlighted();
        await serviceTabPage.serviceDescriptionIsRed();

        await serviceTabPage.selectService();
        await generalInfoTabPage.clickNextButton();
        await expect(priceTabPage.getPriceTitle()).toBeVisible();
        await expect(priceTabPage.getPriceTitle()).toHaveText("Вартість");
        const tabs = await generalInfoTabPage.getTabs();
        for (const [index, tab] of tabs.entries()) {
            await expect(generalInfoTabPage.getTabNumber(tab)).toBeVisible();
            await expect(generalInfoTabPage.getTabNumber(tab)).toHaveText(generalInfoTabData.tabTitles[index].number);
            await expect(generalInfoTabPage.getTabName(tab)).toBeVisible();
            await expect(generalInfoTabPage.getTabName(tab)).toHaveText(generalInfoTabData.tabTitles[index].name);
            if (index === 3) {
                await expect(tab).toHaveAttribute("aria-selected", "true");
            }
            else {
                await expect(tab).toHaveAttribute("aria-selected", "false");
            }
        }
    });

    test("Verify entering special characters in the \"Послуги\" input", async ({ page }) => {
        const specialCharacters = "<>{};^";
        await serviceTabPage.fillServiceInput(specialCharacters);
        await expect(serviceTabPage.getServiceInput()).toHaveValue("");

        const dataWithSpecialCharacters = "Буріння" + specialCharacters;
        await serviceTabPage.fillServiceInput(dataWithSpecialCharacters);
        await expect(serviceTabPage.getServiceInput()).toHaveValue("Буріння");
        await expect(serviceTabPage.getServiceDropdownList()).toBeVisible();
        await serviceTabPage.clearServiceInput();

        await copyAndPaste(page, serviceTabPage.getServiceInput(), specialCharacters);
        await expect(serviceTabPage.getServiceInput()).toHaveValue("");
    });

    test("Verify data length for \"Послуги\" input field", async ({ page }) => {
        const symbol = faker.helpers.replaceSymbols("?");
        await serviceTabPage.fillServiceInput(symbol);
        await expect(serviceTabPage.getServiceDropdownList()).toBeVisible();
        const listItems = await serviceTabPage.getServiceDropdownListItems();
        for (const item of listItems) {
            expect((await serviceTabPage.getServiceDropdownListItemText(item)).toUpperCase()).toContain(symbol);
        }

        await serviceTabPage.clearServiceInput();
        await expect(serviceTabPage.getServiceInput()).toHaveValue("");

        const text = faker.helpers.fromRegExp(/[A-Z]{101}/);
        await serviceTabPage.fillServiceInput(text);
        await expect(serviceTabPage.getServiceDropdownList()).toBeVisible();
        await expect(serviceTabPage.getServiceDropdownList()).toContainText(
            `На жаль, послугу “${text.substring(0, 100)}“ не знайдено в нашій базі. 
            Ви можете додати послугу в категорію “Користувацькі”:`);
        await expect(serviceTabPage.getServiceDropdownList()).toContainText("100 / 100");
    });

    test("Verify the search function is not sensetive to upper or lower case", async ({ page }) => {
        const lowerText = "риття";
        await serviceTabPage.fillServiceInput(lowerText);
        await expect(serviceTabPage.getServiceDropdownList()).toBeVisible();
        let listItems = await serviceTabPage.getServiceDropdownListItems();
        for (const item of listItems) {
            expect((await serviceTabPage.getServiceDropdownListItemText(item)).toLowerCase()).toContain(lowerText);
        }

        const upperText = "РИТТЯ";
        await serviceTabPage.fillServiceInput(upperText);
        await expect(serviceTabPage.getServiceDropdownList()).toBeVisible();
        listItems = await serviceTabPage.getServiceDropdownListItems();
        for (const item of listItems) {
            expect((await serviceTabPage.getServiceDropdownListItemText(item)).toUpperCase()).toContain(upperText);
        }
    });

    test("Verify \"Послуги\" input with invalid data", async ({ page }) => {
        const specialCharacters = "<>{};^";
        await serviceTabPage.fillServiceInput(specialCharacters);
        await expect(serviceTabPage.getServiceInput()).toHaveValue("");

        await copyAndPaste(page, serviceTabPage.getServiceInput(), specialCharacters);
        await expect(serviceTabPage.getServiceInput()).toHaveValue("");
    });

    test("Verify \"Послуги\" input choosing of existing service", async ({ page }) => {
        await expect(serviceTabPage.getServiceParagraph()).toBeVisible();
        await expect(serviceTabPage.getServiceParagraph()).toHaveText("Знайдіть послуги, які надає Ваш технічний засіб *");
        await expect(serviceTabPage.getServiceDescription()).toBeVisible();
        await expect(serviceTabPage.getServiceDescription()).toHaveText("Додайте в оголошення принаймні 1 послугу");
        await expect(serviceTabPage.getServiceInput()).toBeVisible();
        await expect(serviceTabPage.getServiceInput()).toHaveAttribute("placeholder", "Наприклад: Рихлення грунту, буріння");
        await expect(serviceTabPage.getServiceLoopIcon()).toBeVisible();

        await serviceTabPage.fillServiceInput("Б");
        await expect(serviceTabPage.getServiceDropdownList()).toBeVisible();

        await serviceTabPage.clearServiceInput();
        const lowerText = "буріння";
        await serviceTabPage.fillServiceInput(lowerText);
        await expect(serviceTabPage.getServiceInput()).toHaveValue(lowerText);
        await expect(serviceTabPage.getServiceDropdownList()).toBeVisible();
        const lowerListItems = await serviceTabPage.getServiceDropdownListItems();
        for (const item of lowerListItems) {
            expect((await serviceTabPage.getServiceDropdownListItemText(item)).toLowerCase()).toContain(lowerText);
        }

        await serviceTabPage.clearServiceInput();
        const upperText = "БУРІННЯ";
        await serviceTabPage.fillServiceInput(upperText);
        await expect(serviceTabPage.getServiceInput()).toHaveValue(upperText);
        await expect(serviceTabPage.getServiceDropdownList()).toBeVisible();
        const upperListItems = await serviceTabPage.getServiceDropdownListItems();
        for (const item of upperListItems) {
            expect((await serviceTabPage.getServiceDropdownListItemText(item)).toUpperCase()).toContain(upperText);
        }

        expect(lowerListItems.length).toEqual(upperListItems.length);
        for (let i = 0; i < lowerListItems.length; ++i) {
            expect(await serviceTabPage.getServiceDropdownListItemText(lowerListItems[i])).toEqual(
                await serviceTabPage.getServiceDropdownListItemText(upperListItems[i]));
        }

        const randomIndex = Math.floor(Math.random() * upperListItems.length);
        const selectedItem = upperListItems[randomIndex];
        await selectedItem.click();
        await expect(serviceTabPage.getServiceDropdownListItemCheckIcon(selectedItem)).toBeVisible();

        await expect(serviceTabPage.getSelectedServicesDescription()).toBeVisible();
        await expect(serviceTabPage.getSelectedServicesDescription()).toHaveText("Послуги, які надає технічний засіб:");
        const selectedItems = await serviceTabPage.getSelectedServices();
        expect(selectedItems.length).toEqual(1);
        await expect(selectedItems[0]).toHaveText(await serviceTabPage.getServiceDropdownListItemText(selectedItem));
        await expect(serviceTabPage.getSelectedServiceDeleteButton(selectedItems[0])).toBeVisible();
    });
});