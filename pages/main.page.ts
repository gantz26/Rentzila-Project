import { expect, Locator, Page } from "@playwright/test";

export class MainPage {
    private readonly page: Page;
    private readonly servicesHeader: Locator;
    private readonly equipmentHeader: Locator;
    private readonly categoriesButtons: Locator;
    private readonly proposeButtons: Locator;
    private readonly tabsButtons: Locator;
    private readonly equipmentButtons: Locator;
    private readonly telegramPopup: Locator;
    private readonly telegramPopupCloseButton: Locator;
    private readonly footer: Locator;
    private readonly logo: Locator;
    private readonly footerLogo: Locator;

    private readonly consultationHeader: Locator;
    private readonly orderConsultationButton: Locator;
    private readonly nameInput: Locator;
    private readonly phoneNumberInput: Locator;
    private readonly nameInputErrorMessage: Locator;
    private readonly phoneNumberInputErrorMessage: Locator;

    readonly aboutUsLabel: Locator;
    readonly forBuyersLabel: Locator;
    readonly contactsLabel: Locator;
    readonly privacyPolicy: Locator;
    readonly cookiePolicy: Locator;
    readonly termsConditions: Locator;
    readonly productLink: Locator;
    readonly tendersLink: Locator;
    readonly requestsLink: Locator;
    readonly emailLink: Locator;
    readonly copyRight: Locator;

    private readonly enterButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.servicesHeader = this.page.getByRole("heading", { name: "Послуги" });
        this.equipmentHeader = this.page.getByRole("heading", { name: "Спецтехніка" });
        this.categoriesButtons = this.page.locator("[class*=\"RentzilaProposes_container__\"]").first().locator("[class^=\"RentzilaProposes_service__\"]");
        this.proposeButtons = this.page.locator("[class*=\"RentzilaProposes_container__\"]").first().locator("[class^=\"RentzilaProposes_name\"]");
        this.tabsButtons = this.page.locator("[class*=\"RentzilaProposes_container__\"]").last().locator("[class^=\"RentzilaProposes_service__\"]");
        this.equipmentButtons = this.page.locator("[class*=\"RentzilaProposes_container__\"]").last().locator("[class^=\"RentzilaProposes_name\"]");
        this.telegramPopup = this.page.locator("[data-testid=\"completeTenderRectangle\"]");
        this.telegramPopupCloseButton = this.page.locator("[data-testid=\"crossButton\"]");
        this.footer = this.page.locator("div[class*=\"Footer_footer__\"]");
        this.footerLogo = this.footer.locator("div[data-testid=\"logo\"]").last();
        this.logo = this.page.locator("div[data-testid=\"logo\"]").first();
        this.aboutUsLabel = this.footer.getByTestId("content").filter({ hasText: "Про нас" });
        this.forBuyersLabel = this.footer.locator("[class*=\"RentzilaForBuyers_title\"]").filter({ hasText: "Користувачам" });
        this.contactsLabel = this.footer.locator("[class*=\"RentzilaContacts_title\"]").filter({ hasText: "Контакти" });
        this.privacyPolicy = this.footer.getByRole("link", { name: "Політика конфіденційності" });
        this.cookiePolicy = this.footer.getByRole("link", { name: "Правила використання файлів cookie" });
        this.termsConditions = this.footer.getByRole("link", { name: "Умови доступу та користування" });
        this.productLink = this.footer.getByRole("link", { name: "Оголошення" });
        this.tendersLink = this.footer.getByRole("link", { name: "Тендери" });
        this.requestsLink = this.footer.getByRole("link", { name: "Запити на роботу" });
        this.emailLink = this.footer.locator("[href^=\"mailto:\"]");
        this.copyRight = this.footer.getByTestId("copyright").filter({ hasText: "© 2023 Rentzila. Усі права захищені" });

        this.consultationHeader = this.page.getByRole("heading", { name: "У Вас залишилися питання?" });
        this.orderConsultationButton = this.page.getByRole("button", { name: "Замовити консультацію" });
        this.nameInput = this.page.getByRole("textbox", { name: "Ім'я" });
        this.phoneNumberInput = this.page.getByRole("textbox", { name: "Номер телефону" });
        this.nameInputErrorMessage = this.page.locator("[class*=\"ConsultationForm_error_message\"]").first();
        this.phoneNumberInputErrorMessage = this.page.locator("[class*=\"ConsultationForm_error_message\"]").last();

