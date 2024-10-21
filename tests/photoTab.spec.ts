import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/main.page.ts';
import { LoginPage } from '../pages/login.page.ts';
import { GeneralInfoTabPage } from '../pages/generalInfoTab.page.ts';
import { PhotoTabPage } from '../pages/photoTab.page.ts';
import { ServiceTabPage } from '../pages/serviceTab.page.ts';
import { faker } from '@faker-js/faker';
import generalInfoTabData from '../data/json/generalInfoTabData.json';
import photoTabData from '../data/json/photoTabData.json';

test.describe("Photo tab", () => {
    let mainPage: MainPage;
    let loginPage: LoginPage;
    let generalInfoTabPage: GeneralInfoTabPage;
    let photoTabPage: PhotoTabPage;
    let serviceTabPage: ServiceTabPage;

    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        loginPage = new LoginPage(page);
        generalInfoTabPage = new GeneralInfoTabPage(page);
        photoTabPage = new PhotoTabPage(page);
        serviceTabPage = new ServiceTabPage(page);
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
        const tabs = await generalInfoTabPage.getTabs();
        await expect(generalInfoTabPage.getTabNumber(tabs[1])).toBeVisible();
        await expect(generalInfoTabPage.getTabNumber(tabs[1])).toHaveText("2");
        await expect(generalInfoTabPage.getTabName(tabs[1])).toBeVisible();
        await expect(generalInfoTabPage.getTabName(tabs[1])).toHaveText("Фотографії");
        await expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    });

    test("Verify same images uploading", async ({ page }) => {
        const imageBlocks = await photoTabPage.getImageBlocks();
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 2; ++j) {
                await photoTabPage.addImage(imageBlocks[j], "./data/photos/photo_1.jpg");
            }
            await expect(photoTabPage.getPopup()).toBeVisible();
            await expect(photoTabPage.getPopupMessage()).toBeVisible();
            await expect(photoTabPage.getPopupMessage()).toHaveText("Ви не можете завантажити двічі один файл.");
    
            switch (i) {
                case 0: {
                    await photoTabPage.clickPopupCrossButton();
                    break;
                }
                case 1: {
                    await expect(photoTabPage.getPopupOkButton()).toBeVisible();
                    await expect(photoTabPage.getPopupOkButton()).toHaveText(photoTabData.POPUP_OK_BUTTON_TEXT);
                    await photoTabPage.clickPopupOkButton();
                    break;
                }
                case 2: {
                    await generalInfoTabPage.clickNextButton();
                    break;
                }
            }
            await expect(photoTabPage.getPopup()).toBeHidden();
            expect(await photoTabPage.imageBlockHasImage(imageBlocks[0])).toBeTruthy();
            for (let j = 1; j < 4; ++j) {
                expect(await photoTabPage.imageBlockHasImage(imageBlocks[j])).toBeFalsy();
            }
            await imageBlocks[0].hover();
            await photoTabPage.clickDeleteImageButton(imageBlocks[0]);
        }
    });

    test("Verify uploading of invalid file type", async ({ page }) => {
        const imageBlocks = await photoTabPage.getImageBlocks();
        for (let i = 0; i < 3; ++i) {
            await photoTabPage.addImage(imageBlocks[0], "./data/photos/invaid_format_photo.avif");
            await expect(photoTabPage.getPopup()).toBeVisible();
            await expect(photoTabPage.getPopupMessage()).toBeVisible();
            await expect(photoTabPage.getPopupMessage()).toHaveText(photoTabData.INVALID_PHOTO_ERROR_MESSAGE);
    
            switch (i) {
                case 0: {
                    await photoTabPage.clickPopupCrossButton();
                    break;
                }
                case 1: {
                    await expect(photoTabPage.getPopupOkButton()).toBeVisible();
                    await expect(photoTabPage.getPopupOkButton()).toHaveText(photoTabData.POPUP_OK_BUTTON_TEXT);
                    await photoTabPage.clickPopupOkButton();
                    break;
                }
                case 2: {
                    await generalInfoTabPage.clickNextButton();
                    break;
                }
            }
            await expect(photoTabPage.getPopup()).toBeHidden();
            for (const imageBlock of imageBlocks) {
                expect(await photoTabPage.imageBlockHasImage(imageBlock)).toBeFalsy();
            }
        }
    });

    test("Verify uploading of invalid size file", async ({ page }) => {
        const imageBlocks = await photoTabPage.getImageBlocks();
        for (let i = 0; i < 3; ++i) {
            await photoTabPage.addImage(imageBlocks[0], "./data/photos/big_photo.jpg");
            await expect(photoTabPage.getPopup()).toBeVisible();
            await expect(photoTabPage.getPopupMessage()).toBeVisible();
            await expect(photoTabPage.getPopupMessage()).toHaveText(photoTabData.INVALID_PHOTO_ERROR_MESSAGE);
    
            switch (i) {
                case 0: {
                    await photoTabPage.clickPopupCrossButton();
                    break;
                }
                case 1: {
                    await expect(photoTabPage.getPopupOkButton()).toBeVisible();
                    await expect(photoTabPage.getPopupOkButton()).toHaveText(photoTabData.POPUP_OK_BUTTON_TEXT);
                    await photoTabPage.clickPopupOkButton();
                    break;
                }
                case 2: {
                    await generalInfoTabPage.clickNextButton();
                    break;
                }
            }
            await expect(photoTabPage.getPopup()).toBeHidden();
            for (const imageBlock of imageBlocks) {
                expect(await photoTabPage.imageBlockHasImage(imageBlock)).toBeFalsy();
            }
        }
    });

    test("Verify \"Назад\" button", async ({ page }) => {
        await expect(generalInfoTabPage.getCancelButton()).toBeVisible();
        await expect(generalInfoTabPage.getCancelButton()).toHaveText("Назад"); 

        await generalInfoTabPage.clickCancelButton();
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

    test("Verify \"Далі\" button", async ({ page }) => {
        await expect(generalInfoTabPage.getNextButton()).toBeVisible();
        await expect(generalInfoTabPage.getNextButton()).toHaveText("Далі");

        await generalInfoTabPage.clickNextButton();
        await expect(photoTabPage.getPhotoTitle()).toBeVisible();
        await expect(photoTabPage.getPhotoTitle()).toHaveText("Фотографії");
        await photoTabPage.imageUnitDescriptionIsRed();

        const imageBlocks = await photoTabPage.getImageBlocks();
        await photoTabPage.addImage(imageBlocks[0], "./data/photos/photo_1.jpg");
        await generalInfoTabPage.clickNextButton();
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

    test("Verify image uploading", async ({ page }) => {
        await expect(photoTabPage.getImageUnitParagraph()).toBeVisible();
        await expect(photoTabPage.getImageUnitParagraph()).toHaveText("Фото технічного засобу *");
        await expect(photoTabPage.getImageUnitDescription()).toBeVisible();
        await expect(photoTabPage.getImageUnitDescription()).toHaveText(photoTabData.IMAGE_UNIT_DESCRIPTION_TEXT);

        const imageBlocks = await photoTabPage.getImageBlocks();
        for (let i = 0; i < 3; ++i) {
            await photoTabPage.addImage(imageBlocks[i], `./data/photos/photo_${i + 1}.jpg`);
            expect(await photoTabPage.imageBlockHasImage(imageBlocks[i])).toBeTruthy();
        }
    });

    test("Verify image moving", async ({ page }) => {
        await expect(photoTabPage.getImageUnitParagraph()).toBeVisible();
        await expect(photoTabPage.getImageUnitParagraph()).toHaveText("Фото технічного засобу *");
        await expect(photoTabPage.getImageUnitDescription()).toBeVisible();
        await expect(photoTabPage.getImageUnitDescription()).toHaveText(photoTabData.IMAGE_UNIT_DESCRIPTION_TEXT);

        const imageBlocks = await photoTabPage.getImageBlocks();
        for (let i = 0; i < 3; ++i) {
            await photoTabPage.addImage(imageBlocks[i], `./data/photos/photo_${i + 1}.jpg`);
            expect(await photoTabPage.imageBlockHasImage(imageBlocks[i])).toBeTruthy();
        }

        const firstImageSrc = await photoTabPage.getUnitImage(imageBlocks[0]).getAttribute("src") || "NotFound";
        const secondImageSrc = await photoTabPage.getUnitImage(imageBlocks[1]).getAttribute("src") || "NotFound";
        await imageBlocks[1].dragTo(imageBlocks[0]);
        await expect(photoTabPage.getUnitImage(imageBlocks[0])).toHaveAttribute("src", secondImageSrc);
        await expect(photoTabPage.getUnitImage(imageBlocks[1])).toHaveAttribute("src", firstImageSrc);
    });

    test("Verify image deleting", async ({ page }) => {
        await expect(photoTabPage.getImageUnitParagraph()).toBeVisible();
        await expect(photoTabPage.getImageUnitParagraph()).toHaveText("Фото технічного засобу *");
        await expect(photoTabPage.getImageUnitDescription()).toBeVisible();
        await expect(photoTabPage.getImageUnitDescription()).toHaveText(photoTabData.IMAGE_UNIT_DESCRIPTION_TEXT);

        const imageBlocks = await photoTabPage.getImageBlocks();
        for (let i = 0; i < 3; ++i) {
            await photoTabPage.addImage(imageBlocks[i], `./data/photos/photo_${i + 1}.jpg`);
            expect(await photoTabPage.imageBlockHasImage(imageBlocks[i])).toBeTruthy();
        }

        for (let i = 0; i < 3; ++i) {
            await imageBlocks[0].hover();
            await photoTabPage.clickDeleteImageButton(imageBlocks[0]);
        }
        for (let i = 0; i < 3; ++i) {
            expect(await photoTabPage.imageBlockHasImage(imageBlocks[i])).toBeFalsy();
        }
    });
});