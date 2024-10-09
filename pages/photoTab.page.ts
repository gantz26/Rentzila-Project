import { Locator, Page, expect } from "@playwright/test";

export class PhotoTabPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getPhotoTitle(): Locator {
        return this.page.locator("[class*=\"ImagesUnitFlow_title\"]");
    }

    getPopup(): Locator {
        return this.page.locator("[class*=\"PopupLayout_content\"]");
    }

    getPopupMessage(): Locator {
        return this.getPopup().getByTestId("errorPopup");
    }

    getPopupCrossButton(): Locator {
        return this.getPopup().getByTestId("closeIcon");
    }

    getPopupOkButton(): Locator {
        return this.getPopup().locator("[class*=\"ItemButtons_darkBlueBtn\"]");
    }

    getImageUnitParagraph(): Locator {
        return this.page.locator("[class*=\"ImagesUnitFlow_paragraph\"]");
    }

    getImageUnitDescription(): Locator {
        return this.page.getByTestId("description");
    }

    async imageUnitDescriptionIsRed(): Promise<void> {
        await expect(this.getImageUnitDescription()).toHaveCSS("color", "rgb(247, 56, 89)");
    }

    async getImageBlocks(): Promise<Locator[]> {
        return await this.page.getByTestId("imageBlock").all();
    }

    async imageBlockHasImage(imageBlock: Locator): Promise<boolean> {
        const attributes = await imageBlock.getAttribute("class");
        return attributes?.includes("ImagesUnitFlow_imageItemGrayed") || false;
    }

    getAddImageButton(imageBlock: Locator): Locator {
        return imageBlock.getByTestId("clickImage");
    }

    getDeleteImageButton(imageBlock: Locator): Locator {
        return imageBlock.getByTestId("deleteImage");
    }

    getUnitImage(imageBlock: Locator): Locator {
        return imageBlock.getByTestId("unitImage");
    }

    async clickAddImageButton(imageBlock: Locator): Promise<void> {
        await this.getAddImageButton(imageBlock).click();
    }

    async clickDeleteImageButton(imageBlock: Locator): Promise<void> {
        await this.getDeleteImageButton(imageBlock).click();
    }

    async clickPopupCrossButton(): Promise<void> {
        await this.getPopupCrossButton().click();
    }

    async clickPopupOkButton(): Promise<void> {
        await this.getPopupOkButton().click();
    }

    async addImage(imageBlock: Locator, pathToFile: string): Promise<void> {
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.getAddImageButton(imageBlock).click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(pathToFile);
    }
}