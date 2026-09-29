<script lang="ts">
    import { Button, Modal } from "@thewaver/ss-components-svelte";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.svelte";
    import PageModalPanel from "../../../StyledComponents/ModalPanel/PageModalPanel.svelte";
    import type { ModalExampleProps } from "../ModalPage.types";

    const TEXT_ONLY_TITLE_ID = "modal-page-text-only-title";

    type Props = ModalExampleProps;

    let { visibility = $bindable() }: Props = $props();
</script>

<Button
    onClick={() => {
        visibility = true;
    }}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Open notice</PageButtonContent>
    {/snippet}
</Button>

<Modal bind:visibility ariaLabelledBy={TEXT_ONLY_TITLE_ID}>
    {#snippet renderOverlay(visibilityTarget, transitionDurationMs)}
        <PageModalOverlay {visibilityTarget} {transitionDurationMs} />
    {/snippet}

    {#snippet renderContent(visibilityTarget, transitionDurationMs)}
        <PageModalPanel {visibilityTarget} {transitionDurationMs}>
            <div id={TEXT_ONLY_TITLE_ID}>Nothing in here can be clicked.</div>
            <div>So I hold focus myself. Press Escape to close me.</div>
        </PageModalPanel>
    {/snippet}
</Modal>
