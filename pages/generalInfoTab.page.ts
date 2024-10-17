import { Locator, Page, expect } from "@playwright/test";

export class GeneralInfoTabPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async isOpen(): Promise<void> {
        await this.page.waitForURL("/create-unit/", { waitUntil: "load" });
    }

    getAvatarIcon(): Locator {
        return this.page.getByRole("img", { name: "Avatar" }).first();
    }

    getMainInfoTitle(): Locator {
        return this.page.locator("[class*=\"CreateEditFlowLayout_title\"]");
    }

    getCategoryTitle(): Locator {
        return this.page.locator("[class*=\"CategorySelect_title\"]");
    }

    getCategoryButton(): Locator {
        return this.page.getByTestId("buttonDiv");
    }

    getCategoryErrorMessage(): Locator {
        return this.page.locator("[class*=\"CategorySelect_errorTextVisible\"]");
    }

    getCategoryPopup(): Locator {
        return this.page.getByTestId("categoryPopup");
    }

    getPopupTitle(): Locator {
        return this.getCategoryPopup().locator("[class*=\"CategoryPopup_title\"]");
    }

    getPopupCloseIcon(): Locator {
        return this.getCategoryPopup().getByTestId("closeIcon");
    }

    getPopupFirstCategoryItems(): Promise<Locator[]> {
        return this.getCategoryPopup().getByTestId("firstCategoryList").locator("[class*=\"FirstCategoryList_content\"]").all();
    }

    getPopupSecondCategoryItems(): Promise<Locator[]> {
        return this.getCategoryPopup().locator("[class*=\"LevelCategoryList_wrapper\"]").first().locator("[class*=\"SecondCategory_wrapper_unit\"]").all();
    }

    getPopupThirdCategoryItems(): Promise<Locator[]> {
        return this.getCategoryPopup().locator("[class*=\"LevelCategoryList_wrapper\"]").last().locator("[class*=\"ThirdCategory_wrapper_unit\"]").all();
    }

    async categoryErrorMessageIsRed(): Promise<void> {
        await expect(this.getCategoryErrorMessage()).toHaveCSS("color", "rgb(247, 56, 89)");
    }

    async categoryButtonIsHighlighted(): Promise<void> {
        await expect(this.getCategoryButton()).toHaveCSS("border-color", "rgb(247, 56, 89)");
    }

    getCategoryArrowImg(): Locator {
        return this.page.getByAltText("Arrow-down");
    }

    getAnnouncementTitle(): Locator {
        return this.page.locator("[class*=\"CustomInput_title\"]").first();
    }

    getAnnouncementInput(): Locator {
        return this.page.getByTestId("custom-input").first();
    }

    getAnnouncementErrorMessage(): Locator {
        return this.page.getByTestId("descriptionError").first();
    }

    async announcementErrorMessageIsRed(): Promise<void> {
        await expect(this.getAnnouncementErrorMessage()).toHaveCSS("color", "rgb(247, 56, 89)");
    }

    async announcementInputIsHighlighted(): Promise<void> {
        await expect(this.getAnnouncementInput()).toHaveCSS("border-color", "rgb(247, 56, 89)");
    }

    async announcementInputIsNotHighlighted(): Promise<void> {
        await expect(this.getAnnouncementInput()).toHaveCSS("border-color", "rgb(229, 229, 229)");
    }

    getManufacturerTitle(): Locator {
        return this.page.locator("[class*=\"SelectManufacturer_title\"]");
    }

    getManufacturerInput(): Locator {
        return this.page.getByTestId("input-customSelectWithSearch");
    }

    getManufacturerSelectDiv(): Locator {
        return this.page.getByTestId("div-service-customSelectWithSearch");
    }

    getManufacturerInputDiv(): Locator {
        return this.page.locator("[class*=\"CustomSelectWithSearch_searchResult\"]");
    }

    getManufacturerCloseButton(): Locator {
        return this.page.getByTestId("closeButton");
    }

    getManufacturerLoopIcon(): Locator {
        return this.page.locator("[class*=\"CustomSelectWithSearch_searchInput\"]").getByRole("img");
    }

    getManufacturerDropdownList(): Locator {
        return this.page.locator("[class*=\"CustomSelectWithSearch_searchedServicesCat_wrapper\"]");
    }

    async getManufacturerDropdownListItems(): Promise<Locator[]> {
        return await this.getManufacturerDropdownList().locator("[class*=\"CustomSelectWithSearch_flexForServices\"]").all();
    }

    getManufacturerErrorMessage(): Locator {
        return this.page.locator("[class*=\"CustomSelectWithSearch_errorTextVisible\"]");
    }

    async manufacturerErrorMessageIsRed(): Promise<void> {
        await expect(this.getManufacturerErrorMessage()).toHaveCSS("color", "rgb(247, 56, 89)");
    }

    async manufacturerInputIsHighlighted(): Promise<void> {
        await expect(this.getManufacturerInputDiv()).toHaveCSS("border-color", "rgb(247, 56, 89)");
    }

    getModelTitle(): Locator {
        return this.page.locator("[class*=\"CustomInput_title\"]").last();
    }

    getModelInput(): Locator {
        return this.page.getByTestId("custom-input").last();
    }

    getModelErrorMessage(): Locator {
        return this.page.getByTestId("descriptionError").last();
    }

    async modelErrorMessageIsRed(): Promise<void> {
        await expect(this.getModelErrorMessage()).toHaveCSS("color", "rgb(247, 56, 89)");
    }

    async modelInputIsHighlighted(): Promise<void> {
        await expect(this.getModelInput()).toHaveCSS("border-color", "rgb(247, 56, 89)");
    }

    getTechCharacteristicsTitle(): Locator {
        return this.page.locator("[class*=\"CustomTextAriaDescription_title\"]").first();
    }

    getTechCharacteristicsTextArea(): Locator {
        return this.page.getByTestId("textarea-customTextAriaDescription").first();
    }

    getDescriptionTitle(): Locator {
        return this.page.locator("[class*=\"CustomTextAriaDescription_title\"]").last();
    }

    getDescriptionTextArea(): Locator {
        return this.page.getByTestId("textarea-customTextAriaDescription").last();
    }

    getAddressSelectionTitle(): Locator {
        return this.page.locator("[class*=\"AddressSelectionBlock_title\"]");
    }

    getAddressSelectionLabel(): Locator {
        return this.page.getByTestId("mapLabel");
    }

    getAddressSelectionButton(): Locator {
        return this.page.getByRole("button", { name: "Вибрати на мапі" });
    }

    getAddressSelectionPopup(): Locator {
        return this.page.getByTestId("div-mapPopup");
    }

    getAddressSelectionPopupTitle(): Locator {
        return this.page.locator("[class*=\"MapPopup_title\"]");
    }

    getAddressSelectionPopupCloseButton(): Locator {
        return this.page.locator("[class*=\"MapPopup_icon\"]");
    }

    getAddressSelectionPopupAddressLine(): Locator {
        return this.page.getByTestId("address");
    }

    getAddressSelectionPopupMap(): Locator {
        return this.page.locator("#map");
    }

    getAddressSelectionPopupApproveButton(): Locator {
        return this.page.getByRole("button", { name: "Підтвердити вибір" });
    }

    getAddressSelectionErrorMessage(): Locator {
        return this.page.locator("[class*=\"AddressSelectionBlock_errorTextVisible\"]");
    }

    async addressSelectionErrorMessageIsRed(): Promise<void> {
        await expect(this.getAddressSelectionErrorMessage()).toHaveCSS("color", "rgb(247, 56, 89)");
    }

    async addressSelectionLabelIsHighlighted(): Promise<void> {
        await expect(this.getAddressSelectionLabel()).toHaveCSS("border-color", "rgb(247, 56, 89)");
    }

    getCancelButton(): Locator {
        return this.page.getByTestId("prevButton");
    }

    getNextButton(): Locator {
        return this.page.getByTestId("nextButton");
    }

    async getTabs(): Promise<Locator[]> {
        return this.page.getByRole("tablist").getByRole("tab").all();
    }

    getTabNumber(tab: Locator): Locator {
        return tab.getByTestId("labelNumber");
    }

    getTabName(tab: Locator): Locator {
        return tab.locator("[class*=\"CustomLabel_labelTitle\"]");
    }

    async clickNextButton(): Promise<void> {
        await this.getNextButton().click({ force: true });
    }

    async clickCancelButton(): Promise<void> {
        await this.getCancelButton().click();
    }

    async clickCategoryButton(): Promise<void> {
        await this.getCategoryButton().click();
    }

    async clickPopupCloseIcon(): Promise<void> {
        await this.getPopupCloseIcon().click();
    }

    async clickAvatarIcon(): Promise<void> {
        await this.getAvatarIcon().click({ force: true });
    }

    async clickManufacturerCrossButton(): Promise<void> {
        await this.getManufacturerCloseButton().click();
    }

    async clickAddressSelectionButton(): Promise<void> {
        await this.getAddressSelectionButton().click();
    }

    async clickAddressSelectionPopupApproveButton(): Promise<void> {
        await this.getAddressSelectionPopupApproveButton().click();
    }

    async clickAddressSelectionPopupCloseButton(): Promise<void> {
        await this.getAddressSelectionPopupCloseButton().click();
    }

    async fillAnnouncementInput(text: string): Promise<void> {
        await this.getAnnouncementInput().fill(text);
    }

    async fillManufacturerInput(text: string): Promise<void> {
        await this.getManufacturerInput().fill(text);
    }

    async fillModelInput(text: string): Promise<void> {
        await this.getModelInput().fill(text);
    }

    async fillTechCharacteristicsTextArea(text: string): Promise<void> {
        await this.getTechCharacteristicsTextArea().fill(text);
    }

    async fillDescriptionTextArea(text: string): Promise<void> {
        await this.getDescriptionTextArea().fill(text);
    }

    async clearAnnouncementInput(): Promise<void> {
        await this.getAnnouncementInput().clear();
    }

    async clearManufacturerInput(): Promise<void> {
        await this.getManufacturerInput().clear();
    }

    async clearModelInput(): Promise<void> {
        await this.getModelInput().clear();
    }

    async clearTechCharacteristicsTextArea(): Promise<void> {
        await this.getTechCharacteristicsTextArea().clear();
    }

    async handleConfirmationPopup(): Promise<void> {
        const dialog = await this.page.waitForEvent("dialog");
        await dialog.accept();
    }

    async selectNewAddress(): Promise<void> {
        const box = await this.getAddressSelectionPopupMap().boundingBox();
        if (box) {
            const randomX = Math.floor(Math.random() * box.width);
            const randomY = Math.floor(Math.random() * box.height);
            await this.getAddressSelectionPopupMap().click({ position: { x: randomX, y: randomY } });
        }
    }

    async selectCategory(): Promise<void> {
        await this.clickCategoryButton();
        await expect(this.getCategoryPopup()).toBeVisible();

        const firstColumnOptions = await this.getPopupFirstCategoryItems();
        let randomIndex = Math.floor(Math.random() * firstColumnOptions.length);
        const selectedFirstColumnItem = firstColumnOptions[randomIndex];
        await expect(selectedFirstColumnItem).toBeVisible();
        await selectedFirstColumnItem.click();

        const secondColumnOptions = await this.getPopupSecondCategoryItems();
        randomIndex = Math.floor(Math.random() * secondColumnOptions.length);
        const selectedSecondColumnItem = secondColumnOptions[randomIndex];
        await expect(selectedSecondColumnItem).toBeVisible();
        await selectedSecondColumnItem.click();

        const thirdColumnOptions = await this.getPopupThirdCategoryItems();
        randomIndex = Math.floor(Math.random() * thirdColumnOptions.length);
        const selectedThirdColumnItem = thirdColumnOptions[randomIndex];
        const selectedThirdColumnItemText = (await selectedThirdColumnItem.innerText()).toLowerCase();
        await expect(selectedThirdColumnItem).toBeVisible();
        await selectedThirdColumnItem.click();
        await expect(this.getCategoryPopup()).toBeHidden();
        await expect((await this.getCategoryButton().innerText()).toLowerCase()).toEqual(selectedThirdColumnItemText);
    }

    async selectManifacturer(): Promise<void> {
        const characters = "abcdefghijklmnopqrstuvwxyz";
        let randomIndex = Math.floor(Math.random() * characters.length);
        await this.fillManufacturerInput(characters[randomIndex]);
        await expect(this.getManufacturerDropdownList()).toBeVisible();

        const dropdownListItems = await this.getManufacturerDropdownListItems();
        expect(dropdownListItems.length).toBeGreaterThan(0);
        randomIndex = Math.floor(Math.random() * dropdownListItems.length);
        const selectedItem = dropdownListItems[randomIndex];
        const selectedItemText = await selectedItem.innerText();
        await expect(selectedItem).toBeVisible();
        await selectedItem.click();
        await expect(this.getManufacturerDropdownList()).toBeHidden();
        await expect(this.getManufacturerSelectDiv()).toHaveText(selectedItemText);
    }
}