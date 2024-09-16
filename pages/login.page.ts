import { th } from "@faker-js/faker";
import { Locator, Page } from "@playwright/test";

export class LoginPage {
    private readonly page: Page;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly authorizationContainer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = this.page.getByRole("textbox", { name: "E-mail або номер телефону" });
        this.passwordInput = this.page.getByRole("textbox", { name: "Пароль" });
        this.loginButton = this.page.getByRole("button", { name: "Увійти" }).first();
        this.authorizationContainer = this.page.getByTestId("authorizationContainer");
    }

    async login(email: string | undefined = process.env.USER_EMAIL,
                password: string| undefined = process.env.USER_PASSWORD): Promise<void> {
        await this.emailInput.fill(email || "email");
        await this.passwordInput.fill(password || "password");
        await this.loginButton.click();
        await this.authorizationContainer.waitFor({ state: "hidden" });
        await this.page.waitForLoadState();
    }
}