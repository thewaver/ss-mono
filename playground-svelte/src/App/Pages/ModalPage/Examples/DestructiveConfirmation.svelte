<script lang="ts">
    import { Button, Modal } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.svelte";
    import PageModalHint from "../../../StyledComponents/ModalPanel/PageModalHint.svelte";
    import PageModalPanel from "../../../StyledComponents/ModalPanel/PageModalPanel.svelte";
    import type { ModalDestructiveExampleProps } from "../ModalPage.types";

    const ALERT_TITLE_ID = "modal-page-alert-title";
    const ALERT_BODY_ID = "modal-page-alert-body";

    type Props = ModalDestructiveExampleProps;

    let { visibility = $bindable(), ...props }: Props = $props();

    let cancelRef = $state<HTMLElement>();

    const decide = (outcome: string) => {
        props.onDecide(outcome);
        visibility = false;
    };
</script>

<Button
    onClick={() => {
        props.onDecide("nothing decided yet");
        visibility = true;
    }}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Delete the project</PageButtonContent>
    {/snippet}
</Button>

<Modal
    bind:visibility
    role={"alertdialog"}
    initialFocusRef={cancelRef}
    isDismissableOnOverlayClick={false}
    isDismissableOnEscape={false}
    ariaLabelledBy={ALERT_TITLE_ID}
    ariaDescribedBy={ALERT_BODY_ID}
>
    {#snippet renderOverlay(visibilityTarget, transitionDurationMs)}
        <PageModalOverlay {visibilityTarget} {transitionDurationMs} />
    {/snippet}

    {#snippet renderContent(visibilityTarget, transitionDurationMs)}
        <PageModalPanel {visibilityTarget} {transitionDurationMs}>
            <div id={ALERT_TITLE_ID}>Delete this project?</div>

            <PageModalHint id={ALERT_BODY_ID}>
                Clicking the overlay and pressing Escape both do nothing here — an alert has to be answered.
            </PageModalHint>

            <div class={styles.buttons}>
                <Button onClick={() => decide("deleted")}>
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Delete</PageButtonContent>
                    {/snippet}
                </Button>

                <Button bind:ref={cancelRef} onClick={() => decide("canceled")}>
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Cancel</PageButtonContent>
                    {/snippet}
                </Button>
            </div>
        </PageModalPanel>
    {/snippet}
</Modal>
