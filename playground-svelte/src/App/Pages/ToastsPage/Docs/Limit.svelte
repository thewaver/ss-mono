<script lang="ts">
    import type { Toast, ToastState } from "@thewaver/ss-components-svelte";
    import { Button, Toasts } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.svelte";
    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";
    import type { ToastsLimitDocsExampleProps } from "../ToastsPageSvelte.types";
    import LimitRaisers from "./LimitRaisers.svelte";

    type Props = ToastsLimitDocsExampleProps;

    let props: Props = $props();

    let queue = $state.raw<Toast<ToastDefs>[]>([]);
</script>

<div class={styles.example}>
    <div class={styles.raiseRow}>
        <Toasts
            bind:toasts={queue}
            ariaLabel={"Limited notifications"}
            alignment={"bottom_left"}
            limit={props.limit}
            overflow={props.overflow}
        >
            <LimitRaisers />

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

        <Button
            id={"limitClear"}
            onClick={() => {
                queue = [];
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Clear</PageButtonContent>
            {/snippet}
        </Button>
    </div>

    <div class={exampleStyles.exampleReadout} data-readout>{`Queued: ${queue.length}`}</div>
</div>
