<script lang="ts">
    import type { Toast, ToastState } from "@thewaver/ss-components-svelte";
    import { Toasts } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

    import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.svelte";
    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";
    import type { ToastsDurationDocsExampleProps } from "../ToastsPageSvelte.types";
    import DurationRaisers from "./DurationRaisers.svelte";

    type Props = ToastsDurationDocsExampleProps;

    let props: Props = $props();

    let shownCount = $state(0);
    let hiddenCount = $state(0);
</script>

<div class={styles.example}>
    <div class={styles.raiseRow}>
        <Toasts ariaLabel={"Timed notifications"} alignment={"top_right"}>
            <DurationRaisers
                durationMs={props.durationMs}
                onShow={() => {
                    shownCount += 1;
                }}
                onHide={() => {
                    hiddenCount += 1;
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
    </div>

    <div class={exampleStyles.exampleReadout} data-readout>
        {`Shown: ${shownCount}, hidden: ${hiddenCount}`}
    </div>
</div>
