<script lang="ts">
    import { Button, Modal } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.svelte";
    import PageModalPanel from "../../../StyledComponents/ModalPanel/PageModalPanel.svelte";
    import type { ModalBasicDocsExampleProps } from "../ModalPageSvelte.types";

    const MODAL_TITLE_ID = "modal-page-title";
    const FOCUS_CAPTIONS = ["Focus 1", "Focus 2", "Focus 3"];

    type Props = ModalBasicDocsExampleProps;

    let props: Props = $props();

    let visibility = $state(false);
</script>

<Button
    id={"openModal"}
    onClick={() => {
        visibility = true;
    }}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Open Modal</PageButtonContent>
    {/snippet}
</Button>

<Modal
    bind:visibility
    alignment={props.alignment}
    transitionDurationMs={props.transitionDurationMs}
    ariaLabelledBy={MODAL_TITLE_ID}
>
    {#snippet renderOverlay(visibilityTarget, transitionDurationMs)}
        <PageModalOverlay {visibilityTarget} {transitionDurationMs} />
    {/snippet}

    {#snippet renderContent(visibilityTarget, transitionDurationMs)}
        <PageModalPanel {visibilityTarget} {transitionDurationMs}>
            <div id={MODAL_TITLE_ID}>I am a Modal.</div>
            <div>And I focus trap!</div>

            <div class={styles.buttons}>
                {#each FOCUS_CAPTIONS as caption (caption)}
                    <Button>
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>{caption}</PageButtonContent>
                        {/snippet}
                    </Button>
                {/each}
            </div>
        </PageModalPanel>
    {/snippet}
</Modal>
