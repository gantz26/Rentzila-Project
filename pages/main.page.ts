import { expect, Locator, Page } from "@playwright/test";

export class MainPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open(): Promise<void> {
        await this.page.goto("/", { waitUntil: "load" });
    }

    getServicesHeader(): Locator {
        return this.page.getByRole("heading", { name: "Послуги" });
    }

    getEquipmentHeader(): Locator {
        return this.page.getByRole("heading", { name: "Спецтехніка" });
    }

    async getCategoriesButtons(): Promise<Locator[]> {
        return await this.page.locator("[class*=\"RentzilaProposes_container\"]").first().locator("[class^=\"RentzilaProposes_service\"]").all();
    }

    async getProposeButtons(): Promise<Locator[]> {
        return await this.page.locator("[class*=\"RentzilaProposes_container\"]").first().locator("[class^=\"RentzilaProposes_name\"]").all();
    }

    async getTabsButtons(): Promise<Locator[]> {
        return await this.page.locator("[class*=\"RentzilaProposes_container\"]").last().locator("[class^=\"RentzilaProposes_service\"]").all();
    }
    
    async getEquipmentButtons(): Promise<Locator[]> {
        return await this.page.locator("[class*=\"RentzilaProposes_container\"]").last().locator("[class^=\"RentzilaProposes_name\"]").all();
    }

    getTelegramPopup(): Locator {
        return this.page.locator("[data-testid=\"completeTenderRectangle\"]");
    }

    getTelegramPopupCloseButton(): Locator {
        return this.page.locator("[data-testid=\"crossButton\"]");
    }

    getFooter(): Locator {
        return this.page.locator("div[class*=\"Footer_footer\"]");
    }

    getFooterLogo(): Locator {
        return this.getFooter().locator("div[data-testid=\"logo\"]").last();
    }

    getLogo(): Locator {
        return this.page.locator("div[data-testid=\"logo\"]").first();
    }

    getAboutUsLabel(): Locator {
        return this.getFooter().getByTestId("content").filter({ hasText: "Про нас" });
    }

    getForBuyersLabel(): Locator {
        return this.getFooter().locator("[class*=\"RentzilaForBuyers_title\"]").filter({ hasText: "Користувачам" });
    }

    getContactsLabel(): Locator {
        return this.getFooter().locator("[class*=\"RentzilaContacts_title\"]").filter({ hasText: "Контакти" });
    }

    getPrivacyPolicy(): Locator {
        return this.getFooter().getByRole("link", { name: "Політика конфіденційності" });
    }

    getCookiePolicy(): Locator {
        return this.getFooter().getByRole("link", { name: "Правила використання файлів cookie" });
    }

    getTermsConditions(): Locator {
        return this.getFooter().getByRole("link", { name: "Умови доступу та користування" });
    }

    getProductLink(): Locator {
        return this.getFooter().getByRole("link", { name: "Оголошення" });
    }

    getTendersLink(): Locator {
        return this.getFooter().getByRole("link", { name: "Тендери" });
    }

    getRequestsLink(): Locator {
        return this.getFooter().getByRole("link", { name: "Запити на роботу" });
    }

    getEmailLink(): Locator {
        return this.getFooter().locator("[href^=\"mailto:\"]");
    }

    getCopyRight(): Locator {
        return this.getFooter().getByTestId("copyright").filter({ hasText: "© 2023 Rentzila. Усі права захищені" });
    }

    getConsultationHeader(): Locator {
        return this.page.getByRole("heading", { name: "У Вас залишилися питання?" });
    }

    getOrderConsultationButton(): Locator {
        return this.page.getByRole("button", { name: "Замовити консультацію" });
    }

    getNameInput(): Locator {
        return this.page.getByRole("textbox", { name: "Ім'я" });
    }

    getPhoneNumberInput(): Locator {
        return this.page.getByRole("textbox", { name: "Номер телефону" });
    }

    getNameInputErrorMessage(): Locator {
        return this.page.locator("[class*=\"ConsultationForm_error_message\"]").first();
    }

    getPhoneNumberInputErrorMessage(): Locator {
        return this.page.locator("[class*=\"ConsultationForm_error_message\"]").last();
    }

    async closeTelegramPopup(): Promise<void> {
        if (await this.getTelegramPopup().isVisible()) {
            await this.getTelegramPopupCloseButton().click();
        }
    }

    async scrollDownToConsultationForm(): Promise<void> {
        await this.getConsultationHeader().scrollIntoViewIfNeeded();
        await expect(this.getConsultationHeader()).toBeVisible();
    }

    async scrollDownToFooter(): Promise<void> {
        await this.getFooter().scrollIntoViewIfNeeded();
        await expect(this.getFooter()).toBeVisible();
        await expect(this.getFooterLogo()).toBeVisible();
        await expect(this.getFooterLogo()).not.toHaveAttribute("href");
    }

    async isOpen(): Promise<void> {
        await this.page.waitForURL("/", { waitUntil: "load" });
    }

    async clickOrderConsultationButton(): Promise<void> {
        await this.getOrderConsultationButton().waitFor({ state: "visible" });
        await this.getOrderConsultationButton().click();
    }

    async clickPrivacyPolicy(): Promise<void> {
        await this.getPrivacyPolicy().click();
    }

    async clickCookiePolicy(): Promise<void> {
        await this.getCookiePolicy().click();
    }

    async clickTermsConditions(): Promise<void> {
        await this.getTermsConditions().click();
    }

    async clickProductsLink(): Promise<void> {
        await this.getProductLink().click();
    }

    async clickTendersLink(): Promise<void> {
        await this.getTendersLink().click();
    }

    async clickRequestsLink(): Promise<void> {
        await this.getRequestsLink().click();
    }

    async clickLogo(): Promise<void> {
        await this.getLogo().click();
        await this.isOpen();
    }

    async nameInputIsHighlighted(): Promise<void> {
        await expect(this.getNameInput()).toHaveCSS("border-color", "rgb(247, 56, 89)");
    }

    async phoneNumberInputIsHighlighted(): Promise<void> {
        await expect(this.getPhoneNumberInput()).toHaveCSS("border-color", "rgb(247, 56, 89)");
    }

    async nameInputIsNotHighlighted(): Promise<void> {
        await expect(this.getNameInput()).not.toHaveCSS("border-color", "rgb(247, 56, 89)");
    }

    async phoneNumberInputIsNotHighlighted(): Promise<void> {
        await expect(this.getPhoneNumberInput()).not.toHaveCSS("border-color", "rgb(247, 56, 89)");
    }

    async nameInputHasErrorMessage(message: string): Promise<void> {
        await expect(this.getNameInputErrorMessage()).toHaveText(message);
    }

    async phoneNumberInputHasErrorMessage(message: string): Promise<void> {
        await expect(this.getPhoneNumberInputErrorMessage()).toHaveText(message);
    }

    async fillNameInput(value: string): Promise<void> {
        await this.getNameInput().fill(value);
    }

    async fillPhoneNumberInput(value: string): Promise<void> {
        await this.getPhoneNumberInput().fill(value);
    }

    async getNameInputValue(): Promise<string> {
        return await this.getNameInput().inputValue();
    }

    async getPhoneNumberInputValue(): Promise<string> {
        return await this.getPhoneNumberInput().inputValue();
    }

    async clickPhoneNumberInput(): Promise<void> {
        await this.getPhoneNumberInput().click();
    }

    async handlePopup(): Promise<void> {
        const popup = await this.page.waitForEvent("dialog");
        await popup.accept();
    }
}