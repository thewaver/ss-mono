<script lang="ts">
    import { Button, getToastsContext } from "@thewaver/ss-components-svelte";
    import { RIGHT_TO_LEFT_MESSAGE } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";

    const DURATION_MS = 4000;

    const toasts = getToastsContext<ToastDefs>();
</script>

<div class={styles.raiseRow}>
    <Button
        id={"rightToLeftRaise"}
        onClick={() => {
            toasts.show({
                value: { kind: "success", message: RIGHT_TO_LEFT_MESSAGE },
                announcement: RIGHT_TO_LEFT_MESSAGE,
                durationMs: DURATION_MS,
            });
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Publish</PageButtonContent>
        {/snippet}
    </Button>
</div>
