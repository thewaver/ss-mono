import { Button, InteractionSettings, Toasts, useToastsContext } from "@thewaver/ss-components-react";
import { HOTKEYS_MESSAGE, OWN_HOTKEYS } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentReact.types";

const Raisers = () => {
    const toasts = useToastsContext<ToastDefs>();

    return (
        <div className={styles.raiseRow}>
            <Button
                id={"hotkeysRaise"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Raise</PageButtonContent>}
                onClick={() => {
                    toasts.show({
                        value: { kind: "info", message: HOTKEYS_MESSAGE },
                        announcement: HOTKEYS_MESSAGE,
                    });
                }}
            />
        </div>
    );
};

export const HotkeysDocsExample = () => (
    <InteractionSettings toastHotkeys={OWN_HOTKEYS}>
        <Toasts<ToastDefs>
            ariaLabel={"Notifications on their own keys"}
            alignment={"top_center"}
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
    </InteractionSettings>
);
