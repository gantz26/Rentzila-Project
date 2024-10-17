import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/main.page.ts';
import { LoginPage } from '../pages/login.page.ts';
import { GeneralInfoTabPage } from '../pages/generalInfoTab.page.ts';
import { PhotoTabPage } from '../pages/photoTab.page.ts';
import { copyAndPaste } from '../utils/helper.ts';
import { faker } from '@faker-js/faker';
import { readFile } from 'fs/promises';
import errorMessages from '../data/json/errorMessages.json';
import generalInfoTabData from '../data/json/generalInfoTabData.json';

test.describe("General info tab", () => {
    let mainPage: MainPage;
    let loginPage: LoginPage;
    let generalInfoTabPage: GeneralInfoTabPage;
    let photoTabPage: PhotoTabPage;

    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        loginPage = new LoginPage(page);
        generalInfoTabPage = new GeneralInfoTabPage(page);
        photoTabPage = new PhotoTabPage(page);
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
    });

    test("Verify body title and tab titles", async ({ page }) => {
        await expect(generalInfoTabPage.getMainInfoTitle()).toBeVisible();
        await expect(generalInfoTabPage.getMainInfoTitle()).toHaveText("Створити оголошення");

        const tabs = await generalInfoTabPage.getTabs();
        for (const [index, tab] of tabs.entries()) {
            await expect(generalInfoTabPage.getTabNumber(tab)).toBeVisible();
            await expect(generalInfoTabPage.getTabNumber(tab)).toHaveText(generalInfoTabData.tabTitles[index].number);
            await expect(generalInfoTabPage.getTabName(tab)).toBeVisible();
            await expect(generalInfoTabPage.getTabName(tab)).toHaveText(generalInfoTabData.tabTitles[index].name);
            if (index === 0) {
                await expect(tab).toHaveAttribute("aria-selected", "true");
            }
            else {
                await expect(tab).toHaveAttribute("aria-selected", "false");
            }
        }
    });

    test("Verify category section", async ({ page }) => {
        await expect(generalInfoTabPage.getCategoryTitle()).toBeVisible();
        await expect(generalInfoTabPage.getCategoryTitle()).toHaveText("Категорія *");
        await expect(generalInfoTabPage.getCategoryButton()).toBeVisible();
        await expect(generalInfoTabPage.getCategoryButton()).toHaveText("Виберіть категорію");
        await expect(generalInfoTabPage.getCategoryArrowImg()).toBeVisible();

        await generalInfoTabPage.clickNextButton();
        await generalInfoTabPage.categoryButtonIsHighlighted();
        await expect(generalInfoTabPage.getCategoryErrorMessage()).toBeVisible();
        await expect(generalInfoTabPage.getCategoryErrorMessage()).toHaveText(errorMessages.REQUIRED_FIELD_ERROR_MESSAGE);
        await generalInfoTabPage.categoryErrorMessageIsRed();

        await generalInfoTabPage.clickCategoryButton();
        await expect(generalInfoTabPage.getCategoryPopup()).toBeVisible();
        await expect(generalInfoTabPage.getPopupTitle()).toBeVisible();
        await expect(generalInfoTabPage.getPopupTitle()).toHaveText("Вибір категорії технічного засобу");
        await expect(generalInfoTabPage.getPopupCloseIcon()).toBeVisible();
        await generalInfoTabPage.clickPopupCloseIcon();
        await expect(generalInfoTabPage.getCategoryPopup()).toBeHidden();

        await generalInfoTabPage.clickCategoryButton();
        await expect(generalInfoTabPage.getCategoryPopup()).toBeVisible();
        await generalInfoTabPage.clickAvatarIcon();
        await expect(generalInfoTabPage.getCategoryPopup()).toBeHidden();
        
        const fileData = await readFile("./data/json/categories.json", "utf-8");
        const categoriesNames = JSON.parse(fileData);
        await generalInfoTabPage.clickCategoryButton();
        const firstColumnOptions = await generalInfoTabPage.getPopupFirstCategoryItems();
        for (const [firstColumnIndex, firstOption] of firstColumnOptions.entries()) {
            await expect(firstOption).toBeVisible();
            await expect(firstOption).toHaveText(categoriesNames[firstColumnIndex].name);
            await firstOption.click();
            const secondColumnOptions = await generalInfoTabPage.getPopupSecondCategoryItems();
            for (const [secondColumnIndex, secondOption] of secondColumnOptions.entries()) {
                await expect(secondOption).toHaveText(categoriesNames[firstColumnIndex].subOptions[secondColumnIndex].name);
                await secondOption.click();
                const thirdColumnOptions = await generalInfoTabPage.getPopupThirdCategoryItems();
                for (const [thirdColumnIndex, thirdOption] of thirdColumnOptions.entries()) {
                    await expect(thirdOption).toHaveText(categoriesNames[firstColumnIndex].subOptions[secondColumnIndex].values[thirdColumnIndex]);
                    await thirdOption.click();
                    await expect(generalInfoTabPage.getCategoryButton()).toHaveText(categoriesNames[firstColumnIndex].subOptions[secondColumnIndex].values[thirdColumnIndex]);
                    await generalInfoTabPage.clickCategoryButton();
                }
            }
        }
    });

    test("Verify unit name section", async({ page }) => {
        await expect(generalInfoTabPage.getAnnouncementTitle()).toBeVisible();
        await expect(generalInfoTabPage.getAnnouncementTitle()).toHaveText("Назва оголошення *");
        await expect(generalInfoTabPage.getAnnouncementInput()).toBeVisible();
        await expect(generalInfoTabPage.getAnnouncementInput()).toHaveAttribute("placeholder", "Введіть назву оголошення");

        await generalInfoTabPage.clickNextButton();
        await expect(generalInfoTabPage.getAnnouncementErrorMessage()).toBeVisible();
        await expect(generalInfoTabPage.getAnnouncementErrorMessage()).toHaveText(errorMessages.REQUIRED_FIELD_ERROR_MESSAGE);
        await generalInfoTabPage.announcementErrorMessageIsRed();
        await generalInfoTabPage.announcementInputIsHighlighted();

        await generalInfoTabPage.fillAnnouncementInput("123456789");
        await generalInfoTabPage.clickNextButton();
        await expect(generalInfoTabPage.getAnnouncementErrorMessage()).toBeVisible();
        await expect(generalInfoTabPage.getAnnouncementErrorMessage()).toHaveText(errorMessages.LESS_THAN_10_SYMBOLS_ERROR_MESSAGE);
        await generalInfoTabPage.announcementErrorMessageIsRed();
        await generalInfoTabPage.announcementInputIsHighlighted();
        await generalInfoTabPage.clearAnnouncementInput();
        await copyAndPaste(page, generalInfoTabPage.getAnnouncementInput(), "123456789");
        await expect(generalInfoTabPage.getAnnouncementErrorMessage()).toBeVisible();
        await expect(generalInfoTabPage.getAnnouncementErrorMessage()).toHaveText(errorMessages.LESS_THAN_10_SYMBOLS_ERROR_MESSAGE);
        await generalInfoTabPage.announcementErrorMessageIsRed();
        await generalInfoTabPage.announcementInputIsHighlighted();

        await generalInfoTabPage.clearAnnouncementInput();
        const text = 'a'.repeat(101);
        await generalInfoTabPage.fillAnnouncementInput(text);
        await expect(generalInfoTabPage.getAnnouncementErrorMessage()).toBeVisible();
        await expect(generalInfoTabPage.getAnnouncementErrorMessage()).toHaveText(errorMessages.MORE_THAN_100_SYMBOLS_ERROR_MESSAGE);
        await generalInfoTabPage.clickNextButton();
        await expect(generalInfoTabPage.getAnnouncementErrorMessage()).toBeVisible();
        await expect(generalInfoTabPage.getAnnouncementErrorMessage()).toHaveText(errorMessages.REQUIRED_FIELD_ERROR_MESSAGE);
        await generalInfoTabPage.announcementErrorMessageIsRed();
        await generalInfoTabPage.announcementInputIsHighlighted();
        await generalInfoTabPage.clearAnnouncementInput();
        await copyAndPaste(page, generalInfoTabPage.getAnnouncementInput(), text);
        await expect(generalInfoTabPage.getAnnouncementErrorMessage()).toBeVisible();
        await expect(generalInfoTabPage.getAnnouncementErrorMessage()).toHaveText(errorMessages.MORE_THAN_100_SYMBOLS_ERROR_MESSAGE);
        await generalInfoTabPage.announcementErrorMessageIsRed();
        await generalInfoTabPage.announcementInputIsHighlighted();

        await generalInfoTabPage.clearAnnouncementInput();
        await generalInfoTabPage.fillAnnouncementInput("<>{};^");
        await expect(generalInfoTabPage.getAnnouncementInput()).toHaveValue("");

        await generalInfoTabPage.fillAnnouncementInput("abcdefghij");
        await generalInfoTabPage.clickNextButton();
        await generalInfoTabPage.announcementInputIsNotHighlighted();
        await expect(generalInfoTabPage.getAnnouncementErrorMessage()).toBeHidden();
        await generalInfoTabPage.clearAnnouncementInput();
        await copyAndPaste(page, generalInfoTabPage.getAnnouncementInput(), "abcdefghij");
        await generalInfoTabPage.clickNextButton();
        await generalInfoTabPage.announcementInputIsNotHighlighted();
        await expect(generalInfoTabPage.getAnnouncementErrorMessage()).toBeHidden();
    });

    test("Verify vehicle manufacturer section", async ({ page }) => {
        await expect(generalInfoTabPage.getManufacturerTitle()).toBeVisible();
        await expect(generalInfoTabPage.getManufacturerTitle()).toHaveText("Виробник транспортного засобу *");
        await expect(generalInfoTabPage.getManufacturerInput()).toBeVisible();
        await expect(generalInfoTabPage.getManufacturerLoopIcon()).toBeVisible();
        await expect(generalInfoTabPage.getManufacturerInput()).toHaveAttribute("placeholder", "Введіть виробника транспортного засобу");

        await generalInfoTabPage.clickNextButton();
        await expect(generalInfoTabPage.getManufacturerErrorMessage()).toBeVisible();
        await expect(generalInfoTabPage.getManufacturerErrorMessage()).toHaveText(errorMessages.REQUIRED_FIELD_ERROR_MESSAGE);
        await generalInfoTabPage.manufacturerErrorMessageIsRed();
        await generalInfoTabPage.manufacturerInputIsHighlighted();

        await generalInfoTabPage.fillManufacturerInput("A");
        await expect(generalInfoTabPage.getManufacturerDropdownList()).toBeVisible();
        await generalInfoTabPage.clearManufacturerInput();
        await copyAndPaste(page, generalInfoTabPage.getManufacturerInput(), "A");
        await expect(generalInfoTabPage.getManufacturerDropdownList()).toBeVisible();

        const searchedStrings = ["АТЭК", "Атэк"];
        for (const searchString of searchedStrings) {
            await generalInfoTabPage.fillManufacturerInput(searchString);
            await expect(generalInfoTabPage.getManufacturerDropdownList()).toBeVisible();
            const dropdownListItems = await generalInfoTabPage.getManufacturerDropdownListItems();
            expect(dropdownListItems.length).toBeGreaterThan(0);
            for (const item of dropdownListItems) {
                expect((await item.innerText()).localeCompare(searchString, ["en", "uk", "ru"], { sensitivity: "base" })).toEqual(0);
            }
        }

        const invalidValues = [" ", "<>{};^", "123456789"];
        for (let i = 0; i < 2; ++i) {
            for (const invalidValue of invalidValues) {
                await generalInfoTabPage.clearManufacturerInput();
                if (i % 2 != 0) {
                    await copyAndPaste(page, generalInfoTabPage.getManufacturerInput(), invalidValue);
                }
                else {
                    await generalInfoTabPage.fillManufacturerInput(invalidValue);
                }
                if (invalidValue === "123456789") {
                    await expect(generalInfoTabPage.getManufacturerDropdownList()).toBeVisible();
                    expect(await generalInfoTabPage.getManufacturerDropdownListItems()).toHaveLength(0);
                    await expect(generalInfoTabPage.getManufacturerDropdownList()).toContainText(
                        `На жаль, виробника “${invalidValue}“ не знайдено в нашій базі.
                        Щоб додати виробника - зв\`яжіться із службою підтримки`);
                    await expect(generalInfoTabPage.getManufacturerDropdownList()).toContainText(`${invalidValue.length} / 100`);
                }
                else {
                    await expect(generalInfoTabPage.getManufacturerInput()).toHaveValue("");
                    await expect(generalInfoTabPage.getManufacturerDropdownList()).toBeHidden();
                }
            }
        }

        await generalInfoTabPage.clearManufacturerInput();
        const text = 'a'.repeat(101);
        await generalInfoTabPage.fillManufacturerInput(text);
        await generalInfoTabPage.clickNextButton();
        await expect(generalInfoTabPage.getManufacturerErrorMessage()).toBeVisible();
        await expect(generalInfoTabPage.getManufacturerErrorMessage()).toHaveText(errorMessages.REQUIRED_FIELD_ERROR_MESSAGE);
        await generalInfoTabPage.manufacturerErrorMessageIsRed();
        await generalInfoTabPage.manufacturerInputIsHighlighted();
        expect((await generalInfoTabPage.getManufacturerInput().inputValue()).length).toEqual(100);

        await generalInfoTabPage.clearManufacturerInput();
        await generalInfoTabPage.fillManufacturerInput("Abc");
        const dropdownListItems = await generalInfoTabPage.getManufacturerDropdownListItems();
        expect(dropdownListItems.length).toBeGreaterThan(0);
        await generalInfoTabPage.getManufacturerTitle().scrollIntoViewIfNeeded();
        const item = dropdownListItems[Math.floor(Math.random() * dropdownListItems.length)];
        const itemText = await item.innerText();
        await item.click();
        await expect(generalInfoTabPage.getManufacturerSelectDiv()).toBeVisible();
        await expect(generalInfoTabPage.getManufacturerSelectDiv()).toHaveText(itemText);
        await expect(generalInfoTabPage.getManufacturerCloseButton()).toBeVisible();
        await generalInfoTabPage.clickManufacturerCrossButton();
        await expect(generalInfoTabPage.getManufacturerInput()).toBeVisible();
        await expect(generalInfoTabPage.getManufacturerInput()).toHaveValue("");
    });

    test("Verify model name input field", async ({ page }) => {
        await expect(generalInfoTabPage.getModelTitle()).toBeVisible();
        await expect(generalInfoTabPage.getModelTitle()).toHaveText("Назва моделі");
        await expect(generalInfoTabPage.getModelInput()).toBeVisible();
        await expect(generalInfoTabPage.getModelInput()).toHaveAttribute("placeholder", "Введіть назву моделі");

        let data = ["1234567890123456", "1234567890 12345", "123456789012345 "];
        for (let i = 0; i < 2; ++i) {
            for (const value of data) {
                await generalInfoTabPage.clearModelInput();
                if (i % 2 !== 0) {
                    await copyAndPaste(page, generalInfoTabPage.getModelInput(), value);
                }
                else {
                    await generalInfoTabPage.fillModelInput(value);
                }
                await expect(generalInfoTabPage.getModelErrorMessage()).toBeVisible();
                await expect(generalInfoTabPage.getModelErrorMessage()).toHaveText("У назві моделі може бути не більше 15 символів");
                await generalInfoTabPage.modelErrorMessageIsRed();
                await generalInfoTabPage.modelInputIsHighlighted();
            }
        }

        await generalInfoTabPage.clearModelInput();
        data = [" ", "<>{};^"];
        for (let i = 0; i < 2; ++i) {
            for (const value of data) {
                await generalInfoTabPage.clearModelInput();
                if (i % 2 !== 0) {
                    await copyAndPaste(page, generalInfoTabPage.getModelInput(), value);
                }
                else {
                    await generalInfoTabPage.fillModelInput(value);
                }
                await expect(generalInfoTabPage.getModelInput()).toHaveValue("");
            }
        }

        await generalInfoTabPage.clearModelInput();
        await generalInfoTabPage.fillModelInput("012345678901234");
        await expect(generalInfoTabPage.getModelErrorMessage()).toBeHidden();
    });

    test("Verify technical characteristics section", async ({ page }) => {
        await expect(generalInfoTabPage.getTechCharacteristicsTitle()).toBeVisible();
        await expect(generalInfoTabPage.getTechCharacteristicsTitle()).toHaveText("Технічні характеристики");
        await expect(generalInfoTabPage.getTechCharacteristicsTextArea()).toBeVisible();
        await expect(generalInfoTabPage.getTechCharacteristicsTextArea()).toHaveValue("");

        await generalInfoTabPage.fillTechCharacteristicsTextArea("<>{};^");
        await expect(generalInfoTabPage.getTechCharacteristicsTextArea()).toHaveValue("");
        await generalInfoTabPage.clearTechCharacteristicsTextArea();
        await copyAndPaste(page, generalInfoTabPage.getTechCharacteristicsTextArea(), "<>{};^");
        await expect(generalInfoTabPage.getTechCharacteristicsTextArea()).toHaveValue("");

        const text = 'a'.repeat(9001);
        await generalInfoTabPage.fillTechCharacteristicsTextArea(text);
        expect(await generalInfoTabPage.getTechCharacteristicsTextArea().inputValue()).toHaveLength(9000);
    });

    test("Verify description section", async ({ page }) => {
        await expect(generalInfoTabPage.getDescriptionTitle()).toBeVisible();
        await expect(generalInfoTabPage.getDescriptionTitle()).toHaveText("Детальний опис");
        await expect(generalInfoTabPage.getDescriptionTextArea()).toBeVisible();
        await expect(generalInfoTabPage.getDescriptionTextArea()).toHaveValue("");

        await generalInfoTabPage.fillDescriptionTextArea("<>{};^");
        await expect(generalInfoTabPage.getDescriptionTextArea()).toHaveValue("");
        await copyAndPaste(page, generalInfoTabPage.getDescriptionTextArea(), "<>{};^");
        await expect(generalInfoTabPage.getDescriptionTextArea()).toHaveValue("");

        const text = 'a'.repeat(9001);
        await generalInfoTabPage.fillDescriptionTextArea(text);
        expect(await generalInfoTabPage.getDescriptionTextArea().inputValue()).toHaveLength(9000);
    });

    test("Verify vehicle location division", async ({ page }) => {
        await expect(generalInfoTabPage.getAddressSelectionTitle()).toBeVisible();
        await expect(generalInfoTabPage.getAddressSelectionTitle()).toHaveText("Місце розташування технічного засобу *");
        await expect(generalInfoTabPage.getAddressSelectionLabel()).toBeVisible();
        await expect(generalInfoTabPage.getAddressSelectionLabel()).toHaveText("Виберіть на мапі");

        await generalInfoTabPage.clickNextButton();
        await expect(generalInfoTabPage.getAddressSelectionErrorMessage()).toBeVisible();
        await expect(generalInfoTabPage.getAddressSelectionErrorMessage()).toHaveText("Виберіть коректне місце на мапі України");
        await generalInfoTabPage.addressSelectionErrorMessageIsRed();
        await generalInfoTabPage.addressSelectionLabelIsHighlighted();

        await generalInfoTabPage.clickAddressSelectionButton();
        await expect(generalInfoTabPage.getAddressSelectionPopup()).toBeVisible();

        await expect(generalInfoTabPage.getAddressSelectionPopupTitle()).toBeVisible();
        await expect(generalInfoTabPage.getAddressSelectionPopupTitle()).toHaveText("Техніка на мапі");
        await expect(generalInfoTabPage.getAddressSelectionPopupCloseButton()).toBeVisible();
        await expect(generalInfoTabPage.getAddressSelectionPopupAddressLine()).toBeVisible();
        await expect(generalInfoTabPage.getAddressSelectionPopupAddressLine()).toHaveText(generalInfoTabData.defaultAddress, { timeout: 10000 });
        await expect(generalInfoTabPage.getAddressSelectionPopupMap()).toBeVisible();
        await generalInfoTabPage.clickAddressSelectionPopupApproveButton();
        await expect(generalInfoTabPage.getAddressSelectionLabel()).toHaveText(generalInfoTabData.defaultAddress);

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
    });

    test("Verify \"Скасувати\" button", async ({ page }) => {
        await expect(generalInfoTabPage.getCancelButton()).toBeVisible();
        await expect(generalInfoTabPage.getCancelButton()).toHaveText("Скасувати");

        await generalInfoTabPage.clickCancelButton();
        await generalInfoTabPage.handleConfirmationPopup();
        await mainPage.isOpen();
    });

    test("Verify \"Далі\" button", async ({ page }) => {
        await expect(generalInfoTabPage.getNextButton()).toBeVisible();
        await expect(generalInfoTabPage.getNextButton()).toHaveText("Далі");
        await generalInfoTabPage.clickNextButton();

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
        const tabs = await generalInfoTabPage.getTabs();
        await expect(generalInfoTabPage.getTabNumber(tabs[1])).toBeVisible();
        await expect(generalInfoTabPage.getTabNumber(tabs[1])).toHaveText("2");
        await expect(generalInfoTabPage.getTabName(tabs[1])).toBeVisible();
        await expect(generalInfoTabPage.getTabName(tabs[1])).toHaveText("Фотографії");
        await expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    });
});