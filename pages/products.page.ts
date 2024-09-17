import { Locator, Page } from "@playwright/test";

export class ProductsPage {
    private readonly page: Page;
    private readonly unitList: Locator;
    private readonly servicesExpandButton: Locator;
    private readonly checkboxListExpandButtons: Locator;
    private readonly filterContainer: Locator;
    private readonly selectedFilters: Locator;
    private readonly unitCount: Locator;
    private readonly serviceWrapper: Locator;

    constructor(page: Page) {
        this.page = page;
        this.unitList = this.page.locator("[class*=\"MapPagination_units_container\"]").getByTestId("cardWrapper");
        this.servicesExpandButton = this.page.getByTestId("filterCaption").last();
        this.checkboxListExpandButtons = this.page.getByTestId('rightArrow');
        this.filterContainer = this.page.locator("[class*=\"ResetFilters_container__\"]");
        this.selectedFilters = this.filterContainer.locator("[class*=\"ResetFilters_selectedCategory___\"]");
        this.unitCount = this.page.locator("h1[class*=\"MapPagination_count\"]");
        this.serviceWrapper = this.page.locator("div[class*=\"Services_wrapper__KYGgx\"]");
    }

    async isOpen(): Promise<void> {
        await this.page.waitForURL("**/products/**", { waitUntil: "load" });
    }

    async expandCheckboxLists(): Promise<void> {
        await this.servicesExpandButton.waitFor({ state: "visible" });
        const attributes: null | string = await this.servicesExpandButton.getAttribute("class");
        if (attributes?.includes("FilterCaption_rotate")) {
            await this.servicesExpandButton.click();
        }
        await this.serviceWrapper.waitFor({ state: "visible" });

        const arrowButtons = await this.checkboxListExpandButtons.all();
        for (const button of arrowButtons) {
            await button.waitFor({ state: "visible" });
            const buttonAttributes: null | string = await button.getAttribute("class");
            if (!buttonAttributes?.includes("ServiceCategory_clicked")) {
                await button.click();
            }
        }
    }

    async getUnitList(): Promise<Locator[]> {
        await this.unitCount.waitFor({ state: "visible" });
        await this.page.waitForTimeout(1000);
        return await this.unitList.all();
    }

    async isUnitListEmpty(list: Locator[]): Promise<boolean> {
        return list.length === 0 && (await this.unitCount.innerText()).includes("Знайдено 0 оголошень на видимій території");
    }

    async getSelectedFilters(): Promise<Locator[]> {
        return await this.selectedFilters.all();
    }

    async findFilterForServices(title: string): Promise<boolean> {
        await this.filterContainer.waitFor({ state: "visible" });
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
        await this.filterContainer.waitFor({ state: "visible" });
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

    async getUnitTitle(unit: Locator): Promise<string> {
        return await unit.locator("[class*=\"UnitCard_title\"]").innerText();
    }

    async getCheckboxByName(checkboxName: string): Promise<Locator> {
        return await this.page.getByRole("checkbox", { name: checkboxName });
    }
}