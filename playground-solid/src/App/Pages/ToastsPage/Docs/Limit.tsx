import { createSignal } from "solid-js";

import { Button, Toasts, useToastsContext } from "@thewaver/ss-components-solid";
import type { Toast } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { BURST_SIZE, MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSolid.types";
import type { ToastsLimitDocsExampleProps } from "../ToastsPageSolid.types";

const DURATION_MS = 4000;

type Props = ToastsLimitDocsExampleProps;

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
        <>
            <Button
                id={"limitRaise"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Raise one</PageButtonContent>}
                onClick={raise}
            />
            <Button
                id={"limitBurst"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Raise {BURST_SIZE}</PageButtonContent>}
                onClick={() => {
                    for (let index = 0; index < BURST_SIZE; index += 1) raise();
                }}
            />
        </>
    );
};

export const LimitDocsExample = (props: Props) => {
    const queue = createSignal<Toast<ToastDefs>[]>([]);

    const [getQueue, setQueue] = queue;

    return (
        <div class={styles.example}>
            <div class={styles.raiseRow}>
                <Toasts<ToastDefs>
                    toasts={queue}
                    ariaLabel={"Limited notifications"}
                    alignment={"bottom_left"}
                    limit={props.limit}
                    overflow={props.overflow}
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

                <Button
                    id={"limitClear"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Clear</PageButtonContent>}
                    onClick={() => {
                        setQueue([]);
                    }}
                />
            </div>

            <div class={exampleStyles.exampleReadout} data-readout>{`Queued: ${getQueue().length}`}</div>
        </div>
    );
};
