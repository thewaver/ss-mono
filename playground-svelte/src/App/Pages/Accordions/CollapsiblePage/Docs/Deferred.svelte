<script lang="ts">
    import { Collapsible } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import * as collapsibleStyles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

    import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";

    const NOTES = ["Signed for on arrival", "Left with a neighbor", "Returned to the depot"];

    let isBuilt = $state(false);

    const recordBuilt = () => {
        isBuilt = true;
    };
</script>

<div class={collapsibleStyles.docsAccordion}>
    <Collapsible sizing={"fill"} isPanelBuiltOnExpand={true}>
        {#snippet renderTrigger(flags)}
            <PageAccordionHeader {flags}>
                {flags.isExpanded ? "Hide the delivery notes" : "Show the delivery notes"}
            </PageAccordionHeader>
        {/snippet}

        {#snippet renderPanel(visibilityTarget, transitionDurationMs)}
            <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
                <div {@attach recordBuilt}>{NOTES.join(" · ")}</div>
            </PageAccordionPanel>
        {/snippet}
    </Collapsible>
</div>

<div class={styles.exampleReadout}>{`Panel built: ${isBuilt ? "yes" : "not yet"}`}</div>
