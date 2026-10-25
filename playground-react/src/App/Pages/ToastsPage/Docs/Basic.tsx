import { Button, Toasts, useToastsContext } from "@thewaver/ss-components-react";
import { MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs, ToastKind } from "../../../StyledComponents/ToastContent/ToastContentReact.types";

const DURATION_MS = 4000;

const Raisers = () => {
    const toasts = useToastsContext<ToastDefs>();

    const raise = (kind: ToastKind) => {
        toasts.show({
            value: { kind, message: MESSAGES[kind] },
            announcement: MESSAGES[kind],
            durationMs: DURATION_MS,
            ariaLive: kind === "error" ? "assertive" : "polite",
        });
    };

    return (
        <div className={styles.raiseRow}>
            <Button
                id={"raiseInfo"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Info</PageButtonContent>}
                onClick={() => raise("info")}
            />
            <Button
                id={"raiseSuccess"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Success</PageButtonContent>}
                onClick={() => raise("success")}
            />
            <Button
                id={"raiseError"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Error</PageButtonContent>}
                onClick={() => raise("error")}
            />
        </div>
    );
};

export const BasicDocsExample = () => (
    <Toasts<ToastDefs>
        ariaLabel={"Notifications"}
        renderToast={(toast, visibilityTarget, transitionDurationMs, state, dismiss) => (
            <PageToastContent
                toast={toast}
                state={state}
                visibilityTarget={visibilityTarget}
                transitionDurationMs={transitionDurationMs}
                onDismiss={dismiss}
            />
        )}
    >
        <Raisers />
    </Toasts>
);
