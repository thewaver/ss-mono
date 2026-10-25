<script lang="ts">
    import type { Toast, ToastState } from "@thewaver/ss-components-svelte";
    import { Button, getToastsContext } from "@thewaver/ss-components-svelte";
    import { DRAFT_DELETED_MESSAGE, MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.svelte";
    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";
    import type { ToastsOwnPainterRaisersProps } from "../ToastsPageSvelte.types";

    const DURATION_MS = 4000;
    const UNDO_DURATION_MS = 8000;

    let props: ToastsOwnPainterRaisersProps = $props();

    const toasts = getToastsContext<ToastDefs>();

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
            renderToast: undoToast,
        });
    };
</script>

{#snippet undoToast(toast: Toast<ToastDefs>, visibilityTarget: 0 | 1, transitionDurationMs: number, state: ToastState)}
    <PageToastContent
        {toast}
        {state}
        animation={"slide"}
        {visibilityTarget}
        {transitionDurationMs}
        onDismiss={() => toasts.dismiss(toast.id)}
    >
        <div class={styles.raiseRow}>
            <Button
                id={"undoDelete"}
                onClick={() => {
                    props.onRestore();
                    toasts.dismiss(toast.id);
                }}
            >
                {#snippet renderContent(flags)}
                    <PageButtonContent {flags}>Undo</PageButtonContent>
                {/snippet}
            </Button>
        </div>
    </PageToastContent>
{/snippet}

<div class={styles.raiseRow}>
    <Button id={"ownPainterSave"} onClick={save}>
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Save</PageButtonContent>
        {/snippet}
    </Button>
    <Button id={"ownPainterDelete"} onClick={deleteDraft}>
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Delete draft</PageButtonContent>
        {/snippet}
    </Button>
</div>
