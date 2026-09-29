<script lang="ts">
    import { Button, LiveAnnouncerUtils } from "@thewaver/ss-components-svelte";

    import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ButtonCopyExampleProps } from "../ButtonPage.types";

    const COPIED_MS = 2000;
    const COPIED_ANNOUNCEMENT = "Copied to the clipboard";
    const FAILED_ANNOUNCEMENT = "Could not copy to the clipboard";

    type Props = ButtonCopyExampleProps;

    let props: Props = $props();

    let isCopied = $state(false);

    let copiedTimer: ReturnType<typeof setTimeout> | undefined;

    $effect(() => {
        LiveAnnouncerUtils.reserve("polite");
        LiveAnnouncerUtils.reserve("assertive");

        return () => clearTimeout(copiedTimer);
    });
</script>

<PageControlRow>
    <code>{props.text}</code>

    <Button
        onClick={() =>
            navigator.clipboard.writeText(props.text).then(
                () => {
                    clearTimeout(copiedTimer);
                    isCopied = true;
                    LiveAnnouncerUtils.announce(COPIED_ANNOUNCEMENT);
                    props.onCopy();

                    copiedTimer = setTimeout(() => {
                        isCopied = false;
                    }, COPIED_MS);
                },
                () => {
                    LiveAnnouncerUtils.announce(FAILED_ANNOUNCEMENT, "assertive");
                },
            )}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>
                {flags.isPending ? "Copying…" : isCopied ? "Copied" : "Copy"}
            </PageButtonContent>
        {/snippet}
    </Button>
</PageControlRow>
