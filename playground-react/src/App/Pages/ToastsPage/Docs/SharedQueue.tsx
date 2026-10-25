import { Button, ToastUtils, Toasts, useStore } from "@thewaver/ss-components-react";
import type { Toast } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { OUTSIDE_MESSAGE } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";
import { StoreUtils } from "@thewaver/ss-utils";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentReact.types";

const DURATION_MS = 8000;

const queue = StoreUtils.create<Toast<ToastDefs>[]>([]);

const notifySyncFinished = () => {
    queue.update(
        (prev) =>
            ToastUtils.withRequestedToast(prev, {
                value: { kind: "info", message: OUTSIDE_MESSAGE },
                announcement: OUTSIDE_MESSAGE,
                durationMs: DURATION_MS,
            }).toasts,
    );
};

export const SharedQueueDocsExample = () => {
    const queued = useStore(queue);

    return (
        <div className={styles.example}>
            <div className={styles.raiseRow}>
                <Button
                    id={"sharedQueueRaise"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Finish a sync</PageButtonContent>}
                    onClick={notifySyncFinished}
                />
                <Button
                    id={"sharedQueueClear"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Clear</PageButtonContent>}
                    onClick={() => {
                        queue.set([]);
                    }}
                />
            </div>

            <Toasts<ToastDefs>
                toasts={[queued, queue.set]}
                ariaLabel={"Sync notifications"}
                alignment={"middle_right"}
                renderToast={(toast, visibilityTarget, transitionDurationMs, state, dismiss) => (
                    <PageToastContent
                        toast={toast}
                        state={state}
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                        onDismiss={dismiss}
                    />
                )}
            />

            <div className={exampleStyles.exampleReadout} data-readout>{`Queued: ${queued.length}`}</div>
        </div>
    );
};
