<script lang="ts">
    import { Accordion, Button } from "@thewaver/ss-components-svelte";
    import type { AccordionItem } from "@thewaver/ss-components-svelte";
    import { DOCS_GAP, ENABLED_SECTION_BODIES } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

    import PageControlRow from "../../../../PageComponents/ControlRow/PageControlRow.svelte";
    import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import PageAccordionWrapper from "../../../../StyledComponents/AccordionContent/PageAccordionWrapper.svelte";
    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";

    const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }, { value: "Returns" }, { value: "Warranty" }];

    let expanded = $state<string[]>(["Shipping"]);
</script>

<div class={styles.docsAccordion}>
    <Accordion items={ITEMS} gap={DOCS_GAP} bind:expanded>
        {#snippet renderSection(renderContent, _, flags)}
            <PageAccordionWrapper {flags}>{@render renderContent()}</PageAccordionWrapper>
        {/snippet}

        {#snippet renderHeader(item, flags)}
            <PageAccordionHeader {flags}>{item.value}</PageAccordionHeader>
        {/snippet}

        {#snippet renderPanel(item, visibilityTarget, transitionDurationMs)}
            <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
                {#each ENABLED_SECTION_BODIES[item.value] as line (line)}
                    <div>{line}</div>
                {/each}
            </PageAccordionPanel>
        {/snippet}
    </Accordion>
</div>

<PageControlRow>
    <Button
        onClick={() => {
            expanded = ITEMS.map((item) => item.value);
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Open all</PageButtonContent>
        {/snippet}
    </Button>

    <Button
        onClick={() => {
            expanded = [];
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Close all</PageButtonContent>
        {/snippet}
    </Button>
</PageControlRow>
