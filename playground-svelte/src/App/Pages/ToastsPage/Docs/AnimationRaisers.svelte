<script lang="ts">
    import { Button, getToastsContext } from "@thewaver/ss-components-svelte";
    import { MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";

    const DURATION_MS = 4000;

    const toasts = getToastsContext<ToastDefs>();
</script>

<div class={styles.raiseRow}>
    <Button
        id={"animationRaise"}
        onClick={() => {
            toasts.show({
                value: { kind: "info", message: MESSAGES.info },
                announcement: MESSAGES.info,
                durationMs: DURATION_MS,
            });
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Raise one</PageButtonContent>
        {/snippet}
    </Button>
</div>
