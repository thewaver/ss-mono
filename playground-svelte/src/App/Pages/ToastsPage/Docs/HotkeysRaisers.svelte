<script lang="ts">
    import { Button, getToastsContext } from "@thewaver/ss-components-svelte";
    import { HOTKEYS_MESSAGE } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";

    const toasts = getToastsContext<ToastDefs>();
</script>

<div class={styles.raiseRow}>
    <Button
        id={"hotkeysRaise"}
        onClick={() => {
            toasts.show({
                value: { kind: "info", message: HOTKEYS_MESSAGE },
                announcement: HOTKEYS_MESSAGE,
            });
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Raise</PageButtonContent>
        {/snippet}
    </Button>
</div>
