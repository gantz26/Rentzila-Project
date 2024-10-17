import { Page, Locator } from "@playwright/test";

export async function copyAndPaste(page: Page, element: Locator, text: string) {
    await page.evaluate(async (textToInsert) => await navigator.clipboard.writeText(textToInsert), text);
    await element.focus();
    await page.keyboard.press("Control+V");
}