import { useState } from "react";

import { Button, Toasts, useToastsContext } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { DRAFT_DELETED_MESSAGE, MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentReact.types";

const DURATION_MS = 4000;
const UNDO_DURATION_MS = 8000;

type RaisersProps = {
    hasDraft: boolean;
    onDelete: () => void;
    onRestore: () => void;
};

const Raisers = (props: RaisersProps) => {
    const toasts = useToastsContext<ToastDefs>();

    const save = () => {
        toasts.show({
            value: { kind: "success", message: MESSAGES.success },
            announcement: MESSAGES.success,
            durationMs: DURATION_MS,
        });
    };

    const deleteDraft = () => {
        if (!props.hasDraft) return;

        props.onDelete();
        toasts.show({
            value: { kind: "error", message: DRAFT_DELETED_MESSAGE },
            announcement: DRAFT_DELETED_MESSAGE,
            durationMs: UNDO_DURATION_MS,
            renderToast: (toast, visibilityTarget, transitionDurationMs, state) => (
                <PageToastContent
                    toast={toast}
                    state={state}
                    animation={"slide"}
                    visibilityTarget={visibilityTarget}
                    transitionDurationMs={transitionDurationMs}
                    onDismiss={() => toasts.dismiss(toast.id)}
                >
                    <div className={styles.raiseRow}>
                        <Button
                            id={"undoDelete"}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Undo</PageButtonContent>}
                            onClick={() => {
                                props.onRestore();
                                toasts.dismiss(toast.id);
                            }}
                        />
                    </div>
                </PageToastContent>
            ),
        });
    };

    return (
        <div className={styles.raiseRow}>
            <Button
                id={"ownPainterSave"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Save</PageButtonContent>}
                onClick={save}
            />
            <Button
                id={"ownPainterDelete"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Delete draft</PageButtonContent>}
                onClick={deleteDraft}
            />
        </div>
    );
};

export const OwnPainterDocsExample = () => {
    const [hasDraft, setHasDraft] = useState(true);

    return (
        <div className={styles.example}>
            <Toasts<ToastDefs>
                ariaLabel={"Draft notifications"}
                alignment={"bottom_center"}
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
                <Raisers hasDraft={hasDraft} onDelete={() => setHasDraft(false)} onRestore={() => setHasDraft(true)} />
            </Toasts>

            <div className={exampleStyles.exampleReadout} data-readout>{`Draft: ${hasDraft ? "kept" : "deleted"}`}</div>
        </div>
    );
};
