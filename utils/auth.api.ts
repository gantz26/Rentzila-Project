import { APIRequestContext } from "@playwright/test";

let adminAccessToken: string | null = null;

export class AuthAPI {
    private readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async createAdminAccessToken(): Promise<string | null> {
        if (adminAccessToken == null) {
            await this.request.post("https://dev.rentzila.com.ua/api/auth/jwt/create/", {
                data: {
                    email: process.env.ADMIN_EMAIL,
                    password: process.env.ADMIN_PASSWORD
                }
            }).then(async (response) => {
                adminAccessToken = (await response.json()).access;
            });
        }
        return adminAccessToken;
    }

    async findUserBackcall(userName: string, userPhone: string): Promise<boolean> {
        await this.createAdminAccessToken();
        const response = await this.request.get("https://dev.rentzila.com.ua/api/backcall/", {
            headers: {
                Authorization: `Bearer ${adminAccessToken}`
            }
        });
        const responseJson = (await response.json());
        const foundUser = await responseJson.find((entry: { name: string, phone: string }) => {
            return entry.name === userName && entry.phone === userPhone;
        });
        return foundUser !== undefined;
    }
}