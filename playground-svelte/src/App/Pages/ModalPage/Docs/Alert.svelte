<script lang="ts">
    import { Button, Modal } from "@thewaver/ss-components-svelte";
    import { NOTHING_DECIDED } from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.css";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.svelte";
    import PageModalHint from "../../../StyledComponents/ModalPanel/PageModalHint.svelte";
    import PageModalPanel from "../../../StyledComponents/ModalPanel/PageModalPanel.svelte";
    import type { ModalAlertDocsExampleProps } from "../ModalPageSvelte.types";

    const ALERT_TITLE_ID = "modal-page-alert-title";
    const ALERT_BODY_ID = "modal-page-alert-body";

    type Props = ModalAlertDocsExampleProps;

    let props: Props = $props();

    let visibility = $state(false);
    let outcome = $state(NOTHING_DECIDED);
    let cancelRef = $state<HTMLElement>();

    const decide = (next: string) => {
        outcome = next;
        visibility = false;
    };
</script>

<Button
    id={"openAlert"}
    onClick={() => {
        outcome = NOTHING_DECIDED;
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
    isDismissableOnOverlayClick={props.isDismissableOnOverlayClick}
    isDismissableOnEscape={props.isDismissableOnEscape}
    ariaLabelledBy={ALERT_TITLE_ID}
    ariaDescribedBy={ALERT_BODY_ID}
>
    {#snippet renderOverlay(visibilityTarget, transitionDurationMs)}
        <PageModalOverlay {visibilityTarget} {transitionDurationMs} />
    {/snippet}

    {#snippet renderContent(visibilityTarget, transitionDurationMs)}
        <PageModalPanel {visibilityTarget} {transitionDurationMs}>
            <div id={ALERT_TITLE_ID}>Delete this project?</div>

            <PageModalHint id={ALERT_BODY_ID}>Everything in it goes, and it cannot be undone.</PageModalHint>

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

<div class={exampleStyles.exampleReadout} data-readout>{`Outcome: ${outcome}`}</div>
