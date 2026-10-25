import { Button, Toasts, useToastsContext } from "@thewaver/ss-components-react";
import { RIGHT_TO_LEFT_MESSAGE } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentReact.types";

const DURATION_MS = 4000;

const Raisers = () => {
    const toasts = useToastsContext<ToastDefs>();

    return (
        <div className={styles.raiseRow}>
            <Button
                id={"rightToLeftRaise"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Publish</PageButtonContent>}
                onClick={() => {
                    toasts.show({
                        value: { kind: "success", message: RIGHT_TO_LEFT_MESSAGE },
                        announcement: RIGHT_TO_LEFT_MESSAGE,
                        durationMs: DURATION_MS,
                    });
                }}
            />
        </div>
    );
};

export const RightToLeftDocsExample = () => (
    <div dir={"rtl"}>
        <Toasts<ToastDefs>
            ariaLabel={"Publishing notifications"}
            alignment={"middle_left"}
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
    </div>
);
