import { Locator, Page, expect } from "@playwright/test";

export class ContactTabPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getContactTitle(): Locator {
        return this.page.locator("[class*=\"AuthContactCard_title\"]");
    }
}