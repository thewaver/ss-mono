<script lang="ts">
    import { Button } from "@thewaver/ss-components-svelte";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ButtonExampleProps } from "../ButtonPage.types";

    const SAVE_DURATION_MS = 1000;

    type Props = ButtonExampleProps;

    let props: Props = $props();
</script>

<Button
    onClick={() =>
        new Promise<void>((resolve) => {
            setTimeout(() => {
                props.onClick();
                resolve();
            }, SAVE_DURATION_MS);
        })}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>{flags.isPending ? "Saving…" : "Save"}</PageButtonContent>
    {/snippet}
</Button>
