import { createSignal } from "solid-js";

import { Button, Toasts, access, useToastsContext } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSolid.types";
import type { ToastsDurationDocsExampleProps } from "../ToastsPageSolid.types";

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
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Timed</PageButtonContent>}
                onClick={() => raise(access(props.durationMs))}
            />
            <Button
                id={"durationSticky"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Sticky</PageButtonContent>}
                onClick={() => raise(undefined)}
            />
        </>
    );
};

export const DurationDocsExample = (props: Props) => {
    const [getShownCount, setShownCount] = createSignal(0);
    const [getHiddenCount, setHiddenCount] = createSignal(0);

    return (
        <div class={styles.example}>
            <div class={styles.raiseRow}>
                <Toasts<ToastDefs>
                    ariaLabel={"Timed notifications"}
                    alignment={"top_right"}
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
                    <Raisers
                        durationMs={props.durationMs}
                        onShow={() => setShownCount((count) => count + 1)}
                        onHide={() => setHiddenCount((count) => count + 1)}
                    />
                </Toasts>
            </div>

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Shown: ${getShownCount()}, hidden: ${getHiddenCount()}`}
            </div>
        </div>
    );
};
