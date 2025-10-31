import {type ReactNode, StrictMode, useEffect, useState} from "react";
import {MsalProvider, useMsalAuthentication} from "@azure/msal-react";
import { InteractionType, InteractionRequiredAuthError} from "@azure/msal-browser";
import {JSONTree} from "react-json-tree";
import {createRoot} from "react-dom/client";
import {OSDUAdmin} from "./ui/OSDUAdmin.tsx";
import {authenticator} from "./utils/authenticator.ts";

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [loggedIn, setLoggedIn] = useState(false);
    console.log("%cloggedIn: ","color:#f0f;", loggedIn);
    const { login, result, error } = useMsalAuthentication(
        InteractionType.Redirect,
        {
            scopes: ["User.Read"],
        }
    );

    useEffect(() => {
        authenticator.refreshCredentials().then((res) => setLoggedIn(res));
    }, [result]);

    useEffect(() => {
        if (error instanceof InteractionRequiredAuthError) {
            login(InteractionType.Redirect, {
                scopes: ["User.Read"],
            });
        }
    }, [error, login]);

    if (loggedIn) {
        return <>{children}</>;
    }
}

try {
    // Async import the auth singleton in order to await the generation of the msal instance.
    if (authenticator.msalInstance) {
        createRoot(document.getElementById("root")!).render(
            <StrictMode>
                <MsalProvider instance={authenticator.msalInstance}>
                    <AuthProvider>
                        <OSDUAdmin />
                    </AuthProvider>
                </MsalProvider>
            </StrictMode>
        );
    }
} catch (error: unknown) {
    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <h3>Failed to authenticate</h3>
            <JSONTree data={error} />
        </StrictMode>
    );
    throw error;
}