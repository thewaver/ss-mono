<script lang="ts">
    import { Button, getToastsContext } from "@thewaver/ss-components-svelte";
    import { BURST_SIZE, MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";

    const DURATION_MS = 4000;

    const toasts = getToastsContext<ToastDefs>();

    const raise = () => {
        toasts.show({
            value: { kind: "info", message: MESSAGES.info },
            announcement: MESSAGES.info,
            durationMs: DURATION_MS,
        });
    };
</script>

<div class={styles.raiseRow}>
    <Button id={"placementRaise"} onClick={raise}>
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Raise one</PageButtonContent>
        {/snippet}
    </Button>
    <Button
        id={"placementBurst"}
        onClick={() => {
            for (let index = 0; index < BURST_SIZE; index += 1) raise();
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Raise {BURST_SIZE}</PageButtonContent>
        {/snippet}
    </Button>
</div>
