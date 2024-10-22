import { Locator, Page, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

export class PriceTabPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getPriceTitle(): Locator {
        return this.page.locator("[class*=\"PricesUnitFlow_title\"]");
    }

    getPriceParagraph(): Locator {
        return this.page.locator("[class*=\"PricesUnitFlow_paragraph\"]").first();
    }

    getOrderMinPriceParagraph(): Locator {
        return this.page.locator("[class*=\"PricesUnitFlow_paragraph\"]").nth(1);
    }

    getOrderMinPriceWrapper(): Locator {
        return this.page.locator("[class*=\"PricesUnitFlow_unitPriceWrapper\"]");
    }

    getOrderInputWithErrorDiv(): Locator {
        return this.getOrderMinPriceWrapper().locator("[class*=\"RowUnitPrice_inputWithError\"]");
    }

    getOrderMinPriceDiv(): Locator {
        return this.getOrderInputWithErrorDiv().getByTestId("input_wrapper_RowUnitPrice");
    }

    getOrderMinPriceInput(): Locator {
        return this.getOrderInputWithErrorDiv().getByTestId("priceInput_RowUnitPrice");
    }

    getOrderMinPriceErrorMessage(): Locator {
        return this.getOrderInputWithErrorDiv().locator("[class*=\"RowUnitPrice_error\"]");
    }

    getOrderMinPriceCurrencyDiv(): Locator {
        return this.getOrderMinPriceWrapper().locator("[class*=\"RowUnitPrice_selectorsWrapper\"]");
    }

    getOrderMinPriceCurrencyInput(): Locator {
        return this.getOrderMinPriceCurrencyDiv().getByTestId("priceInput_RowUnitPrice");
    }

    getSelectMethodDiv(): Locator {
        return this.page.getByTestId("div_CustomSelect");
    }

    getSelectMethodDropdownList(): Locator {
        return this.page.getByTestId("listItems-customSelect");
    }

    async getSelectMethodDropdownListItems(): Promise<Locator[]> {
        return await this.getSelectMethodDropdownList().getByTestId("item-customSelect").all();
    }

    getServicePriceParagraph(): Locator {
        return this.page.getByTestId("div_servicePrices_PricesUnitFlow");
    }

    getServicePriceDescription(): Locator {
        return this.page.locator("[class*=\"PricesUnitFlow_description\"]");
    }

    async getServicePriceWrappers(): Promise<Locator[]> {
        return await this.page.locator("[class*=\"ServicePrice_wrapper\"]").all();
    }

    getServiceName(wrapper: Locator): Locator {
        return wrapper.locator("[class*=\"ServicePrice_service_\"]");
    }

    getServiceAddButton(wrapper: Locator): Locator {
        return wrapper.getByTestId("addPriceButton_ServicePrice");
    }

    getServiceDeleteButton(wrapper: Locator): Locator {
        return wrapper.getByTestId("div_removePrice_RowUnitPrice");
    }

    getPluseIconAddButton(wrapper: Locator): Locator {
        return wrapper.getByRole("img");
    }

    getServiceInputWithErrorDiv(wrapper: Locator): Locator {
        return wrapper.locator("[class*=\"RowUnitPrice_inputWithError\"]");
    }

    getServicePriceDiv(wrapper: Locator): Locator {
        return this.getServiceInputWithErrorDiv(wrapper).getByTestId("input_wrapper_RowUnitPrice");
    }

    getServicePriceInput(wrapper: Locator): Locator {
        return this.getServiceInputWithErrorDiv(wrapper).getByTestId("priceInput_RowUnitPrice");
    }

    getServiceSelectorsDiv(wrapper: Locator): Locator {
        return wrapper.locator("[class*=\"RowUnitPrice_selectorsWrapper\"]");
    }

    getServiceCurrencyInput(wrapper: Locator): Locator {
        return this.getServiceSelectorsDiv(wrapper).getByTestId("priceInput_RowUnitPrice");
    }

    getServicePerUnitField(wrapper: Locator): Locator {
        return this.getServiceSelectorsDiv(wrapper).getByTestId("div_CustomSelect").first();
    }

    getServiceShiftField(wrapper: Locator): Locator {
        return this.getServiceSelectorsDiv(wrapper).getByTestId("div_CustomSelect").last();
    }

    getServiceDropdownList(wrapper: Locator): Locator {
        return wrapper.getByTestId("listItems-customSelect");
    }

    async getServicedDropdownListItems(wrapper: Locator): Promise<Locator[]> {
        return await this.getServiceDropdownList(wrapper).getByTestId("item-customSelect").all();
    }

    async orderMinPriceIsRed(): Promise<void> {
        await expect(this.getOrderMinPriceDiv()).toHaveCSS("border-color", "rgb(247, 56, 89)");
    }

    async orderMinPriceIsNotRed(): Promise<void> {
        await expect(this.getOrderMinPriceDiv()).not.toHaveCSS("border-color", "rgb(247, 56, 89)");
    }

    async orderMinPriceErrorMessageIsRed(): Promise<void> {
        await expect(this.getOrderMinPriceErrorMessage()).toHaveCSS("color", "rgb(247, 56, 89)");
    }

    async clickSelectMethodDiv(): Promise<void> {
        await this.getSelectMethodDiv().click();
    }

    async clickServiceAddButton(wrapper: Locator): Promise<void> {
        await this.getServiceAddButton(wrapper).click();
    }

    async clickServiceDeleteButton(wrapper: Locator): Promise<void> {
        await this.getServiceDeleteButton(wrapper).click();
    }

    async clickServicePerUnitField(wrapper: Locator): Promise<void> {
        await this.getServicePerUnitField(wrapper).click();
    }

    async clickServiceShiftField(wrapper: Locator): Promise<void> {
        await this.getServiceShiftField(wrapper).click();
    }

    async fillOrderMinPriceInput(text: string): Promise<void> {
        await this.getOrderMinPriceInput().fill(text);
    }

    async fillServicePriceInput(wrapper: Locator, text: string): Promise<void> {
        await this.getServicePriceInput(wrapper).fill(text);
    }

    async clearOrderMinPriceInput(): Promise<void> {
        await this.getOrderMinPriceInput().clear();
    }

    async clearServicePriceInput(wrapper: Locator): Promise<void> {
        await this.getServicePriceInput(wrapper).clear();
    }

    async selectServicePrice(): Promise<void> {
        await this.clickSelectMethodDiv();
        await expect(this.getSelectMethodDropdownList()).toBeVisible();
        const priceMethods = await this.getSelectMethodDropdownListItems();
        const priceMethodNames = [
            "Готівкою / на картку",
            "Безготівковий розрахунок (без ПДВ)",
            "Безготівковий розрахунок (з ПДВ)"
        ];
        const index = Math.floor(Math.random() * priceMethods.length);
        await priceMethods[index].click();
        await expect(this.getSelectMethodDropdownList()).toBeHidden();
        await expect(this.getSelectMethodDiv()).toHaveText(priceMethodNames[index]);

        await expect(this.getOrderMinPriceDiv()).toBeVisible();
        await expect(this.getOrderMinPriceInput()).toHaveAttribute("placeholder", "Наприклад, 1000");
        const randomValue = faker.number.int({ min: 1000, max: 1000000000 }).toString();
        await this.fillOrderMinPriceInput(randomValue);
        await expect(this.getOrderMinPriceInput()).toHaveValue(randomValue);
    }
}