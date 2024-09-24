import { Locator, Page, expect } from "@playwright/test";

export class UnitPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async isOpen(title: string): Promise<void> {
        await this.page.waitForLoadState("load");
        await expect(await this.getTitle()).toContain(title);
    }

    getUnitTitle(): Locator {
        return this.page.locator("h1[class*=\"UnitName_name\"]");
    }

    getCharacteristicsService(): Locator {
        return this.page.locator("[class*=\"UnitCharacteristics_services\"]").first();
    }

    getCharacteristicsEquipment(): Locator {
        return this.page.locator("[class*=\"UnitCharacteristics_characteristics_wrapper\"]");
    }

    async containsCharacteristicForServices(characteristic: string): Promise<void> {
        await this.getCharacteristicsService().waitFor({ state: "visible" });
        await expect(this.getCharacteristicsService()).toContainText("Послуги, які надає технічний засіб:");
        await expect(this.getCharacteristicsService()).toContainText(characteristic);
    }

    async containsCharacteristicForEquipment(characteristic: string): Promise<void> {
        await this.getCharacteristicsEquipment().waitFor({ state: "visible" });
        await expect(this.getCharacteristicsEquipment()).toContainText("Основні характеристики");

        const characteristicMap = new Map<string, string>([
            ["Сівалки", "посівні комплекси"],
            ["Трактори", "трактори колісні"],
            ["Екскаватори", "гусеничні екскаватори"],
            ["Обприскувачі", "обприскувачі самохідні"],
            ["Навантажувачі", "навантажувачі телескопічні"],
            ["Комунальні машини", "асенізатори"],
            ["Комбайни", "інші комбайни"],
            ["Дрони", "агродрони"],
            ["Катки", "дорожні катки"],
            ["Вантажівки", "лісовози"],
            ["Техніка для складування", "вилкові навантажувач"],
            ["Aвтокрани", "гусеничні екскаватори"]
        ]);

        if (characteristicMap.has(characteristic)) {
            const expectedText = characteristicMap.get(characteristic) || "undefined";
            await expect(this.getCharacteristicsEquipment()).toContainText(expectedText);
        }
        else {
            await expect(this.getCharacteristicsEquipment()).toContainText(characteristic);
        }
    }

    private async getTitle(): Promise<string> {
        return this.getUnitTitle().innerText();
    }
}