        this.enterButton = this.page.locator("[class*=\"NavbarAuthBlock_buttonEnter\"]");
    }

    async clickEnterButton(): Promise<void> {
        await this.enterButton.click();
    }

    async open(): Promise<void> {
        await this.page.goto("/", { waitUntil: "load" });
    }

    async getServicesHeader(): Promise<Locator> {
        return this.servicesHeader;
    }

    async getEquipmentHeader(): Promise<Locator> {
        return this.equipmentHeader;
    }

    async getCategoriesButtons(): Promise<Locator[]> {
        return this.categoriesButtons.all();
    }

    async getProposeButtons(): Promise<Locator[]> {
        return this.proposeButtons.all();
    }

    async getTabsButtons(): Promise<Locator[]> {
        return await this.tabsButtons.all();
    }
    
    async getEquipmentButtons(): Promise<Locator[]> {
        return await this.equipmentButtons.all();
    }

    async closeTelegramPopup(): Promise<void> {
        if (await this.telegramPopup.isVisible()) {
            await this.telegramPopupCloseButton.click();
        }
    }

    async scrollDownToConsultationform(): Promise<void> {
        await this.consultationHeader.scrollIntoViewIfNeeded();
        await expect(this.consultationHeader).toBeVisible();
    }

    async scrollDownToFooter(): Promise<void> {
        await this.footer.scrollIntoViewIfNeeded();
        await expect(this.footer).toBeVisible();
        await expect(this.footerLogo).toBeVisible();
        await expect(this.footerLogo).not.toHaveAttribute("href");
    }

    async isOpen(): Promise<void> {
        await this.page.waitForURL("/", { waitUntil: "load" });
    }

    async clickOrderConsultationButton(): Promise<void> {
        await this.orderConsultationButton.waitFor({ state: "visible" });
        await this.orderConsultationButton.click();
    }

    async clickPrivacyPolicy(): Promise<void> {
        await this.privacyPolicy.click();
        await this.page.waitForURL("**/privacy-policy/", { waitUntil: "load" });
        await expect(this.page.url()).toContain("/privacy-policy/");
    }

    async clickCookiePolicy(): Promise<void> {
        await this.cookiePolicy.click();
        await this.page.waitForURL("**/cookie-policy/", { waitUntil: "load" });
        await expect(this.page.url()).toContain("/cookie-policy/");
    }

    async clickTermsConditions(): Promise<void> {
        await this.termsConditions.click();
        await this.page.waitForURL("**/terms-conditions/", { waitUntil: "load" });
        await expect(this.page.url()).toContain("/terms-conditions/");
    }

    async clickProductsLink(): Promise<void> {
        await this.productLink.click();
        await this.page.waitForURL("**/products/", { waitUntil: "load" });
        await expect(this.page.url()).toContain("/products");
    }

    async clickTendersLink(): Promise<void> {
        await this.tendersLink.click();
        await this.page.waitForURL("**/tenders-map/", { waitUntil: "load" });
        await expect(this.page.url()).toContain("/tenders-map/");
    }

    async clickRequestsLink(): Promise<void> {
        await this.requestsLink.click();
        await this.page.waitForURL("**/requests-map/", { waitUntil: "load" });
        await expect(this.page.url()).toContain("/requests-map/");
    }

    async clickLogo(): Promise<void> {
        await this.logo.click();
        await this.isOpen();
    }

    async nameInputIsHighlighted(): Promise<void> {
        await expect(this.nameInput).toHaveCSS("border-top-color", "rgb(247, 56, 89)");
        await expect(this.nameInput).toHaveCSS("border-right-color", "rgb(247, 56, 89)");
        await expect(this.nameInput).toHaveCSS("border-left-color", "rgb(247, 56, 89)");
        await expect(this.nameInput).toHaveCSS("border-bottom-color", "rgb(247, 56, 89)");
    }

    async phoneNumberInputIsHighlighted(): Promise<void> {
        await expect(this.phoneNumberInput).toHaveCSS("border-top-color", "rgb(247, 56, 89)");
        await expect(this.phoneNumberInput).toHaveCSS("border-right-color", "rgb(247, 56, 89)");
        await expect(this.phoneNumberInput).toHaveCSS("border-left-color", "rgb(247, 56, 89)");
        await expect(this.phoneNumberInput).toHaveCSS("border-bottom-color", "rgb(247, 56, 89)");
    }

    async nameInputIsNotHighlighted(): Promise<void> {
        await expect(this.nameInput).not.toHaveCSS("border-top-color", "rgb(247, 56, 89)");
        await expect(this.nameInput).not.toHaveCSS("border-right-color", "rgb(247, 56, 89)");
        await expect(this.nameInput).not.toHaveCSS("border-left-color", "rgb(247, 56, 89)");
        await expect(this.nameInput).not.toHaveCSS("border-bottom-color", "rgb(247, 56, 89)");
    }

    async phoneNumberInputIsNotHighlighted(): Promise<void> {
        await expect(this.phoneNumberInput).not.toHaveCSS("border-top-color", "rgb(247, 56, 89)");
        await expect(this.phoneNumberInput).not.toHaveCSS("border-right-color", "rgb(247, 56, 89)");
        await expect(this.phoneNumberInput).not.toHaveCSS("border-left-color", "rgb(247, 56, 89)");
        await expect(this.phoneNumberInput).not.toHaveCSS("border-bottom-color", "rgb(247, 56, 89)");
    }

    async nameInputHasErrorMessage(message: string): Promise<void> {
        await expect(this.nameInputErrorMessage).toHaveText(message);
    }

    async phoneNumberInputHasErrorMessage(message: string): Promise<void> {
        await expect(this.phoneNumberInputErrorMessage).toHaveText(message);
    }

    async fillNameInput(value: string): Promise<void> {
        await this.nameInput.fill(value);
    }

    async fillPhoneNumberInput(value: string): Promise<void> {
        await this.phoneNumberInput.fill(value);
    }

    async getNameInputValue(): Promise<string> {
        return await this.nameInput.inputValue();
    }

    async getPhoneNumberInputValue(): Promise<string> {
        return await this.phoneNumberInput.inputValue();
    }

    async clickPhoneNumberInput(): Promise<void> {
        await this.phoneNumberInput.click();
    }

    async handlePopup(): Promise<void> {
        const popup = await this.page.waitForEvent("dialog");
        await popup.accept();
    }
}