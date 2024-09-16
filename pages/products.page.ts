import { Locator, Page } from "@playwright/test";

export class ProductsPage {
    private readonly page: Page;
    private readonly unitList: Locator;
    private readonly servicesExpandButton: Locator;
    private readonly checkboxListExpandButtons: Locator;
    private readonly filterContainer: Locator;
    private readonly selectedFilters: Locator;
    private readonly unitCount: Locator;

    constructor(page: Page) {
        this.page = page;
        this.unitList = this.page.locator("[class*=\"MapPagination_units_container\"]").getByTestId("cardWrapper");
        this.servicesExpandButton = this.page.getByTestId("filterCaption").last();
        this.checkboxListExpandButtons = this.page.getByTestId('rightArrow');
        this.filterContainer = this.page.locator("[class*=\"ResetFilters_container__\"]");
        this.selectedFilters = this.filterContainer.locator("[class*=\"ResetFilters_selectedCategory___\"]");
        this.unitCount = this.page.locator("h1[class*=\"MapPagination_count\"]");
    }

    async isOpen(): Promise<void> {
        await this.page.waitForURL("**/products/**", { waitUntil: "load" });
    }

    async expandCheckboxLists(): Promise<void> {
        await this.servicesExpandButton.waitFor({ state: "visible" });
        const attributes: null | string = await this.servicesExpandButton.getAttribute("class");
        const classes: undefined | string[] = attributes?.split(" ");
        if (classes && classes.some(cls => cls.startsWith("FilterCaption_rotate__"))) {
            await this.servicesExpandButton.click();
        }

        await this.page.waitForTimeout(1000);
        const arrowButtons = await this.checkboxListExpandButtons.all();
        for (const button of arrowButtons) {
            await button.waitFor({ state: "visible" });
            const buttonAttributes: null | string = await button.getAttribute("class");
            const buttonClasses: undefined | string[] = buttonAttributes?.split(" ");
            if (buttonClasses && !buttonClasses.some(cls => cls.startsWith("ServiceCategory_clicked__"))) {
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
        for (const filter of filters) {
            await filter.waitFor({ state: "visible" });
            const filetName = await filter.innerText();
            if (title === "Сівалки") {
                return filetName.includes("Посівна та садильна техніка");
            }
            else if (title === "Обприскувачі") {
                return filetName.includes("Техніка для поливу та зрошення");
            }
            else if (title === "Дрони") {
                return filetName.includes("Інша сільгосптехніка");
            }
            else if (title === "Дорожня техніка") {
                return filetName.includes("Дорожньо-прибиральна техніка");
            }
            else if (title === "Комунальна техніка") {
                return filetName.includes("інша комунальна техніка");
            }
            else if (title === "Вантажівки") {
                return filetName.includes("Техніка для транспортування");
            }
            else if (title === "Аварійна техніка") {
                return filetName.includes("Аварійні машини");
            }
            else if (title === "Прибиральна техніка") {
                return filetName.includes("Клінінгове обладнання");
            }
            else if (title === "Складська техніка" || title === "Aвтокрани") {
                return true;
            }
            else if (filetName.includes(title)) {
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