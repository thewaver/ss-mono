<script lang="ts">
    import { Accordion } from "@thewaver/ss-components-svelte";
    import type { AccordionItem } from "@thewaver/ss-components-svelte";
    import { DOCS_GAP, SCROLLED_SECTION_BODIES } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

    import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import PageAccordionWrapper from "../../../../StyledComponents/AccordionContent/PageAccordionWrapper.svelte";
    import type { AccordionScrolledDocsExampleProps } from "../AccordionPageSvelte.types";

    const ITEMS: AccordionItem<string>[] = [
        { value: "Shipping" },
        { value: "Returns" },
        { value: "Warranty" },
        { value: "Assembly" },
    ];

    type Props = AccordionScrolledDocsExampleProps;

    let props: Props = $props();
</script>

<div class={[styles.scrollBox, styles.docsAccordion]} data-scroll-box="">
    <Accordion items={ITEMS} gap={DOCS_GAP} isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}>
        {#snippet renderSection(renderContent, _, flags)}
            <PageAccordionWrapper {flags}>{@render renderContent()}</PageAccordionWrapper>
        {/snippet}

        {#snippet renderHeader(item, flags)}
            <PageAccordionHeader {flags}>{item.value}</PageAccordionHeader>
        {/snippet}

        {#snippet renderPanel(item, visibilityTarget, transitionDurationMs)}
            <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
                {#each SCROLLED_SECTION_BODIES[item.value] as line (line)}
                    <div>{line}</div>
                {/each}
            </PageAccordionPanel>
        {/snippet}
    </Accordion>
</div>
