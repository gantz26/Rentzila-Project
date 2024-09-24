import { Locator, Page, expect } from "@playwright/test";

export class LoginPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    
    getAuthorizationForm(): Locator {
        return this.page.getByTestId("authorizationContainer");
    }

    getErrorMessage(): Locator {
        return this.page.getByTestId("errorMessage");
    }

    getEnterButton(): Locator {
        return this.page.locator("[class*=\"NavbarAuthBlock_buttonEnter\"]");
    }

    getProfileDropdownMenu(): Locator {
        return this.page.locator("[class*=\"ProfileDropdownMenu_container\"]");
    }

    getProfileDropdownMenuMyProfile(): Locator {
        return this.getProfileDropdownMenu().getByTestId("profile");
    }

    getProfileDropdownMenuLogout(): Locator {
        return this.getProfileDropdownMenu().getByTestId("logout");
    }

    getProfileDropdownMenuEmail(): Locator {
        return this.getProfileDropdownMenu().getByTestId("email");
    }

    getProfileIcon(): Locator {
        return this.page.getByTestId("avatarBlock");
    }

    getEmailInput(): Locator {
        return this.page.getByRole("textbox", { name: "E-mail або номер телефону" });
    }

    getPasswordInput(): Locator {
        return this.page.getByRole("textbox", { name: "Пароль" });
    }

    getLoginButton(): Locator {
        return this.page.getByRole("button", { name: "Увійти" }).first();
    }

    getEmailMessageError(): Locator {
        return this.page.locator("[class*=\"CustomReactHookInput_error_message\"]").first();
    }

    getPasswordMessageError(): Locator {
        return this.page.locator("[class*=\"CustomReactHookInput_error_message\"]").last();
    }

    getHiddenPasswordIcon(): Locator {
        return this.page.getByTestId("reactHookButton");
    }

    async fillEmailInput(email: string | undefined): Promise<void> {
        await this.getEmailInput().fill(email || "email");
    }

    async clearEmailInput(): Promise<void> {
        await this.getEmailInput().clear();
    }

    async fillPasswordInput(password: string | undefined): Promise<void> {
        await this.getPasswordInput().fill(password || "password");
    }

    async clickEnterButton(): Promise<void> {
        await this.getEnterButton().click();
    }

    async clickLoginButton(): Promise<void> {
        await this.getLoginButton().click();
    }

    async clickLogout(): Promise<void> {
        await this.getProfileDropdownMenuLogout().click();
    }

    async clickMyProfile(): Promise<void> {
        await this.getProfileDropdownMenuMyProfile().click();
    }

    async clickProfileIcon(): Promise<void> {
        await this.getProfileIcon().click();
    }

    async clickHiddenPasswordIcon(): Promise<void> {
        await this.getHiddenPasswordIcon().click();
    }

    async pressEnter(): Promise<void> {
        await this.getPasswordInput().press("Enter");
    }

    async isPasswordHidden(): Promise<boolean> {
        return await this.getPasswordInput().getAttribute("type") === "password";
    }

    async isPasswordVisible(): Promise<boolean> {
        return await this.getPasswordInput().getAttribute("type") === "text";
    }

    async waitForAuthorizationFormIsHidden(): Promise<void> {
        await this.page.waitForLoadState("networkidle");
        await this.getAuthorizationForm().waitFor({ state: "hidden" });
    }

    async emailInputIsHighlighted(): Promise<void> {
        await expect(this.getEmailInput()).toHaveCSS("border-color", "rgb(247, 56, 89)");
    }

    async passwordInputIsHighlighted(): Promise<void> {
        await expect(this.getPasswordInput()).toHaveCSS("border-color", "rgb(247, 56, 89)");
    }

    async emailInputIsNotHighlighted(): Promise<void> {
        await expect(this.getEmailInput()).not.toHaveCSS("border-color", "rgb(247, 56, 89)");
    }

    async passwordInputIsNotHighlighted(): Promise<void> {
        await expect(this.getPasswordInput()).not.toHaveCSS("border-color", "rgb(247, 56, 89)");
    }
}