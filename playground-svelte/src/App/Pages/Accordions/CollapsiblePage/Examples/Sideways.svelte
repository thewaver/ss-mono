<script lang="ts">
    import { Collapsible } from "@thewaver/ss-components-svelte";

    import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import type { AccordionSinglePanelExampleProps } from "../../Accordions.types";

    type Props = AccordionSinglePanelExampleProps;

    const PANEL_WIDTH = 220;

    let { expanded = $bindable(false) }: Props = $props();
</script>

<Collapsible bind:expanded sizing={"fit-content"} side={"right"}>
    {#snippet renderTrigger(flags)}
        <PageAccordionHeader {flags}>{flags.isExpanded ? "Less" : "More"}</PageAccordionHeader>
    {/snippet}

    {#snippet renderPanel(visibilityTarget, transitionDurationMs)}
        <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
            <div style:width={`${PANEL_WIDTH}px`}>
                Opens beside its trigger rather than below it, uncovering contents that keep their own width.
            </div>
        </PageAccordionPanel>
    {/snippet}
</Collapsible>
