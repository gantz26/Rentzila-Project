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
        if (characteristic === "Сівалки") {
            await expect(this.characteristicsEquipment).toContainText("посівні комплекси");
        }
        else if (characteristic === "Трактори") {
            await expect(this.characteristicsEquipment).toContainText("трактори колісні");
        }
        else if (characteristic === "Обприскувачі") {
            await expect(this.characteristicsEquipment).toContainText("обприскувачі самохідні");
        }
        else if (characteristic === "Навантажувачі") {
            await expect(this.characteristicsEquipment).toContainText("навантажувачі телескопічні");
        }
        else if (characteristic === "Комунальні машини") {
            await expect(this.characteristicsEquipment).toContainText("асенізатори");
        }
        else if (characteristic === "Комбайни") {
            await expect(this.characteristicsEquipment).toContainText("інші комбайни");
        }
        else if (characteristic === "Дрони") {
            await expect(this.characteristicsEquipment).toContainText("агродрони");
        }
        else if (characteristic === "Катки") {
            await expect(this.characteristicsEquipment).toContainText("дорожні катки");
        }
        else if (characteristic === "Вантажівки") {
            await expect(this.characteristicsEquipment).toContainText("лісовози");
        }
        else if (characteristic === "Техніка для складування") {
            await expect(this.characteristicsEquipment).toContainText("вилкові навантажувач");
        }
        else {
            await expect(this.characteristicsEquipment).toContainText(characteristic);
        }
    }

    private async getTitle(): Promise<string> {
        return this.unitTitle.innerText();
    }
}