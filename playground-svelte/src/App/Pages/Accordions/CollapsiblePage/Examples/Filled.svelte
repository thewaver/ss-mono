<script lang="ts">
    import { Collapsible } from "@thewaver/ss-components-svelte";

    import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import type { AccordionSinglePanelExampleProps } from "../../Accordions.types";

    type Props = AccordionSinglePanelExampleProps;

    const NOTES = ["Signed for on arrival", "Left with a neighbor", "Returned to the depot"];

    let { expanded = $bindable(false) }: Props = $props();
</script>

<Collapsible bind:expanded sizing={"fill"} isPanelBuiltOnExpand={true}>
    {#snippet renderTrigger(flags)}
        <PageAccordionHeader {flags}>
            {flags.isExpanded ? "Hide the delivery notes" : "Show the delivery notes"}
        </PageAccordionHeader>
    {/snippet}

    {#snippet renderPanel(visibilityTarget, transitionDurationMs)}
        <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
            <div>{NOTES.join(" · ")}</div>
        </PageAccordionPanel>
    {/snippet}
</Collapsible>
