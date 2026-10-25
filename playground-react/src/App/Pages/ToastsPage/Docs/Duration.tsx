import { useState } from "react";

import { Button, Toasts, useToastsContext } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentReact.types";
import type { ToastsDurationDocsExampleProps } from "../ToastsPageReact.types";

type Props = ToastsDurationDocsExampleProps;

type RaisersProps = Props & {
    onShow: () => void;
    onHide: () => void;
};

const Raisers = (props: RaisersProps) => {
    const toasts = useToastsContext<ToastDefs>();

    const raise = (durationMs: number | undefined) => {
        toasts.show({
            value: { kind: "success", message: MESSAGES.success },
            announcement: MESSAGES.success,
            durationMs,
            onShow: props.onShow,
            onHide: props.onHide,
        });
    };

    return (
        <>
            <Button
                id={"durationTimed"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Timed</PageButtonContent>}
                onClick={() => raise(props.durationMs)}
            />
            <Button
                id={"durationSticky"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Sticky</PageButtonContent>}
                onClick={() => raise(undefined)}
            />
        </>
    );
};

export const DurationDocsExample = (props: Props) => {
    const [shownCount, setShownCount] = useState(0);
    const [hiddenCount, setHiddenCount] = useState(0);

    return (
        <div className={styles.example}>
            <div className={styles.raiseRow}>
                <Toasts<ToastDefs>
                    ariaLabel={"Timed notifications"}
                    alignment={"top_right"}
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
                    <Raisers
                        durationMs={props.durationMs}
                        onShow={() => setShownCount((count) => count + 1)}
                        onHide={() => setHiddenCount((count) => count + 1)}
                    />
                </Toasts>
            </div>

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Shown: ${shownCount}, hidden: ${hiddenCount}`}
            </div>
        </div>
    );
};
