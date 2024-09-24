import { Locator, Page } from "@playwright/test";

export class ProductsPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async isOpen(): Promise<void> {
        await this.page.waitForURL("**/products/**", { waitUntil: "load" });
    }

    getUnitCount(): Locator {
        return this.page.locator("h1[class*=\"MapPagination_count\"]");
    }

    getCheckboxByName(checkboxName: string): Locator {
        return this.page.getByRole("checkbox", { name: checkboxName });
    }

    getServicesExpandButton(): Locator {
        return this.page.getByTestId("filterCaption").last();
    }

    getFilterContainer(): Locator {
        return this.page.locator("[class*=\"ResetFilters_container\"]");
    }

    getServiceWrapper(): Locator {
        return this.page.locator("div[class*=\"Services_wrapper\"]");
    }

    async getSelectedFilters(): Promise<Locator[]> {
        return await this.getFilterContainer().locator("[class*=\"ResetFilters_selectedCategory\"]").all();
    }

    async getCheckboxListExpandButtons(): Promise<Locator[]> {
        return await this.page.getByTestId('rightArrow').all();
    }

    async getUnitList(): Promise<Locator[]> {
        await this.getUnitCount().waitFor({ state: "visible" });
        await this.page.waitForTimeout(1000);
        return await this.page.locator("[class*=\"MapPagination_units_container\"]").getByTestId("cardWrapper").all();
    }

    async getUnitTitle(unit: Locator): Promise<string> {
        return await unit.locator("[class*=\"UnitCard_title\"]").innerText();
    }

    async expandCheckboxLists(): Promise<void> {
        await this.getServicesExpandButton().waitFor({ state: "visible" });
        const attributes: null | string = await this.getServicesExpandButton().getAttribute("class");
        if (attributes?.includes("FilterCaption_rotate")) {
            await this.getServicesExpandButton().click();
        }
        await this.getServiceWrapper().waitFor({ state: "visible" });

        const arrowButtons = await this.getCheckboxListExpandButtons();
        for (const button of arrowButtons) {
            await button.waitFor({ state: "visible" });
            const buttonAttributes: null | string = await button.getAttribute("class");
            if (!buttonAttributes?.includes("ServiceCategory_clicked")) {
                await button.click();
            }
        }
    }

    async isUnitListEmpty(list: Locator[]): Promise<boolean> {
        return list.length === 0 && (await this.getUnitCount().innerText()).includes("Знайдено 0 оголошень на видимій території");
    }

    async findFilterForServices(title: string): Promise<boolean> {
        await this.getFilterContainer().waitFor({ state: "visible" });
        const filters = await this.getSelectedFilters();
        for (const filter of filters) {
            await filter.waitFor({ state: "visible" });
            if ((await filter.innerText()).includes(title)) {
                return true;
            }
        }
        return false;
    }

    async findFilterForEquipments(title: string): Promise<boolean> {
        await this.getFilterContainer().waitFor({ state: "visible" });
        const filters = await this.getSelectedFilters();

        const titleFilterMap = new Map<string, string>([
            ["Сівалки", "Посівна та садильна техніка"],
            ["Обприскувачі", "Техніка для поливу та зрошення"],
            ["Дрони", "Інша сільгосптехніка"],
            ["Дорожня техніка", "Дорожньо-прибиральна техніка"],
            ["Комунальна техніка", "інша комунальна техніка"],
            ["Вантажівки", "Техніка для транспортування"],
            ["Аварійна техніка", "Аварійні машини"],
            ["Прибиральна техніка", "Клінінгове обладнання"]
        ]);

        for (const filter of filters) {
            await filter.waitFor({ state: "visible" });
            const filterName = await filter.innerText();

            if (titleFilterMap.has(title)) {
                const expectedFilter = titleFilterMap.get(title) || "undefined";
                if (filterName.includes(expectedFilter)) {
                    return true;
                }
            } 
            else if (filterName.includes(title)) {
                return true;
            }
        }
        return false;
    }
}