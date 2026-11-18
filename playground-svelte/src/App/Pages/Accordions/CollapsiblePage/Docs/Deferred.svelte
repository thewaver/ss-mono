<script lang="ts">
    import { Collapsible } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import * as collapsibleStyles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

    import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import PageAccordionWrapper from "../../../../StyledComponents/AccordionContent/PageAccordionWrapper.svelte";
    import { HIDE_DELIVERY_NOTES_TEXT, SHOW_DELIVERY_NOTES_TEXT, DELIVERY_NOTES } from "@thewaver/ss-playground/App/Pages/Accordions/CollapsiblePage/CollapsiblePage.const";

    let isBuilt = $state(false);

    const recordBuilt = () => {
        isBuilt = true;
    };
</script>

<div class={collapsibleStyles.docsAccordion}>
    <Collapsible sizing={"fill"} isPanelBuiltOnExpand={true}>
        {#snippet renderSection(renderContent, flags)}
            <PageAccordionWrapper {flags}>{@render renderContent()}</PageAccordionWrapper>
        {/snippet}

        {#snippet renderTrigger(flags)}
            <PageAccordionHeader {flags}>
                {flags.isExpanded ? HIDE_DELIVERY_NOTES_TEXT : SHOW_DELIVERY_NOTES_TEXT}
            </PageAccordionHeader>
        {/snippet}

        {#snippet renderPanel(visibilityTarget, transitionDurationMs)}
            <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
                <div {@attach recordBuilt}>{DELIVERY_NOTES.join(" · ")}</div>
            </PageAccordionPanel>
        {/snippet}
    </Collapsible>
</div>

<div class={styles.exampleReadout} data-readout>{`Panel built: ${isBuilt ? "yes" : "not yet"}`}</div>
