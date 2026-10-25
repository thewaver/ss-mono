<script lang="ts">
    import { Button, getToastsContext } from "@thewaver/ss-components-svelte";
    import { MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ToastDefs, ToastKind } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";

    const DURATION_MS = 4000;

    const toasts = getToastsContext<ToastDefs>();

    const raise = (kind: ToastKind) => {
        toasts.show({
            value: { kind, message: MESSAGES[kind] },
            announcement: MESSAGES[kind],
            durationMs: DURATION_MS,
            ariaLive: kind === "error" ? "assertive" : "polite",
        });
    };
</script>

<div class={styles.raiseRow}>
    <Button id={"raiseInfo"} onClick={() => raise("info")}>
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Info</PageButtonContent>
        {/snippet}
    </Button>
    <Button id={"raiseSuccess"} onClick={() => raise("success")}>
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Success</PageButtonContent>
        {/snippet}
    </Button>
    <Button id={"raiseError"} onClick={() => raise("error")}>
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Error</PageButtonContent>
        {/snippet}
    </Button>
</div>
