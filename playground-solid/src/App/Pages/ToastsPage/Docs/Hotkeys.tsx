import { Button, InteractionSettings, Toasts, useToastsContext } from "@thewaver/ss-components-solid";
import { HOTKEYS_MESSAGE, OWN_HOTKEYS } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSolid.types";

const Raisers = () => {
    const toasts = useToastsContext<ToastDefs>();

    return (
        <div class={styles.raiseRow}>
            <Button
                id={"hotkeysRaise"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Raise</PageButtonContent>}
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
    </InteractionSettings>
);
