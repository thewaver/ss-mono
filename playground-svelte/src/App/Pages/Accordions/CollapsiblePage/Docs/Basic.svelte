<script lang="ts">
    import { Collapsible } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

    import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import type { CollapsibleBasicDocsExampleProps } from "../CollapsiblePageSvelte.types";

    type Props = CollapsibleBasicDocsExampleProps;

    let props: Props = $props();
</script>

<div class={[styles.textWithPanel, styles.docsAccordion]}>
    <div>
        Orders leave the warehouse within two working days, and tracking arrives by email as soon as the parcel is
        scanned.
    </div>

    <Collapsible transitionDurationMs={props.transitionDurationMs} sizing={"fit-content"}>
        {#snippet renderTrigger(flags)}
            <PageAccordionHeader {flags}>{flags.isExpanded ? "Show less" : "Show more"}</PageAccordionHeader>
        {/snippet}

        {#snippet renderPanel(visibilityTarget, transitionDurationMs)}
            <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
                <div>
                    Deliveries to the islands take a further two days, and a signature is required for anything above
                    fifty pounds.
                </div>
            </PageAccordionPanel>
        {/snippet}
    </Collapsible>
</div>
