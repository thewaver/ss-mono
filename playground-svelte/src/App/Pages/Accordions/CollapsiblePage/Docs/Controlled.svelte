<script lang="ts">
    import { Button, Collapsible } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

    import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";

    let isExpanded = $state(false);
</script>

<div class={styles.docsAccordion}>
    <Collapsible bind:expanded={isExpanded} sizing={"fit-content"}>
        {#snippet renderTrigger(flags)}
            <PageAccordionHeader {flags}>{flags.isExpanded ? "Show less" : "Show more"}</PageAccordionHeader>
        {/snippet}

        {#snippet renderPanel(visibilityTarget, transitionDurationMs)}
            <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
                <div>Pressing the trigger and the button below both write the same boolean.</div>
            </PageAccordionPanel>
        {/snippet}
    </Collapsible>
</div>

<Button
    onClick={() => {
        isExpanded = !isExpanded;
    }}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Toggle from here</PageButtonContent>
    {/snippet}
</Button>
