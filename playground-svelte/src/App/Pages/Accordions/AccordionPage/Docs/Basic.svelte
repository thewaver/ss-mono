<script lang="ts">
    import { Accordion } from "@thewaver/ss-components-svelte";
    import type { AccordionItem } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

    import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import PageAccordionWrapper from "../../../../StyledComponents/AccordionContent/PageAccordionWrapper.svelte";
    import type { AccordionBasicDocsExampleProps } from "../AccordionPageSvelte.types";
    import { SECTION_BODIES } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";

    const ITEMS: AccordionItem<string>[] = [
        { value: "Shipping" },
        { value: "Returns" },
        { value: "Warranty" },
        { value: "Unavailable", isDisabled: true },
    ];

    type Props = AccordionBasicDocsExampleProps;

    let props: Props = $props();
</script>

<div class={styles.docsAccordion}>
    <Accordion
        items={ITEMS}
        isSingleExpand={props.isSingleExpand}
        isExpandRequired={props.isExpandRequired}
        gap={props.gap}
        transitionDurationMs={props.transitionDurationMs}
    >
        {#snippet renderSection(renderContent, _, flags)}
            <PageAccordionWrapper {flags}>{@render renderContent()}</PageAccordionWrapper>
        {/snippet}

        {#snippet renderHeader(item, flags)}
            <PageAccordionHeader {flags}>{item.value}</PageAccordionHeader>
        {/snippet}

        {#snippet renderPanel(item, visibilityTarget, transitionDurationMs)}
            <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
                {#each SECTION_BODIES[item.value] as line (line)}
                    <div>{line}</div>
                {/each}
            </PageAccordionPanel>
        {/snippet}
    </Accordion>
</div>
