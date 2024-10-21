import { Locator, Page, expect } from "@playwright/test";

export class ServiceTabPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getServiceTitle(): Locator {
        return this.page.locator("[class*=\"ServicesUnitFlow_title\"]");
    }

    getServiceParagraph(): Locator {
        return this.page.locator("[class*=\"ServicesUnitFlow_paragraph\"]");
    }

    getServiceDescription(): Locator {
        return this.page.getByTestId("add-info");
    }

    getServiceSelectDiv(): Locator {
        return this.page.getByTestId("searchResult");
    }

    getServiceInput(): Locator {
        return this.getServiceSelectDiv().getByRole("textbox");
    }

    getServiceLoopIcon(): Locator {
        return this.getServiceSelectDiv().getByRole("img");
    }

    getServiceDropdownList(): Locator {
        return this.page.locator("[class*=\"ServicesUnitFlow_searchedServicesCatWrapper\"]");
    }

    async getServiceDropdownListItems(): Promise<Locator[]> {
        return await this.getServiceDropdownList().getByTestId("searchItem-servicesUnitFlow").all();
    }

    getSelectedServicesDescription(): Locator {
        return this.page.locator("[class*=\"ServicesUnitFlow_paragraph\"]").last();
    }

    async getSelectedServices(): Promise<Locator[]> {
        return this.page.getByTestId("item-servicesUnitFlow").all();
    }

    async containService(serviceName: string): Promise<boolean> {
        const dropdownListItems = await this.getSelectedServices();
        for (const item of dropdownListItems) {
            if (await item.innerText() === serviceName) {
                return true;
            }
        }

        return false;
    }

    async serviceDescriptionIsRed(): Promise<void> {
        await expect(this.getServiceDescription()).toHaveCSS("color", "rgb(247, 56, 89)");
    }

    async serviceInputIsHighlighted(): Promise<void> {
        await expect(this.getServiceSelectDiv()).toHaveCSS("border-color", "rgb(247, 56, 89)");
    }

    async fillServiceInput(text: string): Promise<void> {
        await this.getServiceInput().fill(text);
    }

    async selectService(): Promise<string> {
        const characters = "abcdefghijklmnopqrstuvwxyz";
        let randomIndex = Math.floor(Math.random() * characters.length);
        await this.fillServiceInput(characters[randomIndex]);
        await expect(this.getServiceDropdownList()).toBeVisible();

        const dropdownListItems = await this.getServiceDropdownListItems();
        expect(dropdownListItems.length).toBeGreaterThan(0);
        randomIndex = Math.floor(Math.random() * dropdownListItems.length);
        const selectedItem = dropdownListItems[randomIndex];
        const selectedItemText = await selectedItem.innerText();
        await expect(selectedItem).toBeVisible();
        await selectedItem.click();
        await expect(this.getSelectedServicesDescription()).toBeVisible();
        await expect(this.getSelectedServicesDescription()).toHaveText("Послуги, які надає технічний засіб:");
        expect(await this.containService(selectedItemText)).toBeTruthy();
        return selectedItemText;
    }
}