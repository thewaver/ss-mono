import { Button, Toasts, useToastsContext } from "@thewaver/ss-components-react";
import { BURST_SIZE, MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentReact.types";
import type { ToastsPlacementDocsExampleProps } from "../ToastsPageReact.types";

const DURATION_MS = 4000;

type Props = ToastsPlacementDocsExampleProps;

const Raisers = () => {
    const toasts = useToastsContext<ToastDefs>();

    const raise = () => {
        toasts.show({
            value: { kind: "info", message: MESSAGES.info },
            announcement: MESSAGES.info,
            durationMs: DURATION_MS,
        });
    };

    return (
        <div className={styles.raiseRow}>
            <Button
                id={"placementRaise"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Raise one</PageButtonContent>}
                onClick={raise}
            />
            <Button
                id={"placementBurst"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Raise {BURST_SIZE}</PageButtonContent>}
                onClick={() => {
                    for (let index = 0; index < BURST_SIZE; index += 1) raise();
                }}
            />
        </div>
    );
};

export const PlacementDocsExample = (props: Props) => (
    <Toasts<ToastDefs>
        ariaLabel={"Placement notifications"}
        alignment={props.alignment}
        flexDirection={props.flexDirection}
        gap={props.gap}
        margins={{
            marginTop: props.margin,
            marginRight: props.margin,
            marginBottom: props.margin,
            marginLeft: props.margin,
        }}
        renderToast={(toast, visibilityTarget, transitionDurationMs, state, dismiss) => (
            <PageToastContent
                toast={toast}
                state={state}
                stacking={props.stacking}
                flexDirection={props.flexDirection}
                gap={props.gap}
                visibilityTarget={visibilityTarget}
                transitionDurationMs={transitionDurationMs}
                onDismiss={dismiss}
            />
        )}
    >
        <Raisers />
    </Toasts>
);
