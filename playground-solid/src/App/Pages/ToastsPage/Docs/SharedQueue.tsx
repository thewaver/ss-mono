import { createRoot, createSignal } from "solid-js";

import { Button, ToastUtils, Toasts } from "@thewaver/ss-components-solid";
import type { Toast } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { OUTSIDE_MESSAGE } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSolid.types";

const DURATION_MS = 8000;

const queue = createRoot(() => createSignal<Toast<ToastDefs>[]>([]));

const [getQueue, setQueue] = queue;

const notifySyncFinished = () => {
    setQueue(
        (prev) =>
            ToastUtils.withRequestedToast(prev, {
                value: { kind: "info", message: OUTSIDE_MESSAGE },
                announcement: OUTSIDE_MESSAGE,
                durationMs: DURATION_MS,
            }).toasts,
    );
};

export const SharedQueueDocsExample = () => (
    <div class={styles.example}>
        <div class={styles.raiseRow}>
            <Button
                id={"sharedQueueRaise"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Finish a sync</PageButtonContent>}
                onClick={notifySyncFinished}
            />
            <Button
                id={"sharedQueueClear"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Clear</PageButtonContent>}
                onClick={() => {
                    setQueue([]);
                }}
            />
        </div>

        <Toasts<ToastDefs>
            toasts={queue}
            ariaLabel={"Sync notifications"}
            alignment={"middle_right"}
            renderToast={(getToast, getVisibilityTarget, getTransitionDurationMs, getState, dismiss) => (
                <PageToastContent
                    toast={getToast}
                    state={getState}
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                    onDismiss={dismiss}
                />
            )}
        />

        <div class={exampleStyles.exampleReadout} data-readout>{`Queued: ${getQueue().length}`}</div>
    </div>
);
