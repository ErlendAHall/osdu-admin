import {
    type AccountInfo,
    type IPublicClientApplication,
    PublicClientApplication,
    type SilentRequest,
} from "@azure/msal-browser";
import { ApiUrl, Environment, getCurrentEnv } from "./env.ts";

export class OSDUMEAuthenticator {
    private _msalInstance: IPublicClientApplication | undefined;
    accessToken: string | undefined;
    clientId: string;
    authority: string;
    redirectUrl: string;
    loggedInUser: AccountInfo | null = null;
    _apiUrl: ApiUrl;

    constructor() {
        this.clientId = "aebbe59e-dc02-486d-95d2-dc0b4d070060";
        this.authority =
            "https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0";
        this.redirectUrl = this.getRedirectUrl();
        this._apiUrl = this.getApiUrlBasedOnEnv();
    }

    /* Creates a MSAL Public Client Application. */
    public async createMsalInstance(): Promise<void> {
        const msalInstance =
            await PublicClientApplication.createPublicClientApplication({
                auth: {
                    clientId: this.clientId,
                    authority: this.authority,
                    redirectUri: this.redirectUrl,
                },
            });
        this._msalInstance = msalInstance;
    }

    /* Handles a refresh of user credentials. */
    public async refreshCredentials() {
        this.loggedInUser = this.msalInstance.getAllAccounts()[0];
        this.accessToken = await this.getAccessToken();
        return Boolean(this.loggedInUser);
    }

    public get msalInstance(): IPublicClientApplication {
        if (!this._msalInstance) throw new Error("MSAL Instance not found");
        return this._msalInstance;
    }

    /* Returns a OAuth redirect url based on current running environment. */
    private getRedirectUrl(): string {
        const env = getCurrentEnv();
        if (env === Environment.LocalDev) {
            return "http://localhost:3000";
        } else if (env === Environment.Dev) {
            return "https://osdumodelexplorer.equinor.com";
        } else if (env === Environment.Prod) {
            return "https://yellow-glacier-0db3b7103.6.azurestaticapps.net";
        }
        throw new Error(
            "Could not determine redirect url based on current environment."
        );
    }

    /* Returns a fresh access token. */
    public async getAccessToken(): Promise<string | undefined> {
        if (!this._msalInstance) {
            throw new Error("Could not obtain a MSAL instance.");
        }

        if (!this.loggedInUser) {
            // TODO: The access token is currently being accessed too early in some scenarios, likely due to asynchronous timing issues.
            // The error throw below is temporarily disabled to prevent breaking functionality. Once the root cause is resolved,
            // re-enable the error throw to ensure that this method fails explicitly when no user is logged in.
            // throw new Error("No logged in user.");
            return undefined;
        }
        const request: SilentRequest = {
            scopes: ["User.Read"],
            account: this.loggedInUser,
            authority: this.authority,
        };

        const acquireResult = await this._msalInstance.acquireTokenSilent(request);
        this.accessToken = acquireResult.accessToken;
        return this.accessToken;
    }

    public getApiUrlBasedOnEnv(): ApiUrl {
        const env = getCurrentEnv();
        if (env === Environment.LocalDev) {
            return ApiUrl.LocalDev;
        } else if (env === Environment.Dev) {
            return ApiUrl.Dev;
        } else if (env === Environment.Prod) {
            //TODO: Change this once Prod API is ready.
            return ApiUrl.Dev;
        } else {
            throw new Error(`Could not determine api url based on the env ${env}`);
        }
    }

    public get apiUrl() {
        return this._apiUrl;
    }

    public set apiUrl(apiUrl: ApiUrl) {
        this._apiUrl = apiUrl;
    }
}

// Construct and export singleton instance.
const authenticator = new OSDUMEAuthenticator();
await authenticator.createMsalInstance();

export { authenticator };