<script lang="ts">
    import { Collapsible } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

    import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import type { CollapsibleSideDocsExampleProps } from "../CollapsiblePageSvelte.types";

    const PANEL_WIDTH = 220;

    type Props = CollapsibleSideDocsExampleProps;

    let props: Props = $props();
</script>

<div class={styles.sideExample}>
    <Collapsible side={props.side} sizing={"fit-content"}>
        {#snippet renderTrigger(flags)}
            <PageAccordionHeader {flags} side={props.side}>{flags.isExpanded ? "Less" : "More"}</PageAccordionHeader>
        {/snippet}

        {#snippet renderPanel(visibilityTarget, transitionDurationMs)}
            <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
                <div style:width={`${PANEL_WIDTH}px`}>
                    Opens beside its trigger rather than below it, uncovering contents that keep their own width.
                </div>
            </PageAccordionPanel>
        {/snippet}
    </Collapsible>
</div>
