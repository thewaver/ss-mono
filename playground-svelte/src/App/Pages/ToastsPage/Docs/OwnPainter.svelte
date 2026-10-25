<script lang="ts">
    import type { Toast, ToastState } from "@thewaver/ss-components-svelte";
    import { Toasts } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

    import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.svelte";
    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";
    import OwnPainterRaisers from "./OwnPainterRaisers.svelte";

    let hasDraft = $state(true);
</script>

<div class={styles.example}>
    <Toasts ariaLabel={"Draft notifications"} alignment={"bottom_center"}>
        <OwnPainterRaisers
            {hasDraft}
            onDelete={() => {
                hasDraft = false;
            }}
            onRestore={() => {
                hasDraft = true;
            }}
        />

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

    <div class={exampleStyles.exampleReadout} data-readout>{`Draft: ${hasDraft ? "kept" : "deleted"}`}</div>
</div>
