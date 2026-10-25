import { Button, Toasts, useToastsContext } from "@thewaver/ss-components-solid";
import { MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSolid.types";
import type { ToastsAnimationDocsExampleProps } from "../ToastsPageSolid.types";

const DURATION_MS = 4000;

type Props = ToastsAnimationDocsExampleProps;

const Raisers = () => {
    const toasts = useToastsContext<ToastDefs>();

    return (
        <div class={styles.raiseRow}>
            <Button
                id={"animationRaise"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Raise one</PageButtonContent>}
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
        renderToast={(getToast, getVisibilityTarget, getTransitionDurationMs, getState, dismiss) => (
            <PageToastContent
                toast={getToast}
                state={getState}
                animation={props.animation}
                visibilityTarget={getVisibilityTarget}
                transitionDurationMs={getTransitionDurationMs}
                onDismiss={dismiss}
            />
        )}
    >
        <Raisers />
    </Toasts>
);
