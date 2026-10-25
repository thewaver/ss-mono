import { Button, Toasts, useToastsContext } from "@thewaver/ss-components-solid";
import { MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs, ToastKind } from "../../../StyledComponents/ToastContent/ToastContentSolid.types";

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
        <div class={styles.raiseRow}>
            <Button
                id={"raiseInfo"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Info</PageButtonContent>}
                onClick={() => raise("info")}
            />
            <Button
                id={"raiseSuccess"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Success</PageButtonContent>}
                onClick={() => raise("success")}
            />
            <Button
                id={"raiseError"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Error</PageButtonContent>}
                onClick={() => raise("error")}
            />
        </div>
    );
};

export const BasicDocsExample = () => (
    <Toasts<ToastDefs>
        ariaLabel={"Notifications"}
        renderToast={(getToast, getVisibilityTarget, getTransitionDurationMs, getState, dismiss) => (
            <PageToastContent
                toast={getToast}
                state={getState}
                visibilityTarget={getVisibilityTarget}
                transitionDurationMs={getTransitionDurationMs}
                onDismiss={dismiss}
            />
        )}
    >
        <Raisers />
    </Toasts>
);
