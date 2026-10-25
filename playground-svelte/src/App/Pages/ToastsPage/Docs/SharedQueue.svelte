<script module lang="ts">
    import type { Toast } from "@thewaver/ss-components-svelte";
    import { ToastUtils } from "@thewaver/ss-components-svelte";
    import { OUTSIDE_MESSAGE } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";

    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";

    const DURATION_MS = 8000;

    let queue = $state.raw<Toast<ToastDefs>[]>([]);

    const notifySyncFinished = () => {
        queue = ToastUtils.withRequestedToast(queue, {
            value: { kind: "info", message: OUTSIDE_MESSAGE },
            announcement: OUTSIDE_MESSAGE,
            durationMs: DURATION_MS,
        }).toasts;
    };
</script>

<script lang="ts">
    import type { ToastState } from "@thewaver/ss-components-svelte";
    import { Button, Toasts } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.svelte";
</script>

<div class={styles.example}>
    <div class={styles.raiseRow}>
        <Button id={"sharedQueueRaise"} onClick={notifySyncFinished}>
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Finish a sync</PageButtonContent>
            {/snippet}
        </Button>
        <Button
            id={"sharedQueueClear"}
            onClick={() => {
                queue = [];
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Clear</PageButtonContent>
            {/snippet}
        </Button>
    </div>

    <Toasts bind:toasts={queue} ariaLabel={"Sync notifications"} alignment={"middle_right"}>
        {#snippet renderToast(
            toast: Toast<ToastDefs>,
            visibilityTarget: 0 | 1,
            transitionDurationMs: number,
            state: ToastState,
            dismiss: () => boolean,
        )}
            <PageToastContent {toast} {state} {visibilityTarget} {transitionDurationMs} onDismiss={dismiss} />
        {/snippet}
    </Toasts>

    <div class={exampleStyles.exampleReadout} data-readout>{`Queued: ${queue.length}`}</div>
</div>
