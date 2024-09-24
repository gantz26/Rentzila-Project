import { Locator, Page } from "@playwright/test";

export class ProfilePage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async isOpen(): Promise<void> {
        await this.page.waitForURL("/owner-cabinet/", { waitUntil: "load" });
    }

    getPhoneNumberInput(): Locator {
        return this.page.getByTestId("input_OwnerProfileNumber");
    }

    getPhoneVerificationLabel(): Locator {
        return this.page.getByTestId("verification_OwnerProfileNumber");
    }

    getLogoutButton(): Locator {
        return this.page.getByTestId("logOut");
    }

    async getPhoneNumberValue(): Promise<string> {
        return (await this.getPhoneNumberInput().inputValue()).replace(/ /g, "");
    }

    async clickLogout(): Promise<void> {
        await this.getLogoutButton().click();
    }
}