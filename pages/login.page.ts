import { Locator, Page, expect } from "@playwright/test";

export class LoginPage {
    private readonly page: Page;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly authorizationContainer: Locator;
    private readonly emailErrorMessage: Locator;
    private readonly passwordErrorMessage: Locator;
    private readonly hiddenPasswordIcon: Locator;
    private readonly profileIcon: Locator;
    private readonly profileDropdownMenu: Locator;
    private readonly profileDropdownMenuEmail: Locator;
    private readonly profileDropdownMenuLogout: Locator;
    private readonly profileDropdownMenuMyProfile: Locator;
    private readonly enterButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = this.page.getByRole("textbox", { name: "E-mail або номер телефону" });
        this.passwordInput = this.page.getByRole("textbox", { name: "Пароль" });
        this.loginButton = this.page.getByRole("button", { name: "Увійти" }).first();
        this.authorizationContainer = this.page.getByTestId("authorizationContainer");
        this.emailErrorMessage = this.page.locator("[class*=\"CustomReactHookInput_error_message\"]").first();
        this.passwordErrorMessage = this.page.locator("[class*=\"CustomReactHookInput_error_message\"]").last();
        this.hiddenPasswordIcon = this.page.getByTestId("reactHookButton");
        this.profileIcon = this.page.getByTestId("avatarBlock");
        this.profileDropdownMenu = this.page.locator("[class*=\"ProfileDropdownMenu_container\"]");
        this.profileDropdownMenuEmail = this.profileDropdownMenu.getByTestId("email");
        this.profileDropdownMenuLogout = this.profileDropdownMenu.getByTestId("logout");
        this.profileDropdownMenuMyProfile = this.profileDropdownMenu.getByTestId("profile");
        this.enterButton = this.page.locator("[class*=\"NavbarAuthBlock_buttonEnter\"]");
    }
    
    async getAuthorizationForm(): Promise<Locator> {
        return this.authorizationContainer;
    }

    async getEnterButton(): Promise<Locator> {
        return this.enterButton;
    }

    async getProfileDropdownMenu(): Promise<Locator> {
        return this.profileDropdownMenu;
    }

    async getProfileDropdownMenuEmail(): Promise<Locator> {
        return this.profileDropdownMenuEmail;
    }

    async getProfileIcon(): Promise<Locator> {
        return this.profileIcon;
    }

    async getEmailInput(): Promise<Locator> {
        return this.emailInput;
    }

    async getPasswordInput(): Promise<Locator> {
        return this.passwordInput;
    }

    async getEmailMessageError(): Promise<Locator> {
        return this.emailErrorMessage;
    }

    async getPasswordMessageError(): Promise<Locator> {
        return this.passwordErrorMessage;
    }

    async fillEmailInput(email: string | undefined): Promise<void> {
        await this.emailInput.fill(email || "email");
    }

    async clearEmailInput(): Promise<void> {
        await this.emailInput.clear();
    }

    async fillPasswordInput(password: string | undefined): Promise<void> {
        await this.passwordInput.fill(password || "password");
    }

    async clickEnterButton(): Promise<void> {
        await this.enterButton.click();
    }

    async clickLoginbutton(): Promise<void> {
        await this.loginButton.click();
    }

    async clickLogout(): Promise<void> {
        await this.profileDropdownMenuLogout.click();
    }

    async clickMyProfile(): Promise<void> {
        await this.profileDropdownMenuMyProfile.click();
    }

    async clickProfileIcon(): Promise<void> {
        await this.profileIcon.click();
    }

    async clickHiddenPasswprdIcon(): Promise<void> {
        await this.hiddenPasswordIcon.click();
    }

    async pressEnter(): Promise<void> {
        await this.passwordInput.press("Enter");
    }

    async isPasswordHidden(): Promise<boolean> {
        return await this.passwordInput.getAttribute("type") === "password";
    }

    async isPasswordVisible(): Promise<boolean> {
        return await this.passwordInput.getAttribute("type") === "text";
    }

    async login(email: string | undefined = process.env.USER_EMAIL,
                password: string| undefined = process.env.USER_PASSWORD): Promise<void> {
        await this.fillEmailInput(email || "email");
        await this.fillPasswordInput(password || "password");
        await this.clickLoginbutton();
    }

    async waitForAuthorizationFormIsHidden(): Promise<void> {
        await this.authorizationContainer.waitFor({ state: "hidden" });
        await this.page.waitForLoadState();
    }

    async emailInputIsHighlighted(): Promise<void> {
        await expect(this.emailInput).toHaveCSS("border-top-color", "rgb(247, 56, 89)");
        await expect(this.emailInput).toHaveCSS("border-right-color", "rgb(247, 56, 89)");
        await expect(this.emailInput).toHaveCSS("border-left-color", "rgb(247, 56, 89)");
        await expect(this.emailInput).toHaveCSS("border-bottom-color", "rgb(247, 56, 89)");
    }

    async passwordInputIsHighlighted(): Promise<void> {
        await expect(this.passwordInput).toHaveCSS("border-top-color", "rgb(247, 56, 89)");
        await expect(this.passwordInput).toHaveCSS("border-right-color", "rgb(247, 56, 89)");
        await expect(this.passwordInput).toHaveCSS("border-left-color", "rgb(247, 56, 89)");
        await expect(this.passwordInput).toHaveCSS("border-bottom-color", "rgb(247, 56, 89)");
    }

    async emailInputIsNotHighlighted(): Promise<void> {
        await expect(this.emailInput).not.toHaveCSS("border-top-color", "rgb(247, 56, 89)");
        await expect(this.emailInput).not.toHaveCSS("border-right-color", "rgb(247, 56, 89)");
        await expect(this.emailInput).not.toHaveCSS("border-left-color", "rgb(247, 56, 89)");
        await expect(this.emailInput).not.toHaveCSS("border-bottom-color", "rgb(247, 56, 89)");
    }

    async passwordInputIsNotHighlighted(): Promise<void> {
        await expect(this.passwordInput).not.toHaveCSS("border-top-color", "rgb(247, 56, 89)");
        await expect(this.passwordInput).not.toHaveCSS("border-right-color", "rgb(247, 56, 89)");
        await expect(this.passwordInput).not.toHaveCSS("border-left-color", "rgb(247, 56, 89)");
        await expect(this.passwordInput).not.toHaveCSS("border-bottom-color", "rgb(247, 56, 89)");
    }
}