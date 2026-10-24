<script lang="ts">
    import { Accordion, Button } from "@thewaver/ss-components-svelte";
    import type { AccordionItem } from "@thewaver/ss-components-svelte";
    import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

    import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";

    const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }];

    let expanded = $state<string[]>(["Shipping"]);
    let extraLines = $state(0);
</script>

<div class={styles.docsAccordion}>
    <Accordion items={ITEMS} gap={DOCS_GAP} bind:expanded>
        {#snippet renderHeader(item, flags)}
            <PageAccordionHeader {flags}>{item.value}</PageAccordionHeader>
        {/snippet}

        {#snippet renderPanel(_, visibilityTarget, transitionDurationMs)}
            <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
                <div class={styles.growingButtons}>
                    <Button
                        id={"addALine"}
                        onClick={() => {
                            extraLines += 1;
                        }}
                    >
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>Add a line</PageButtonContent>
                        {/snippet}
                    </Button>

                    <Button
                        id={"clearLines"}
                        onClick={() => {
                            extraLines = 0;
                        }}
                    >
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>Clear lines</PageButtonContent>
                        {/snippet}
                    </Button>
                </div>

                {#each Array.from({ length: extraLines }) as _unused, index (index)}
                    <div>Line {index + 1} appeared after the panel was already open.</div>
                {/each}
            </PageAccordionPanel>
        {/snippet}
    </Accordion>
</div>
