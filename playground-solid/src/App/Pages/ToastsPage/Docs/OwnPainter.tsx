import { createSignal } from "solid-js";

import { Button, Toasts, useToastsContext } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { DRAFT_DELETED_MESSAGE, MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageToastContent } from "../../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSolid.types";

const DURATION_MS = 4000;
const UNDO_DURATION_MS = 8000;

type RaisersProps = {
    hasDraft: () => boolean;
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
        if (!props.hasDraft()) return;

        props.onDelete();
        toasts.show({
            value: { kind: "error", message: DRAFT_DELETED_MESSAGE },
            announcement: DRAFT_DELETED_MESSAGE,
            durationMs: UNDO_DURATION_MS,
            renderToast: (getToast, getVisibilityTarget, getTransitionDurationMs, getState) => (
                <PageToastContent
                    toast={getToast}
                    state={getState}
                    animation={"slide"}
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                    onDismiss={() => toasts.dismiss(getToast().id)}
                >
                    <div class={styles.raiseRow}>
                        <Button
                            id={"undoDelete"}
                            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Undo</PageButtonContent>}
                            onClick={() => {
                                props.onRestore();
                                toasts.dismiss(getToast().id);
                            }}
                        />
                    </div>
                </PageToastContent>
            ),
        });
    };

    return (
        <div class={styles.raiseRow}>
            <Button
                id={"ownPainterSave"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Save</PageButtonContent>}
                onClick={save}
            />
            <Button
                id={"ownPainterDelete"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Delete draft</PageButtonContent>}
                onClick={deleteDraft}
            />
        </div>
    );
};

export const OwnPainterDocsExample = () => {
    const [getHasDraft, setHasDraft] = createSignal(true);

    return (
        <div class={styles.example}>
            <Toasts<ToastDefs>
                ariaLabel={"Draft notifications"}
                alignment={"bottom_center"}
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
                    hasDraft={getHasDraft}
                    onDelete={() => setHasDraft(false)}
                    onRestore={() => setHasDraft(true)}
                />
            </Toasts>

            <div
                class={exampleStyles.exampleReadout}
                data-readout
            >{`Draft: ${getHasDraft() ? "kept" : "deleted"}`}</div>
        </div>
    );
};
