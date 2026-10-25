import { Button, Toasts, useToastsContext } from "@thewaver/ss-components-react";
import { MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentReact.types";
import type { ToastsAnimationDocsExampleProps } from "../ToastsPageReact.types";

const DURATION_MS = 4000;

type Props = ToastsAnimationDocsExampleProps;

const Raisers = () => {
    const toasts = useToastsContext<ToastDefs>();

    return (
        <div className={styles.raiseRow}>
            <Button
                id={"animationRaise"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Raise one</PageButtonContent>}
                onClick={() => {
                    toasts.show({
                        value: { kind: "info", message: MESSAGES.info },
                        announcement: MESSAGES.info,
                        durationMs: DURATION_MS,
                    });
                }}
            />
        </div>
    );
};

export const AnimationDocsExample = (props: Props) => (
    <Toasts<ToastDefs>
        ariaLabel={"Animated notifications"}
        alignment={"top_left"}
        transitionDurationMs={props.transitionDurationMs}
        renderToast={(toast, visibilityTarget, transitionDurationMs, state, dismiss) => (
            <PageToastContent
                toast={toast}
                state={state}
                animation={props.animation}
                visibilityTarget={visibilityTarget}
                transitionDurationMs={transitionDurationMs}
                onDismiss={dismiss}
            />
        )}
    >
        <Raisers />
    </Toasts>
);
