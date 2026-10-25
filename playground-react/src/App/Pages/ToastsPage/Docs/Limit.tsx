import { useState } from "react";

import { Button, Toasts, useToastsContext } from "@thewaver/ss-components-react";
import type { Toast } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { BURST_SIZE, MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentReact.types";
import type { ToastsLimitDocsExampleProps } from "../ToastsPageReact.types";

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
                renderContent={(flags) => <PageButtonContent flags={flags}>Raise one</PageButtonContent>}
                onClick={raise}
            />
            <Button
                id={"limitBurst"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Raise {BURST_SIZE}</PageButtonContent>}
                onClick={() => {
                    for (let index = 0; index < BURST_SIZE; index += 1) raise();
                }}
            />
        </>
    );
};

export const LimitDocsExample = (props: Props) => {
    const queue = useState<Toast<ToastDefs>[]>([]);

    const [queued, setQueue] = queue;

    return (
        <div className={styles.example}>
            <div className={styles.raiseRow}>
                <Toasts<ToastDefs>
                    toasts={queue}
                    ariaLabel={"Limited notifications"}
                    alignment={"bottom_left"}
                    limit={props.limit}
                    overflow={props.overflow}
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

                <Button
                    id={"limitClear"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Clear</PageButtonContent>}
                    onClick={() => {
                        setQueue([]);
                    }}
                />
            </div>

            <div className={exampleStyles.exampleReadout} data-readout>{`Queued: ${queued.length}`}</div>
        </div>
    );
};
