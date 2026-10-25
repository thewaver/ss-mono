import { Button, Toasts, access, useToastsContext } from "@thewaver/ss-components-solid";
import { BURST_SIZE, MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSolid.types";
import type { ToastsPlacementDocsExampleProps } from "../ToastsPageSolid.types";

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
        <div class={styles.raiseRow}>
            <Button
                id={"placementRaise"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Raise one</PageButtonContent>}
                onClick={raise}
            />
            <Button
                id={"placementBurst"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Raise {BURST_SIZE}</PageButtonContent>}
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
        margins={() => ({
            marginTop: access(props.margin),
            marginRight: access(props.margin),
            marginBottom: access(props.margin),
            marginLeft: access(props.margin),
        })}
        renderToast={(getToast, getVisibilityTarget, getTransitionDurationMs, getState, dismiss) => (
            <PageToastContent
                toast={getToast}
                state={getState}
                stacking={props.stacking}
                flexDirection={props.flexDirection}
                gap={props.gap}
                visibilityTarget={getVisibilityTarget}
                transitionDurationMs={getTransitionDurationMs}
                onDismiss={dismiss}
            />
        )}
    >
        <Raisers />
    </Toasts>
);
