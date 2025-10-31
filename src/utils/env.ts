export enum Environment {
    LocalDev = 0,
    Dev = 1,
    Prod = 2,
}

export enum ApiUrl {
    LocalDev = "http://localhost:5000",
    Dev = "http://localhost:5000",
}

export function getCurrentEnv(): Environment {
    const isLocalDev = globalThis.location.hostname.includes("localhost");
    const isDev =
        globalThis.location.hostname.includes("blue-plant-0ec9f5e03.1.azurestaticapps.net");

    if (isLocalDev) return Environment.LocalDev;
    if (isDev) return Environment.Dev;
    throw new Error("Unsupported environment. Check if the url has changed.");
}