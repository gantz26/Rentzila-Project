import { Locator, Page, expect } from "@playwright/test";

export class UnitPage {
    private readonly page: Page;
    private readonly unitTitle: Locator;
    private readonly characteristicsService: Locator;
    private readonly characteristicsEquipment: Locator;

    constructor(page: Page) {
        this.page = page;
        this.unitTitle = this.page.locator("h1[class*=\"UnitName_name__\"]");
        this.characteristicsService = this.page.locator("[class*=\"UnitCharacteristics_services\"]").first();
        this.characteristicsEquipment = this.page.locator("[class*=\"UnitCharacteristics_characteristics_wrapper\"]");
    }

    async isOpen(title: string): Promise<void> {
        await this.page.waitForLoadState("load");
        await expect(await this.getTitle()).toContain(title);
    }

    async containsCharacteristicForServices(characteristic: string): Promise<void> {
        await this.characteristicsService.waitFor({ state: "visible" });
        await expect(this.characteristicsService).toContainText("Послуги, які надає технічний засіб:");
        await expect(this.characteristicsService).toContainText(characteristic);
    }

    async containsCharacteristicForEquipment(characteristic: string): Promise<void> {
        await this.characteristicsEquipment.waitFor({ state: "visible" });
        await expect(this.characteristicsEquipment).toContainText("Основні характеристики");

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
            await expect(this.characteristicsEquipment).toContainText(expectedText);
        }
        else {
            await expect(this.characteristicsEquipment).toContainText(characteristic);
        }
    }

    private async getTitle(): Promise<string> {
        return this.unitTitle.innerText();
    }
}