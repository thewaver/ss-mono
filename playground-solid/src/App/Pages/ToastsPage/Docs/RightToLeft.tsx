import { Button, Toasts, useToastsContext } from "@thewaver/ss-components-solid";
import { RIGHT_TO_LEFT_MESSAGE } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSolid.types";

const DURATION_MS = 4000;

const Raisers = () => {
    const toasts = useToastsContext<ToastDefs>();

    return (
        <div class={styles.raiseRow}>
            <Button
                id={"rightToLeftRaise"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Publish</PageButtonContent>}
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
    </div>
);
